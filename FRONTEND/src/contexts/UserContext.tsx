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
  user: User;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    name: "Angel Emmanuel",
    email: "angel.emmanuel@udsm.ac.tz",
    role: "Risk champion",
    department: "ICT Department",
    phone: "+255 123 456 789",
    employeeId: "EMP123456",
    joinedDate: "January 2023",
    avatarUrl: null,
    initials: "AE",
    reportsSubmitted: 24,
    activeRisks: 5,
  });

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
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