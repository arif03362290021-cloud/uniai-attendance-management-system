import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (email: string, role: UserRole) => Promise<User>;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('uniai_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USERS[4]; // Default to student Ayesha Ahmed
      }
    }
    return INITIAL_USERS[4]; // Default to student
  });

  const [role, setRole] = useState<UserRole>(() => user?.role || 'student');

  useEffect(() => {
    if (user) {
      localStorage.setItem('uniai_user', JSON.stringify(user));
      setRole(user.role);
    } else {
      localStorage.removeItem('uniai_user');
    }
  }, [user]);

  const login = async (email: string, selectedRole: UserRole): Promise<User> => {
    // Find matching user or generate placeholder
    const found = INITIAL_USERS.find(u => u.role === selectedRole) || INITIAL_USERS[0];
    const loggedUser: User = {
      ...found,
      email: email || found.email,
      role: selectedRole
    };
    setUser(loggedUser);
    setRole(selectedRole);
    return loggedUser;
  };

  const switchRole = (newRole: UserRole) => {
    const matchedUser = INITIAL_USERS.find(u => u.role === newRole) || {
      id: `u-${newRole}`,
      email: `${newRole}@university.edu`,
      firstName: newRole.replace('_', ' ').toUpperCase(),
      lastName: 'User',
      role: newRole,
      isVerified: true
    };
    setUser(matchedUser);
    setRole(newRole);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login, switchRole, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
