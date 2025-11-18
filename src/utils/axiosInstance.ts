import { showErrorToast } from '@/components/toast';
import axios, { AxiosRequestConfig } from 'axios';

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: { "Content-Type": "application/json" }
});

// Helper to show all validation errors from details array
const showAllErrors = (error: any) => {
  const details = error.response?.data?.details;
  if (Array.isArray(details) && details.length > 0) {
    details.forEach((d: any) => {
      if (d.message) { showErrorToast(d.message) }
    })
  } else {
    showErrorToast(getErrorMessage(error))
  }
}

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (isRefreshing && refreshPromise) {
      // ⏸ Wait until refresh is done)
      const newToken = await refreshPromise;
      config.headers["Authorization"] = `Bearer ${newToken}`;
      return config;
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const status: number = error.response?.status

    switch (status) {
      case 401:
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (!isRefreshing) {
            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
              refreshPromise = axios
                .post("http://localhost:5000/api/auth/refresh-token", { refreshToken })
                .then((res) => {
                  const newToken = res.data.accessToken;
                  localStorage.setItem("token", newToken);
                  return newToken;
                })
                .catch((err) => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("refreshToken");
                  showErrorToast("Session expired. Please login again.");
                  return Promise.reject(err);
                })
                .finally(() => {
                  isRefreshing = false;
                });
            }
          }

          // Wait until refresh is done, then retry original request
          const newToken = await refreshPromise;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
        break
      case 400:
        showAllErrors(error)
        break
      case 500:
        showErrorToast(getErrorMessage(error))
        break
      default:
        // showErrorToast('An unexpected error occurred')
        break
    }

    return Promise.reject(error)


    return Promise.reject(error);
  }
);

export default axiosInstance as {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
}

export function getErrorMessage(error: any): string {
  if (!error) return 'Unknown error'

  // Axios-style error (most common in API calls)
  const message =
    error.response?.data?.message ||
    error.response?.data?.error?.message ||
    error.response?.data?.error ||
    error.message ||
    error.toString()

  return message || 'Something went wrong!'
}
