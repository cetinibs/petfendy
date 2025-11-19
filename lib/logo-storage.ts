// Logo management for admin panel
export interface LogoSettings {
  headerLogo: string // Main logo in header/navbar
  faviconUrl: string // Favicon
  loginPageLogo: string // Logo on login page
  footerLogo: string // Logo in footer
  emailLogo: string // Logo for email templates
  lastUpdated: string
}

const LOGO_STORAGE_KEY = "petfendy_logo_settings"

const DEFAULT_LOGOS: LogoSettings = {
  headerLogo: "/petfendy-logo.svg",
  faviconUrl: "/favicon.ico",
  loginPageLogo: "/petfendy-logo.svg",
  footerLogo: "/petfendy-logo.svg",
  emailLogo: "/petfendy-logo.svg",
  lastUpdated: new Date().toISOString(),
}

export function getLogoSettings(): LogoSettings {
  if (typeof window === "undefined") return DEFAULT_LOGOS

  try {
    const stored = localStorage.getItem(LOGO_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error loading logo settings:", error)
  }

  return DEFAULT_LOGOS
}

export function saveLogoSettings(settings: LogoSettings): void {
  if (typeof window === "undefined") return

  try {
    settings.lastUpdated = new Date().toISOString()
    localStorage.setItem(LOGO_STORAGE_KEY, JSON.stringify(settings))

    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent("logoUpdated", { detail: settings }))
  } catch (error) {
    console.error("Error saving logo settings:", error)
  }
}

export function updateLogo(logoType: keyof Omit<LogoSettings, "lastUpdated">, url: string): void {
  const settings = getLogoSettings()
  settings[logoType] = url
  saveLogoSettings(settings)
}

export function resetLogos(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(LOGO_STORAGE_KEY)
    window.dispatchEvent(new CustomEvent("logoUpdated", { detail: DEFAULT_LOGOS }))
  } catch (error) {
    console.error("Error resetting logos:", error)
  }
}

// Helper to convert file to base64 data URL
export async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error("Failed to read file"))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/webp"]
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Sadece JPG, PNG, SVG ve WebP formatları desteklenmektedir.",
    }
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Dosya boyutu 5MB'dan küçük olmalıdır.",
    }
  }

  return { valid: true }
}
