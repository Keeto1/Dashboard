// Mock auth service (no firebase dependency)
import { users as mockUsers } from '../mock/data'

const delay = (ms = 100) => new Promise(res => setTimeout(res, ms))

export async function loginUser(email, password) {
  await delay()
  const user = mockUsers.find(u => u.email === email)
  if (!user) throw new Error('Invalid credentials')
  return { uid: user.id, email: user.email, ...user }
}

export async function registerUser(email, password, userData) {
  await delay()
  const id = String(Date.now())
  const newUser = { id, email, ...userData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  mockUsers.unshift(newUser)
  return { uid: id, email, ...newUser }
}

export async function logoutUser() {
  await delay()
  return { success: true }
}

export async function resetPassword(email) {
  await delay()
  // no-op in mock
  return { success: true }
}

export function getCurrentUser() {
  return null
}

export function onAuthChange(callback) {
  // no-op in mock
  return () => {}
}

export async function getUserData(uid) {
  await delay()
  const user = mockUsers.find(u => u.id === uid)
  return user || null
}
// (mock implementations above)
