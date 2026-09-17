import { toast } from "sonner";
import { deleteCookie, getCookie, setCookie, setUserRole } from "./auth";
import { ApiResponse } from "./types";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Next.js fetch cache options */
  cache?: RequestCache;
  /** Next.js fetch revalidate options (ISR) */
  next?: { revalidate?: number; tags?: string[] };
}

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function customFetch<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { headers, body, next, cache, ...rest } = options;

  let token = getCookie("JWT_TOKEN");

  // Token is a string from cookies, no need to await

  // Redirect to login if token is missing and route is protected
  if (!url.includes("auth/login") && !url.includes("auth/register")) {
    if (!token || token === "undefined") {
      deleteCookie("JWT_TOKEN");
      toast.error("يجب تسجيل الدخول أولاً");
      if (typeof window !== "undefined") {
        // TODO:must be back
        // window.location.href = "/auth/login";
      }
      throw new Error("No token provided");
    }
  }

  const reqHeaders: Record<string, string> = {
    ...((headers as Record<string, string>) || {}),
  };

  if (token && token !== "undefined") {
    reqHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Handle JSON vs FormData
  const isFormData = body instanceof FormData;
  if (!isFormData && body !== undefined) {
    reqHeaders["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    ...rest,
    headers: reqHeaders,
    body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    cache,
    next,
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, config);

  // No content
  if (response.status === 204) {
    return null as T;
  }

  let json: ApiResponse<T>;
  try {
    json = await response.json();
  } catch (err) {
    throw new ApiError("فشل في قراءة الاستجابة", response.status);
  }

  if (!response.ok || (json.success === false)) {
    if (response.status === 401) {
      deleteCookie("JWT_TOKEN");
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }

    // Display validation errors if it's 400
    if (response.status === 400 && typeof json.data === "object" && json.data) {
      Object.values(json.data).forEach((msg) => toast.error(msg as string));
    } else {
      toast.error(json.message || "حدث خطأ غير متوقع");
    }

    throw new ApiError(json.message || `HTTP Error: ${response.status}`, response.status, json.data);
  }

  // Auto-save token and role on login
  if (url.includes("auth/login") && json.data) {
    const responseData = json.data as any;
    if (responseData.token) {
      setCookie("JWT_TOKEN", responseData.token, 7, { secure: true }); // 7 days
    }
    if (responseData.role) {
      setUserRole(responseData.role);
    }
  }

  return json.data;
}

export const api = {
  get: <T>(url: string, options?: RequestOptions) =>
    customFetch<T>(url, { ...options, method: "GET" }),

  post: <T, D = unknown>(url: string, body?: D, options?: RequestOptions) =>
    customFetch<T>(url, { ...options, method: "POST", body }),

  put: <T, D = unknown>(url: string, body?: D, options?: RequestOptions) =>
    customFetch<T>(url, { ...options, method: "PUT", body }),

  patch: <T, D = unknown>(url: string, body?: D, options?: RequestOptions) =>
    customFetch<T>(url, { ...options, method: "PATCH", body }),

  delete: <T>(url: string, options?: RequestOptions) =>
    customFetch<T>(url, { ...options, method: "DELETE" }),

  /**
   * Upload file using FormData (Content-Type header is automatically handled by browser)
   */
  upload: <T>(url: string, formData: FormData, options?: RequestOptions) =>
    customFetch<T>(url, { ...options, method: "POST", body: formData }),
};
