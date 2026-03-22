import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { login } from "@/services/authentication/login.service";
import { extractAccessTokenFromLoginResponse, setAccessToken } from "@/services/api-config";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login({ phone, password, platform: "web" });
      const resp = data as any;
      const serverUser =
        resp?.user ??
        resp?.data?.user ??
        (resp?.data && typeof resp.data === "object" && ("id" in resp.data || "email" in resp.data || "phone" in resp.data)
          ? resp.data
          : null);
      const user = serverUser ?? { phone };
      localStorage.setItem("current_user", JSON.stringify(user));
      const token = extractAccessTokenFromLoginResponse(resp);
      if (!token) {
        toast.error("Logged in but no access token was found in the response.");
        setLoading(false);
        return;
      }
      const rawExpiresIn = resp?.data?.expires_in ?? resp?.expires_in;
      const rawExpiresAt = resp?.data?.expires_at ?? resp?.expires_at;
      let expiredAt: number | undefined;
      if (typeof rawExpiresIn === "number" && rawExpiresIn > 0) {
        expiredAt = Math.floor(Date.now() / 1000) + rawExpiresIn;
      } else if (typeof rawExpiresAt === "number" && rawExpiresAt > 1e12) {
        expiredAt = Math.floor(rawExpiresAt / 1000);
      } else if (typeof rawExpiresAt === "number") {
        expiredAt = rawExpiresAt;
      }
      setAccessToken(token, expiredAt);
      toast.success("Logged in");
      navigate("/account");
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-xl border border-border p-6">
        <h1 className="font-display text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Phone</Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0123456789"
              required
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

