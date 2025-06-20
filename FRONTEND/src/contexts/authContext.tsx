import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, setIsLoading: setUserLoading } = useUser();

  // Check for existing session on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setIsAuthenticated(true);
        
        // Restore user data to context
        setUser({
            name: userData.name || userData.fullName || `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            role: userData.role,
            department: userData.department || "Unknown Department",
            phone: userData.phone || "",
            employeeId: userData.employeeId || userData.id || "",
            joinedDate: userData.joinedDate || userData.createdAt || "Unknown",
            avatarUrl: userData.avatarUrl || userData.profilePicture || null,
            reportsSubmitted: userData.stats?.reportsSubmitted || userData.reportsSubmitted || 0,
            activeRisks: userData.stats?.activeRisks || userData.activeRisks || 0,
            initials: ''
        });
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    
    setIsLoading(false);
    setUserLoading(false);
  }, [setUser, setUserLoading]);

  const login = (newToken: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      token,
      login,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}