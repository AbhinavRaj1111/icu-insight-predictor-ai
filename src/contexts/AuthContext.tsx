
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface User {
  email: string;
  name?: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("icuInsightUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("icuInsightUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API endpoint
      // Simulating API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // This is a simplified version - in a real app, we would validate against a server
      const storedUsers = JSON.parse(localStorage.getItem("icuInsightUsers") || "[]");
      const userMatch = storedUsers.find(
        (u: any) => u.email === email && u.password === password
      );
      
      if (!userMatch) {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }

      // Create user without the password
      const authenticatedUser = {
        email: userMatch.email,
        name: userMatch.name || userMatch.email.split("@")[0],
        id: userMatch.id
      };

      setUser(authenticatedUser);
      localStorage.setItem("icuInsightUser", JSON.stringify(authenticatedUser));
      toast({
        title: "Login successful",
        description: `Welcome back, ${authenticatedUser.name}!`,
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API endpoint
      // Simulating API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const storedUsers = JSON.parse(localStorage.getItem("icuInsightUsers") || "[]");
      if (storedUsers.some((u: any) => u.email === email)) {
        toast({
          title: "Signup failed",
          description: "An account with this email already exists",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
      
      // Create new user
      const newUser = {
        email,
        name: name || email.split("@")[0],
        password,
        id: Date.now().toString()
      };
      
      // Save to "database" (localStorage)
      storedUsers.push(newUser);
      localStorage.setItem("icuInsightUsers", JSON.stringify(storedUsers));
      
      // Log in the new user
      const authenticatedUser = {
        email: newUser.email,
        name: newUser.name,
        id: newUser.id
      };
      
      setUser(authenticatedUser);
      localStorage.setItem("icuInsightUser", JSON.stringify(authenticatedUser));
      
      toast({
        title: "Signup successful",
        description: `Welcome to ICU Insight, ${authenticatedUser.name}!`,
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("icuInsightUser");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
