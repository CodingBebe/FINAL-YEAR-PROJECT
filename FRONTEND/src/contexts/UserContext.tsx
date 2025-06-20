import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  employeeId: string;
  joinedDate: string;
  avatarUrl: string | null;
  initials: string;
  reportsSubmitted: number;
  activeRisks: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Helper function to generate initials from name
  const generateInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // Function to set user data (typically called after login)
  const setUserData = (userData: Omit<User, 'initials'>) => {
    const userWithInitials: User = {
      ...userData,
      initials: generateInitials(userData.name)
    };
    setUser(userWithInitials);
    setIsLoading(false);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: setUserData, 
      updateUser, 
      isLoading, 
      setIsLoading 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}