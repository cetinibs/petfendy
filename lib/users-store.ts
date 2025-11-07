// Mock user storage for development
// In production, replace with a proper database
import type { User } from "./types"

// Store for registered and verified users
export const users = new Map<string, User>()

// Store for pending users (not yet verified)
export const pendingUsers = new Map<string, User>()

// Add mock admin user
const adminUser: User = {
  id: "admin-1",
  email: "admin@petfendy.com",
  name: "Admin User",
  phone: "+90 555 000 0000",
  passwordHash: "$2a$10$mock_admin_hash", // This will be bypassed for admin@petfendy.com
  role: "admin",
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

users.set(adminUser.id, adminUser)

// Helper functions
export function findUserByEmail(email: string): User | undefined {
  for (const user of users.values()) {
    if (user.email === email) {
      return user
    }
  }
  return undefined
}

export function findPendingUserByEmail(email: string): { id: string; user: User } | undefined {
  for (const [id, user] of pendingUsers.entries()) {
    if (user.email === email) {
      return { id, user }
    }
  }
  return undefined
}

export function movePendingToVerified(userId: string): boolean {
  const user = pendingUsers.get(userId)
  if (!user) return false

  users.set(userId, user)
  pendingUsers.delete(userId)
  return true
}
