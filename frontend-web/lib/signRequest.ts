import crypto from "crypto";

export function signRequest(method: string, url: string, timestamp: string): string {
  const secret = process.env.FRONTEND_WEB_SECRET;
  if (!secret) {
    throw new Error("Secret is not defined");
  }

  const data = `${method}${url}${timestamp}`;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(data);

  return hmac.digest("hex");
}