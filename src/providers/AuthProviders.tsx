"use client";

import { AuthContext } from "@/contexts/AuthContext";
import { getUserInfo } from "@/services/auth/getUserInfo";
import type { UserInfo } from "@/types/user.interface";
import { useCallback, useEffect, useRef, useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const isFetching = useRef(false);

  const refetchUser = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const data = await getUserInfo();
      setUser(data || null);
    } catch {
      setUser(null);
    } finally {
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setLoading(true);
      await refetchUser();
      if (!cancelled) setLoading(false);
    };

    init();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = async () => await refetchUser();
    const handleSessionExpired = () => setUser(null);

    window.addEventListener("userChanged", handler);
    window.addEventListener("sessionExpired", handleSessionExpired);

    return () => {
      window.removeEventListener("userChanged", handler);
      window.removeEventListener("sessionExpired", handleSessionExpired);
    };
  }, [refetchUser]);

  return (
    <AuthContext.Provider value={{ user, loading, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}
