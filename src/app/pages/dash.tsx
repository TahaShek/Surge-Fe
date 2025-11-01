import React from 'react';
import { DevUserSwitcher } from '@/features/auth/components/DevUserSwitcher';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Card } from '@/components/ui/card';
import { usePermissions } from '@/features/authorization';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { can } = usePermissions();

  return (
    <div className="space-y-4 p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Info */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Current User</h2>
          <div className="space-y-2">
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
        </Card>

        {/* Permissions Info */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Your Permissions</h2>
          <div className="space-y-2">
            <p><strong>Can access Users:</strong> {can('access', 'User') ? '✅' : '❌'}</p>
            <p><strong>Can access Settings:</strong> {can('access', 'Settings') ? '✅' : '❌'}</p>
            <p><strong>Can access User Form:</strong> {can('access', 'UserForm') ? '✅' : '❌'}</p>
            <p><strong>Can access Permissions Demo:</strong> {can('access', 'PermissionsDemo') ? '✅' : '❌'}</p>
          </div>
        </Card>

        {/* User Switcher */}
        <DevUserSwitcher />
      </div>
    </div>
  );
}