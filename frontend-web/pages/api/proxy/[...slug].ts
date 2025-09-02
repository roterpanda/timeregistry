import {NextApiRequest, NextApiResponse} from "next";
import {signRequest} from "@/lib/signRequest";
import axios from "axios";

const allowedEndpoints: RegExp[] = [
  /^v1\/user$/,
  /^v1\/project$/,
  /^v1\/project\/\d+/,
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slugParts = req.query.slug;
  const rawEndpoint = Array.isArray(slugParts) ? slugParts.join("/") : slugParts || "";

  // SSRF mitigation: block path traversal, backslash, and percent-encoded variants
  const forbiddenPatterns = [
    /\.\./,          // path traversal
    /\\/,            // backslash
    /\/\//,          // double slash
    /%2e/i,          // percent-encoded .
    /%2f/i,          // percent-encoded /
    /%5c/i           // percent-encoded \
  ];
  const hasForbidden = forbiddenPatterns.some((re) => re.test(rawEndpoint));
  const isAllowedEndpoint = allowedEndpoints.some((val) => val.test(rawEndpoint));
  const endpoint = isAllowedEndpoint && !hasForbidden ? rawEndpoint : null;
  if (!endpoint) {
    res.status(400).json({error: {message: "Invalid endpoint"}});
    return;
  }
  const timestamp = Date.now().toString();
  const method = req.method || "GET";
  const signature = signRequest(method, "api/" + endpoint, timestamp);

  try {
    const response = await axios({
      method,
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}`,
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