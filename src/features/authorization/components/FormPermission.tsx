import React from 'react';
import type { Subjects } from '../types/ability.types';
import { usePermissions } from '../hooks/usePermissions';

interface FormPermissionProps {
  subject: Subjects;
  isUpdate?: boolean;
  children: React.ReactNode | ((permissions: { canCreate: boolean; canUpdate: boolean }) => React.ReactNode);
  fallback?: React.ReactNode;
}

export const FormPermission: React.FC<FormPermissionProps> = ({
  subject,
  isUpdate = false,
  children,
  fallback = null
}) => {
  const { canCreate, canUpdate } = usePermissions();

  const hasPermission = isUpdate ? canUpdate(subject) : canCreate(subject);
  const permissions = { canCreate: canCreate(subject), canUpdate: canUpdate(subject) };

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{typeof children === 'function' ? children(permissions) : children}</>;
};

// Usage example:
// <FormPermission subject="User" isUpdate={!!userId}>
//   {({ canCreate, canUpdate }) => (
//     <div>
//       <h1>{canUpdate ? 'Update' : 'Create'} User</h1>
//       <Button type="submit">{canUpdate ? 'Update' : 'Create'}</Button>
//     </div>
//   )}
// </FormPermission>

