import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '@/services/api';

interface User {
  name: string;
  email: string;
  role: string;
  unit: string;
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
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    role: "",
    unit: "",
    phone: "",
    employeeId: "",
    joinedDate: "",
    avatarUrl: null,
    initials: "",
    reportsSubmitted: 0,
    activeRisks: 0,
  });

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      setUser({
        name: "",
        email: "",
        role: "",
        unit: "",
        phone: "",
        employeeId: "",
        joinedDate: "",
        avatarUrl: null,
        initials: "",
        reportsSubmitted: 0,
        activeRisks: 0,
  });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, refetchUser: fetchUser }}>
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