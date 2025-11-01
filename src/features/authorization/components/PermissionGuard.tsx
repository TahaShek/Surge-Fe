import React from 'react';
import { Navigate } from 'react-router';
import { useAbility } from '../context/AbilityProvider';
import type { Actions, Subjects } from '../types/ability.types';

interface PermissionGuardProps {
  action?: Actions;
  subject: Subjects;
  children: React.ReactNode;
  fallbackPath?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  action = 'read', // Changed default from 'access' to 'read'
  subject,
  children,
  fallbackPath = '/dashboard'
}) => {
  const ability = useAbility();

  console.log('ability', ability);
  if (!ability.can(action, subject)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};