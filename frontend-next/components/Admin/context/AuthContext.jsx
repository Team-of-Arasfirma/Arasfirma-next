"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";

const AuthContext = createContext();

const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"];

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const normalizeUser = (input = {}, fallbackToken = "") => {
  const role = input.role || input.user?.role || "super_admin";
  const user = input.user && typeof input.user === "object" ? input.user : input;

  return {
    _id: user._id || input._id || "",
    name: user.name || input.name || "",
    email: user.email || input.email || "",
    role,
    isActive: typeof user.isActive === "boolean" ? user.isActive : input.isActive,
    permissions: user.permissions || input.permissions || null,
    token: input.token || fallbackToken || "",
  };
};

const buildLegacyPayload = (user, token, source = {}) => ({
  ...source,
  success: true,
  token,
  user,
  admin: user,
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const safeParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const inactivityTimer = useRef(null);

  const clearStoredAuth = useCallback(() => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminInfo");
  }, []);

  const redirectToLogin = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(() => {
      setUser(null);
      setToken("");
      clearStoredAuth();

      if (typeof window !== "undefined") {
        ACTIVITY_EVENTS.forEach((event) =>
          window.removeEventListener(event, resetTimer),
        );
      }

      if (
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/admin")
      ) {
        alert("You have been logged out due to inactivity.");
        redirectToLogin();
      }
    }, INACTIVITY_TIMEOUT);
  }, [clearStoredAuth, redirectToLogin]);

  const stopActivityListeners = useCallback(() => {
    if (typeof window !== "undefined") {
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, resetTimer),
      );
    }

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
  }, [resetTimer]);

  const startActivityListeners = useCallback(() => {
    if (typeof window === "undefined") return;

    stopActivityListeners();
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();
  }, [resetTimer, stopActivityListeners]);

  const logout = useCallback(() => {
    setUser(null);
    setToken("");
    clearStoredAuth();
    stopActivityListeners();
    redirectToLogin();
  }, [clearStoredAuth, redirectToLogin, stopActivityListeners]);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    try {
      const storedToken = localStorage.getItem("token") || "";
      const storedUser = safeParse(localStorage.getItem("user"));
      const legacyAuth = safeParse(localStorage.getItem("adminInfo"));

      const source = storedUser || legacyAuth?.user || legacyAuth?.admin || legacyAuth;
      const resolvedToken = storedToken || legacyAuth?.token || source?.token || "";

      if (!resolvedToken && !source) {
        setLoading(false);
        return;
      }

      if (resolvedToken && isTokenExpired(resolvedToken)) {
        clearStoredAuth();
        setLoading(false);
        return;
      }

      const normalizedUser = normalizeUser(source || {}, resolvedToken);

      if (!normalizedUser._id && !normalizedUser.email && !normalizedUser.name) {
        clearStoredAuth();
        setLoading(false);
        return;
      }

      setUser(normalizedUser);
      setToken(resolvedToken);
      localStorage.setItem("token", resolvedToken);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem(
        "adminInfo",
        JSON.stringify(buildLegacyPayload(normalizedUser, resolvedToken, legacyAuth || {})),
      );
      startActivityListeners();
    } catch {
      clearStoredAuth();
      setUser(null);
      setToken("");
    } finally {
      setLoading(false);
    }

    return () => stopActivityListeners();
  }, [clearStoredAuth, startActivityListeners, stopActivityListeners]);

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        setUser(null);
        setToken("");
        clearStoredAuth();
        stopActivityListeners();

        if (
          typeof window !== "undefined" &&
          window.location.pathname.startsWith("/admin")
        ) {
          alert("Your session has expired. Please log in again.");
          redirectToLogin();
        }
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [clearStoredAuth, redirectToLogin, stopActivityListeners, token]);

  const login = (authData = {}) => {
    const source = authData.user || authData.admin || authData;
    const resolvedToken = authData.token || source?.token || "";
    const normalizedUser = normalizeUser(source || {}, resolvedToken);

    setUser(normalizedUser);
    setToken(resolvedToken);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("token", resolvedToken);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem(
          "adminInfo",
          JSON.stringify(buildLegacyPayload(normalizedUser, resolvedToken, authData)),
        );
      } catch {
        // Ignore storage failures and keep the in-memory session active.
      }
    }

    startActivityListeners();
  };

  const value = {
    user,
    token,
    admin: user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
