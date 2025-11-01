import React from 'react';
import { useAuthStore } from '../store/auth.store';
import { mockUsers } from '../mocks/mock-users';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { IUser } from '../types/auth.types';

export const DevUserSwitcher: React.FC = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const currentUser = useAuthStore((state) => state.user);

  const handleUserSwitch = (userId: string) => {
    const mockUser = mockUsers[userId];
    if (mockUser) {
      const user: IUser = {
        _id: mockUser.id,
        id: mockUser.id,
        email: mockUser.email,
        name: `${mockUser.firstName || ''} ${mockUser.lastName || ''}`.trim(),
        firstName: mockUser.firstName || '',
        lastName: mockUser.lastName || '',
        role: [{ name: mockUser.role.toUpperCase() }],
        isVerified: true,
        avatar: mockUser.avatar,
        permissions: mockUser.permissions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(user);
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Switch User Role (Dev Only)</h2>
      <div className="flex flex-col gap-2">
        {Object.entries(mockUsers).map(([key, user]) => (
          <Button
            key={key}
            variant={
              currentUser?.role && 
              Array.isArray(currentUser.role) && 
              currentUser.role[0]?.name.toLowerCase() === user.role 
                ? "default" 
                : "outline"
            }
            onClick={() => handleUserSwitch(key)}
            className="justify-start"
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Button>
        ))}
      </div>
    </Card>
  );
};