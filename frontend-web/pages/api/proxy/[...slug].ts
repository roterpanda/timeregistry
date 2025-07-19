import {NextApiRequest, NextApiResponse} from 'next';
import {signRequest} from "@/lib/signRequest";
import axios from "axios";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const slugParts = req.query.slug;
    const endpoint = Array.isArray(slugParts) ? slugParts.join('/') : slugParts || '';
    const timestamp = Date.now().toString();
    const method = req.method || 'GET';
    const signature = signRequest(method, 'api/' + endpoint, timestamp);

    try {
        const response = await axios({
            method,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}`,
            headers: {
                'X-Request-Timestamp': timestamp,
                'X-Request-Signature': signature,
                Authorization: req.headers.authorization || '',
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
                        message: err.response?.data?.message || 'An error occurred while processing your request.',
                    },
                });
        }
    }
}