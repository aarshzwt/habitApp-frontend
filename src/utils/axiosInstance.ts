import axios from 'axios';
import toast from 'react-hot-toast';

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: { "Content-Type": "application/json" }
});

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
    console.log("error response in 401:", error.response);
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
              toast.error("Session expired. Please login again.");
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

    return Promise.reject(error);
  }
);


// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:5000/api/',
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     toast.error('Request failed, please try again.');
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         // Already refreshing → queue the request
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return axiosInstance(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }
//       originalRequest._retry = true;
//       isRefreshing = true;

//       const refreshToken = localStorage.getItem('refreshToken');
//       if (refreshToken) {
//         try {
//           const response = await axiosInstance.post('http://localhost:5000/api/auth/refresh-token', { refreshToken });
//           console.log("refreshToken response:", response)
//           const token = response.data.accessToken;
//           console.log('token', token)

//           localStorage.setItem('token', token);

//           // Retry the original request with the new token
//           // originalRequest.headers.Authorization = `Bearer ${token}`;
//           processQueue(null, token);
//           // return axios(originalRequest);
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return axiosInstance(originalRequest);
//         } catch (error) {
//           processQueue(error, null);
//           localStorage.removeItem('token');
//           localStorage.removeItem('refreshToken');
//           toast.error('Session expired. Please login again.');
//           return Promise.reject(error);
//         } finally {
//           isRefreshing = false;
//         }
//       } else {
//         toast.error('Session expired. Please login again.');
//         return Promise.reject(error);
//       }

//     }
//     return Promise.reject(error)
//   },
// )

export default axiosInstance;
