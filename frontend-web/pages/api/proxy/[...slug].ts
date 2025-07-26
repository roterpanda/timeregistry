import { NextApiRequest, NextApiResponse } from "next";
import { signRequest } from "@/lib/signRequest";
import axios from "axios";

const allowedEndpoints: string[] = [
  "register",
  "login",
  "v1/protected",
  "sanctum/csrf-cookie",
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slugParts = req.query.slug;
  const rawEndpoint = Array.isArray(slugParts)
    ? slugParts.join("/")
    : slugParts || "";
  const endpoint = allowedEndpoints.includes(rawEndpoint) ? rawEndpoint : null;
  if (!endpoint) {
    res.status(400).json({ error: { message: "Invalid endpoint" } });
    return;
  }
  const timestamp = Date.now().toString();
  const method = req.method || "GET";
  const signature = signRequest(method, endpoint, timestamp);

  try {
    const response = await axios({
      method,
      url: `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`,
      headers: {
        "X-Request-Timestamp": timestamp,
        "X-Request-Signature": signature,
        "Content-Type": req.headers["content-type"] || "application/json",
        Cookie: req.headers.cookie || "",
        "X-XSRF-TOKEN": req.headers["x-xsrf-token"] || "",
      },
      data: req.body,
      params: req.query,
      withCredentials: true,
    });
    if (response.headers["set-cookie"]) {
      res.setHeader("Set-Cookie", response.headers["set-cookie"]);
    }
    res.status(response.status).json(response.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      res.status(err.response?.status || 500).json({
        error: {
          message:
            err.response?.data?.message ||
            "An error occurred while processing your request.",
        },
      });
    }
  }
}
