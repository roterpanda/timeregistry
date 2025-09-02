import {NextApiRequest, NextApiResponse} from "next";
import {signRequest} from "@/lib/signRequest";
import axios from "axios";

const allowedEndpoints: RegExp[] = [
  /^v1\/user$/,
  /^v1\/project$/,
  /^v1\/project\/\d+$/,
];

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!BACKEND_BASE_URL || !BACKEND_BASE_URL.startsWith("http")) {
  throw new Error("Invalid BACKEND_BASE_URL configuration");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slugParts = req.query.slug;
  const rawEndpoint = Array.isArray(slugParts) ? slugParts.join("/") : slugParts || "";

  const forbiddenPatterns = [
    /\.\./,          // path traversal
    /\\/,            // backslash
    /\/\//,          // double slash
    /%2e/i,          // percent-encoded .
    /%2f/i,          // percent-encoded /
    /%5c/i,          // percent-encoded \
    /localhost/i,    // localhost access
    /127\.0\.0\.1/,  // loopback IP
    /192\.168\./,    // private network
    /10\./,          // private network
    /172\.(1[6-9]|2[0-9]|3[0-1])\./, // private network
    /[?#]/,          // query params or fragments in endpoint
  ];

  // Strict validation
  if (rawEndpoint.length > 100) { // max length check
    res.status(400).json({error: {message: "Endpoint too long"}});
    return;
  }

  const hasForbidden = forbiddenPatterns.some((re) => re.test(rawEndpoint));
  const isAllowedEndpoint = allowedEndpoints.some((val) => val.test(rawEndpoint));

  if (!isAllowedEndpoint || hasForbidden) {
    res.status(400).json({error: {message: "Invalid endpoint"}});
    return;
  }

  const targetUrl = `${BACKEND_BASE_URL}/api/${rawEndpoint}`;
  const targetUrlObj = new URL(targetUrl);

  const timestamp = Date.now().toString();
  const method = req.method || "GET";
  const signature = signRequest(method, "api/" + rawEndpoint, timestamp);

  try {
    const response = await axios({
      method,
      url: targetUrl,
      headers: {
        "X-Request-Timestamp": timestamp,
        "X-Request-Signature": signature,
        Authorization: req.headers.authorization || "",
        ...req.headers,
      },
      data: req.body,
      params: req.query,
      withCredentials: true,
      withXSRFToken: true
    });
    res.status(response.status).json(response.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      res
        .status(err.response?.status || 500)
        .json({
          error: {
            message: err.response?.data?.message || "An error occurred while processing your request.",
            details: err.response?.data || null
          },
        });
    } else {
      res.status(500).json({ error: { message: "Unknown error occurred." } });
    }
  }
}