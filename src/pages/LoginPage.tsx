
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Required fields missing",
        description: "Both email and password are required.",
      });
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome back to ICU Insight!",
      });
      navigate("/");
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <LogIn className="mr-2 h-6 w-6 text-medical-600" />
              Login to ICU Insight
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-medical-600 hover:bg-medical-700"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-medical-600 hover:underline">
                  Create one
                </Link>
              </div>
              
              <div className="text-sm text-center text-gray-500 mt-2 pt-2 border-t border-gray-200">
                <p>Demo Account:</p>
                <p>Email: user@example.com</p>
                <p>Password: password123</p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
