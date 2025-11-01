import { useState } from 'react';
import { TabsContainer, type TabItem } from '@/components/ui/tabs/TabsContainer';
import { Select } from '@/components/form/Select';
import { UserForm } from './UserForm';
import { User, Users, Settings, History } from 'lucide-react';
import { LoadingSkeleton } from '@/components/ui/loading/LoadingSkeleton';
import { useToast } from '@/components/ui/toast/useToast';
import { ConfirmDialog } from '@/components/ui/dialog/ConfirmDialog';

interface UserFormTabsProps {
  userId?: string;
}

export function UserFormTabs({ userId }: UserFormTabsProps) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const toast = useToast();

  const handleSave = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success({
        title: 'Success',
        description: 'User information saved successfully!'
      });
    } catch (error) {
      toast.error({
        title: 'Error',
        description: 'Failed to save user information.'
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs: TabItem[] = [
    {
      key: 'details',
      label: 'User Details',
      icon: <User className="h-4 w-4" />,
      content: loading ? (
        <LoadingSkeleton variant="form" />
      ) : (
        <UserForm userId={userId} />
      )
    },
    {
      key: 'roles',
      label: 'Roles & Permissions',
      icon: <Settings className="h-4 w-4" />,
      content: loading ? (
        <LoadingSkeleton variant="form" />
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">User Roles</h2>
          
          <Select
            name="role"
            label="Primary Role"
            description="The main role determines base permissions"
            options={[
              { value: 'admin', label: 'Administrator' },
              { value: 'manager', label: 'Manager' },
              { value: 'user', label: 'Regular User' },
            ]}
            size="lg"
          />

          <Select
            name="department"
            label="Department"
            description="User's department for organizational structure"
            options={[
              { value: 'engineering', label: 'Engineering' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'sales', label: 'Sales' },
              { value: 'hr', label: 'Human Resources' },
            ]}
          />
        </div>
      )
    },
    {
      key: 'teams',
      label: 'Teams',
      icon: <Users className="h-4 w-4" />,
      content: loading ? (
        <LoadingSkeleton variant="list" />
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Team Memberships</h2>
          
          <Select
            name="teams"
            label="Assigned Teams"
            description="Teams this user belongs to"
            options={[
              { value: 'frontend', label: 'Frontend Team' },
              { value: 'backend', label: 'Backend Team' },
              { value: 'design', label: 'Design Team' },
              { value: 'devops', label: 'DevOps Team' },
            ]}
          />
        </div>
      )
    },
    {
      key: 'history',
      label: 'History',
      icon: <History className="h-4 w-4" />,
      disabled: !userId,
      content: loading ? (
        <LoadingSkeleton variant="table" />
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">User History</h2>
          <p className="text-muted-foreground">
            Activity history will be shown here...
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {userId ? 'Edit User' : 'Create User'}
        </h1>
      </div>

      <TabsContainer 
        tabs={tabs} 
        variant="modern"
        defaultTab="details"
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Save Changes"
        description="Are you sure you want to save these changes?"
        onConfirm={handleSave}
        loading={loading}
      >
        <p>This will update the user's information across the system.</p>
      </ConfirmDialog>
    </div>
  );
}