import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from "@/services/admin-service/authentication/login.service";
import { extractAccessTokenFromLoginResponse, removeAuthTokens, setAccessToken } from '@/services/api-config';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response: any = await adminLogin({ email, password });
      const serverUser =
        response?.user ??
        response?.data?.user ??
        (response?.data &&
        typeof response.data === "object" &&
        ("id" in response.data || "email" in response.data || "phone" in response.data || "role" in response.data)
          ? response.data
          : null);
      const role = typeof serverUser?.role === "string" ? serverUser.role.toLowerCase() : "";
      const token = extractAccessTokenFromLoginResponse(response);
      if (!token) {
        toast.error("Login succeeded but access token is missing");
        return;
      }
      if (role !== "admin") {
        removeAuthTokens();
        localStorage.removeItem("current_user");
        toast.error("Access denied. Admin account required.");
        navigate("/", { replace: true });
        return;
      }
      localStorage.setItem("current_user", JSON.stringify(serverUser ?? { email, role: "admin" }));
      setAccessToken(token);
      toast.success(response?.message || 'Login successful');
      navigate('/admin/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20">
              Admin Panel
            </Badge>
          </div>
          <CardTitle className="text-3xl font-display font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground font-body">
            Enter your credentials to access the management panel
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 font-body bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-body text-sm font-medium">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 font-body bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-2 pb-8">
            <Button 
              type="submit" 
              className="w-full h-11 font-body font-semibold text-base transition-all hover:scale-[1.01] active:scale-[0.99]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <div className="text-center">
              <span className="text-xs text-muted-foreground font-body">
                Demo access: <span className="font-medium text-foreground">admin@example.com / password</span>
              </span>
            </div>
          </CardFooter>
        </form>
      </Card>
      
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}