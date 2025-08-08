export function generateTestUser() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return {
    username: `testuser${timestamp}_${random}`,
    email: `test_${timestamp}_${random}@example.com`,
    password: "password123",
  }
}