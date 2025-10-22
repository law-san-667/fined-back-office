import Axios from "axios";
import Cookies from "js-cookie";

if (!process.env.BACKEND_URL) {
  throw new Error("BACKEND_URL is not set");
}

const url = process.env.BACKEND_URL;

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function buildRefreshUrl() {
  const explicit = process.env.AUTH_REFRESH_URL;
  if (explicit) return explicit;
  if (!url) return "";
  // Fallback: BACKEND_URL + "/auth/refresh"
  return url.replace(/\/?$/, "") + "/auth/refresh";
}

const api = Axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

const RefreshApiToken = async () => {
  try {
    if (!isBrowser()) return null;
    const token = Cookies.get("refreshToken");
    const refreshUrl = buildRefreshUrl();
    if (!refreshUrl) return null;
    const result = await Axios.post(
      refreshUrl,
      {},
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
    );
    Cookies.set("accessToken", result.data.accessToken);
    Cookies.set("refreshToken", result.data.refreshToken);

    return result?.data?.accessToken;
  } catch (error: any) {
    throw new Error(error);
  }
};

api.interceptors.request.use(
  async (config) => {
    if (isBrowser()) {
      const token = Cookies.get("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      // Refresh tokens only in the browser
      if (isBrowser() && window.location.pathname !== "/") {
        originalRequest._retry = true;
        const result = await RefreshApiToken();
        api.defaults.headers.common["Authorization"] = `Bearer ${result}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
