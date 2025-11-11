#!/usr/bin/env node

/**
 * Secret Scanner
 * PRD Requirement #9: Scan for exposed secrets before build
 *
 * This script scans the codebase for potential secrets and API keys
 * Run during CI/CD or before deployment to prevent secret leaks
 *
 * Usage: node scripts/scan-secrets.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const SCAN_DIRS = ['app', 'components', 'lib', 'pages', 'public'];
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build'];
const IGNORE_FILES = ['.env.example', 'scan-secrets.js'];

// ============================================================================
// SECRET PATTERNS
// ============================================================================

const SECRET_PATTERNS = [
  {
    name: 'AWS Access Key',
    pattern: /AKIA[0-9A-Z]{16}/g,
    severity: 'CRITICAL',
  },
  {
    name: 'AWS Secret Key',
    pattern: /aws_secret_access_key\s*=\s*['"][^'"]+['"]/gi,
    severity: 'CRITICAL',
  },
  {
    name: 'Generic API Key',
    pattern: /['"]?api[_-]?key['"]?\s*[:=]\s*['"][a-zA-Z0-9]{20,}['"]/gi,
    severity: 'HIGH',
  },
  {
    name: 'Generic Secret',
    pattern: /['"]?secret['"]?\s*[:=]\s*['"][a-zA-Z0-9]{20,}['"]/gi,
    severity: 'HIGH',
  },
  {
    name: 'Private Key',
    pattern: /-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----/g,
    severity: 'CRITICAL',
  },
  {
    name: 'JWT Secret (hardcoded)',
    pattern: /jwt[_-]?secret\s*[:=]\s*['"][^'"]{8,}['"]/gi,
    severity: 'CRITICAL',
  },
  {
    name: 'Database URL',
    pattern: /(postgres|mysql|mongodb):\/\/[^@]+@[^\/]+/gi,
    severity: 'HIGH',
  },
  {
    name: 'SendGrid API Key',
    pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g,
    severity: 'CRITICAL',
  },
  {
    name: 'Stripe API Key',
    pattern: /sk_(live|test)_[a-zA-Z0-9]{24,}/g,
    severity: 'CRITICAL',
  },
  {
    name: 'Password (hardcoded)',
    pattern: /password\s*[:=]\s*['"][^'"]{6,}['"]/gi,
    severity: 'HIGH',
  },
  {
    name: 'NEXT_PUBLIC with sensitive name',
    pattern: /NEXT_PUBLIC_(SECRET|KEY|PASSWORD|TOKEN|API)/g,
    severity: 'CRITICAL',
  },
];

// Allowed exceptions (common false positives)
const ALLOWED_PATTERNS = [
  'your-api-key-here',
  'your-secret-here',
  'change-in-production',
  'petfendy-jwt-secret',
  'petfendy-secret-key',
  'mock_',
  'example_',
  'test_key',
  'demo_key',
  '***',
  'xxx',
  'placeholder',
  '$2a$',          // bcrypt hashes (safe to store)
  '$2b$',          // bcrypt hashes (safe to store)
  'eşleşmiyor',    // Turkish UI text
  'şifre',         // Turkish for password (UI text)
  'parola',        // Turkish for password (UI text)
  'password" =',   // Translation syntax
];

// ============================================================================
// SCANNER
// ============================================================================

class SecretScanner {
  constructor() {
    this.findings = [];
    this.fileCount = 0;
  }

  /**
   * Scan directory recursively
   */
  scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip ignored directories
      if (entry.isDirectory()) {
        if (!IGNORE_DIRS.includes(entry.name)) {
          this.scanDirectory(fullPath);
        }
        continue;
      }

      // Skip non-text files
      if (
        !entry.name.match(/\.(js|jsx|ts|tsx|json|env|yml|yaml|md|txt|config)$/)
      ) {
        continue;
      }

      // Skip ignored files
      if (IGNORE_FILES.some((f) => entry.name.includes(f))) {
        continue;
      }

      this.scanFile(fullPath);
    }
  }

  /**
   * Scan individual file
   */
  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.fileCount++;

      const lines = content.split('\n');

      lines.forEach((line, lineNumber) => {
        for (const { name, pattern, severity } of SECRET_PATTERNS) {
          const matches = line.match(pattern);

          if (matches) {
            for (const match of matches) {
              // Check if it's an allowed pattern (false positive)
              const isAllowed = ALLOWED_PATTERNS.some((allowed) =>
                match.toLowerCase().includes(allowed.toLowerCase())
              );

              if (!isAllowed) {
                this.findings.push({
                  file: path.relative(process.cwd(), filePath),
                  line: lineNumber + 1,
                  type: name,
                  severity,
                  match: match.substring(0, 50), // Truncate for safety
                });
              }
            }
          }
        }
      });
    } catch (error) {
      console.error(`Error scanning ${filePath}:`, error.message);
    }
  }

  /**
   * Generate report
   */
  generateReport() {
    console.log('\n');
    console.log('='.repeat(80));
    console.log('SECRET SCANNER REPORT');
    console.log('='.repeat(80));
    console.log(`Files scanned: ${this.fileCount}`);
    console.log(`Findings: ${this.findings.length}`);
    console.log('='.repeat(80));
    console.log('\n');

    if (this.findings.length === 0) {
      console.log('✅ No secrets detected!');
      console.log('\n');
      return true;
    }

    // Group by severity
    const critical = this.findings.filter((f) => f.severity === 'CRITICAL');
    const high = this.findings.filter((f) => f.severity === 'HIGH');

    if (critical.length > 0) {
      console.log('🔴 CRITICAL FINDINGS:');
      console.log('-'.repeat(80));
      critical.forEach(this.printFinding);
      console.log('\n');
    }

    if (high.length > 0) {
      console.log('🟠 HIGH PRIORITY FINDINGS:');
      console.log('-'.repeat(80));
      high.forEach(this.printFinding);
      console.log('\n');
    }

    console.log('='.repeat(80));
    console.log('❌ BUILD FAILED: Secrets detected in codebase');
    console.log('='.repeat(80));
    console.log('\n');
    console.log('Action Required:');
    console.log('1. Remove hardcoded secrets from the codebase');
    console.log('2. Move secrets to .env files (gitignored)');
    console.log('3. Use environment variables instead');
    console.log('4. Rotate any exposed credentials immediately');
    console.log('\n');

    return false;
  }

  /**
   * Print individual finding
   */
  printFinding(finding) {
    console.log(`\nFile: ${finding.file}:${finding.line}`);
    console.log(`Type: ${finding.type}`);
    console.log(`Severity: ${finding.severity}`);
    console.log(`Match: ${finding.match}...`);
  }
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  console.log('\n🔍 Starting secret scan...\n');

  const scanner = new SecretScanner();

  // Scan configured directories
  for (const dir of SCAN_DIRS) {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      scanner.scanDirectory(fullPath);
    }
  }

  // Generate report
  const passed = scanner.generateReport();

  // Exit with appropriate code
  process.exit(passed ? 0 : 1);
}

// Run scanner
main();
