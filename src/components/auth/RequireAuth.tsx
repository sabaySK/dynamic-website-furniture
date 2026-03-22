import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { fetchProfile } from "@/services/authentication/profile.service";
import { isAuthenticated } from "@/services/api-config";

const CURRENT_USER_KEY = "current_user";

function hasStoredSessionFromLogin(): boolean {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return false;
    const u = JSON.parse(raw) as Record<string, unknown>;
    if (!u || typeof u !== "object") return false;
    return Boolean(u.id ?? u.email ?? u.phone);
  } catch {
    return false;
  }
}

type RequireAuthProps = {
  children: React.ReactNode;
};

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    let mounted = true;
    const runCheck = async () => {
      // Quick client-side check to avoid calling protected endpoint when there's no token
      if (!isAuthenticated()) {
        if (mounted) {
          setUserExists(false);
          setChecking(false);
        }
        return;
      }

      try {
        const res = await fetchProfile({ suppress401Redirect: true });
        if (!mounted) return;
        const ok = Boolean(res?.user) || (isAuthenticated() && hasStoredSessionFromLogin());
        setUserExists(ok);
      } catch {
        if (!mounted) return;
        // Profile failed (network / shape) but we have a token and login stored a user — still show account
        setUserExists(isAuthenticated() && hasStoredSessionFromLogin());
      } finally {
        if (!mounted) return;
        setChecking(false);
      }
    };

    runCheck();

    const onAuthChanged = () => {
      // re-run the check when auth status changes
      setChecking(true);
      runCheck();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth-changed", onAuthChanged);
    }
    return () => {
      mounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("auth-changed", onAuthChanged);
      }
    };
  }, []);

  if (checking) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loading size={20} className="text-primary" label="Checking authentication" />
      </div>
    );
  }

  if (!userExists) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center">
          <h2 className="font-display text-xl font-semibold mb-2">You need to sign in</h2>
          <p className="text-sm text-muted-foreground mb-6">
            This page requires an account. Please sign in or register to continue.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/login">
              <Button className="px-6">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="px-6">Register</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAuth;

