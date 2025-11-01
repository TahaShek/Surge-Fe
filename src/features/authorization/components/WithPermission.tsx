import React from 'react';
import type { Actions, Subjects } from '../types/ability.types';
import { usePermissions, type PermissionCheck } from '../hooks/usePermissions';

interface WithPermissionProps {
  permissions: PermissionCheck | PermissionCheck[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const WithPermission: React.FC<WithPermissionProps> = ({
  permissions,
  fallback = null,
  children,
}) => {
  const { check } = usePermissions();
  return check(permissions) ? <>{children}</> : <>{fallback}</>;
};

// Convenience components for common actions
interface ActionPermissionProps {
  subject: Subjects;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const CanCreate: React.FC<ActionPermissionProps> = ({ subject, ...props }) => (
  <WithPermission permissions={{ action: 'create', subject }} {...props} />
);

export const CanRead: React.FC<ActionPermissionProps> = ({ subject, ...props }) => (
  <WithPermission permissions={{ action: 'read', subject }} {...props} />
);

export const CanUpdate: React.FC<ActionPermissionProps> = ({ subject, ...props }) => (
  <WithPermission permissions={{ action: 'update', subject }} {...props} />
);

export const CanDelete: React.FC<ActionPermissionProps> = ({ subject, ...props }) => (
  <WithPermission permissions={{ action: 'delete', subject }} {...props} />
);
