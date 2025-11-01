import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import type { Actions, Subjects } from '../types/ability.types';

interface PermissionCheck {
  action: Actions;
  subject: Subjects;
  conditions?: Record<string, unknown>;
}

interface ProtectedContentProps {
  checks: PermissionCheck[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onUnauthorized?: (failedChecks: string[]) => void;
}

/**
 * ProtectedContent Component
 * Renders content based on multiple permission checks
 * 
 * @example
 * <ProtectedContent
 *   checks={[
 *     { action: 'read', subject: 'User' },
 *     { action: 'update', subject: 'User' },
 *   ]}
 *   requireAll={true}
 * >
 *   <UserEditor />
 * </ProtectedContent>
 */
export const ProtectedContent: React.FC<ProtectedContentProps> = ({
  checks,
  requireAll = false,
  children,
  fallback = null,
  onUnauthorized,
}) => {
  const { can } = usePermissions();

  // Check all permissions
  const results = checks.map(check => ({
    check,
    allowed: can(check.action, check.subject, check.conditions)
  }));

  // Determine if access is allowed based on requireAll flag
  const isAllowed = requireAll
    ? results.every(r => r.allowed)
    : results.some(r => r.allowed);

  if (!isAllowed) {
    // Get failed check keys
    const failedChecks = results
      .filter(r => !r.allowed)
      .map(r => `${r.check.action}:${r.check.subject}`);

    onUnauthorized?.(failedChecks);
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface ResourceProps {
  subject: Subjects;
  id?: string;
  conditions?: Record<string, unknown>;
}

interface ResourceGuardProps {
  resource: ResourceProps;
  action: Actions;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ResourceGuard Component
 * Protects content based on resource permissions
 * 
 * @example
 * <ResourceGuard
 *   resource={{ subject: 'Post', id: '123' }}
 *   action="update"
 * >
 *   <EditButton />
 * </ResourceGuard>
 */
export const ResourceGuard: React.FC<ResourceGuardProps> = ({
  resource,
  action,
  children,
  fallback = null,
}) => {
  const { can } = usePermissions();

  if (!can(action, resource.subject, resource.conditions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};