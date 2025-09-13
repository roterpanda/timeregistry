import * as crypto from 'crypto';
export function generateTestUser() {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).readUInt32BE(0) % 1000;
  return {
    username: `testuser${random}_${random}`,
    email: `test_${timestamp}_${random}@example.com`,
    password: "password123",
  }
}