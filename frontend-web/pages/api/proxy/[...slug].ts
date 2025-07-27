import {NextApiRequest, NextApiResponse} from "next";
import {signRequest} from "@/lib/signRequest";
import axios from "axios";

const allowedEndpoints: string[] = [
  "register",
  "login",
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slugParts = req.query.slug;
  const rawEndpoint = Array.isArray(slugParts) ? slugParts.join("/") : slugParts || "";
  const endpoint = allowedEndpoints.includes(rawEndpoint) ? rawEndpoint : null;
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
    });
    res.status(response.status).json(response.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      res
        .status(err.response?.status || 500)
        .json({
          error: {
            message: err.response?.data?.message || "An error occurred while processing your request.",
          },
        });
    }
  }
}