import { PureAbility, defineAbility } from '@casl/ability';

// Basic CRUD actions + manage
export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';

// All possible subjects (make sure they match your routes exactly)
export type Subjects = 
  | 'Dashboard'
  | 'Chat'
  | 'Notifications'
  | 'Maps'
  | 'Hello'      // For users list/management
  | 'UserForm'   // For user form
  | 'Settings'
  | 'all';

export type AppAbility = PureAbility<[Actions, Subjects]>;

export interface Permission {
  action: Actions;
  subject: Subjects;
}

export function defineAbilityFor(permissions: Permission[]) {
  return defineAbility((can) => {
    permissions.forEach(({ action, subject }) => {
      can(action, subject);
    });
  });
}