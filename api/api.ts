import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export type ApiError = {
  message: string;
  status?: number;
  data?: unknown;
};

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

function attachAuthHeader(config: InternalAxiosRequestConfig) {
  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
}

function toApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    return {
      message:
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message ??
        "Request failed",
      status: error.response?.status,
      data: error.response?.data,
    };
  }

  return {
    message: error instanceof Error ? error.message : "Unexpected error",
  };
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(attachAuthHeader);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      onUnauthorized?.();
    }

    return Promise.reject(toApiError(error));
  },
);

export async function apiRequest<T>(request: Promise<{ data: T }>): Promise<T> {
  const response = await request;
  return response.data;
}

export default api;
