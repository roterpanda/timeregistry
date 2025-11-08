import axios, {AxiosError, AxiosRequestConfig} from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let onUnauthorized: (() => void) | null = null;
let onError: ((message: string) => void) | null = null;

export const setApiCallbacks = (handlers: {
  onUnauthorized?: () => void;
  onError?: (message: string) => void;
}) => {
  onUnauthorized = handlers.onUnauthorized ?? null;
  onError = handlers.onError ?? null;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (!error.response) {
      onError?.("No response received from the server.");
      return Promise.reject(error);
    }

    switch (status) {
      case 401:
        onUnauthorized?.();
        break;
      case 419:
        const config = error.config as AxiosRequestConfig & { _retry?: boolean } | undefined;
        if (!config?._retry) {
          if (config) {
            config._retry = true;
          }
          try {
            await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {withCredentials: true});
            return api(error.config!);
          } catch {}
        }
        onError?.("Session expired. Please refresh.");
        break;
      case 422:
        break;
      case 429:
          onError?.("Too many requests. Please try again later.");
          break;
      default:
        onError?.("An error occurred. Please try again later.");
    }

    return Promise.reject(error);

  }
);

export default api;