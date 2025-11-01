import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { Can } from '../components/Can';
import { ProtectedContent, ResourceGuard } from '../components/ProtectedContent';
import { Button } from '@/components/ui/button';

// Example 1: Basic Permission Check
export const Example1_BasicCheck = () => {
  const { can } = usePermissions();

  return (
    <div>
      {can('read', 'User') && (
        <div>You have permission to read user data</div>
      )}
    </div>
  );
};

// Example 2: Using Can Component
export const Example2_CanComponent = () => {
  return (
    <div>
      <Can I="read" a="User">
        <div>You can read user data</div>
      </Can>

      <Can 
        I="update" 
        a="User" 
        fallback={<div>You cannot edit users</div>}
      >
        <Button>Edit User</Button>
      </Can>
    </div>
  );
};

// Example 3: Protected Content with Multiple Checks
export const Example3_ProtectedContent = () => {
  return (
    <ProtectedContent
      checks={[
        { action: 'read', subject: 'User' },
        { action: 'update', subject: 'User' }
      ]}
      requireAll={true}
      fallback={<div>You need both read and update permissions</div>}
    >
      <div>User Editor</div>
    </ProtectedContent>
  );
};

// Example 4: Resource Guard
interface Post {
  id: string;
  title: string;
  authorId: string;
}

export const Example4_ResourceGuard = ({ post }: { post: Post }) => {
  return (
    <div>
      <h2>{post.title}</h2>
      
      <ResourceGuard
        resource={{ 
          subject: 'Post',
          conditions: { authorId: post.authorId }
        }}
        action="update"
        fallback={<div>You cannot edit this post</div>}
      >
        <Button>Edit Post</Button>
      </ResourceGuard>
    </div>
  );
};

// Example 5: Role-based Access
export const Example5_RoleBasedAccess = () => {
  const { can } = usePermissions();

  return (
    <div>
      {/* Admin-only section */}
      <Can I="manage" a="all">
        <div>
          <h2>Admin Panel</h2>
          <Button>Manage System</Button>
        </div>
      </Can>

      {/* Manager section */}
      {can('create', 'User') && (
        <div>
          <h2>User Management</h2>
          <Button>Create User</Button>
        </div>
      )}

      {/* Regular user section */}
      <ProtectedContent
        checks={[
          { action: 'read', subject: 'User' },
          { action: 'read', subject: 'Settings' }
        ]}
        requireAll={false}
      >
        <div>
          <h2>User Dashboard</h2>
          <Button>View Profile</Button>
        </div>
      </ProtectedContent>
    </div>
  );
};
