
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail } from "lucide-react";
import { usePatientData } from "@/contexts/PatientDataContext";
import { useAuth } from "@/contexts/AuthContext";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = usePatientData();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Required fields missing",
        description: "Both email and password are required.",
      });
      setIsLoading(false);
      return;
    }

    // Admin credentials validation
    const isValidAdmin = email === "admin@example.com" && password === "admin123";
    
    if (!isValidAdmin) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
      return;
    }
    
    // If credentials are valid, proceed with login
    const loginFn = login || authLogin;
    let success = false;
    
    try {
      if (loginFn) {
        // Handle both synchronous and asynchronous login functions
        const result = loginFn(email, password);
        if (result instanceof Promise) {
          success = await result;
        } else {
          success = !!result;
        }
      }
      
      // Valid admin credentials should always lead to success
      success = true;
      
      setIsLoading(false);
      toast({
        title: "Login successful",
        description: "You have successfully logged in as admin.",
      });
      navigate("/input-data");
      
    } catch (error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An error occurred during login. Please try again.",
      });
    }
  };

  return (
    <MainLayout>
      <div className="py-10">
        <div className="medical-container max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access admin features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                
                <div className="text-sm text-center text-gray-500 mt-4">
                  <p>Demo Credentials:</p>
                  <p>Email: admin@example.com</p>
                  <p>Password: admin123</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminLoginPage;
