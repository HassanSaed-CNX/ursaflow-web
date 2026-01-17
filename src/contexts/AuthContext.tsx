import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, mockUsers, defaultUser } from '@/mocks/users';
import { Role, getRoleConfig, hasPermission, Action, RoleConfig } from '@/configs/roleConfig';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  roleConfig: RoleConfig | null;
  setRole: (role: Role) => void;
  can: (action: Action) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultUser);
  const [isLoading, setIsLoading] = useState(false);

  const roleConfig = user ? getRoleConfig(user.role) : null;

  const setRole = useCallback((role: Role) => {
    setIsLoading(true);
    // Simulate async role switch
    setTimeout(() => {
      setUser(mockUsers[role]);
      setIsLoading(false);
    }, 150);
  }, []);

  const can = useCallback((action: Action): boolean => {
    if (!user) return false;
    return hasPermission(user.role, action);
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, roleConfig, setRole, can, logout }}>
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
