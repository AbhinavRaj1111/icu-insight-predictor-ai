
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const { signup, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validatePasswords = () => {
    if (!isLogin && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) return;
    
    let success = false;
    
    if (isLogin) {
      success = await login(email, password);
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back to ICU Insight!",
        });
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Please check your credentials and try again.",
        });
      }
    } else {
      success = await signup(email, name, password);
      if (success) {
        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
        });
        navigate("/");
      }
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <UserPlus className="mr-2 h-6 w-6 text-medical-600" />
              {isLogin ? "Welcome Back" : "Create an Account"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Sign in to access your ICU Insight account" 
                : "Join ICU Insight to track patient data and predictions"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}
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
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={!isLogin}
                  />
                  {passwordError && (
                    <p className="text-xs text-destructive">{passwordError}</p>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-medical-600 hover:bg-medical-700"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isLogin ? "Signing in..." : "Creating account...") 
                  : (isLogin ? "Sign In" : "Create Account")}
              </Button>
              <div className="text-center text-sm">
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <button 
                      type="button"
                      onClick={() => setIsLogin(false)} 
                      className="text-medical-600 hover:underline"
                    >
                      Create one
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button 
                      type="button"
                      onClick={() => setIsLogin(true)} 
                      className="text-medical-600 hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
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

export default SignupPage;
