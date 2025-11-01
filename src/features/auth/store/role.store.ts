// stores/role.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IRole {
  _id: string;
  name: string;
  description: string;
  permissions: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface RoleState {
  currentRole: string | null;
  availableRoles: IRole[];
  setCurrentRole: (role: string) => void;
  clearCurrentRole: () => void;
  initializeUserRoles: (roles: IRole[]) => void;
  getAvailableRoleNames: () => string[];
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      currentRole: null,
      availableRoles: [],
      
      setCurrentRole: (role: string) => {
        const { availableRoles } = get();
        const roleExists = availableRoles.some(r => r.name === role);
        if (roleExists) {
          set({ currentRole: role });
        }
      },
      
      clearCurrentRole: () => set({ currentRole: null, availableRoles: [] }),
      
      initializeUserRoles: (roles: IRole[]) => {
        if (roles && roles.length > 0) {
          const availableRoles = roles;
          const currentRole = get().currentRole || roles[0]?.name;
          
          set({ 
            availableRoles, 
            currentRole: currentRole && availableRoles.some(r => r.name === currentRole) 
              ? currentRole 
              : availableRoles[0]?.name || null 
          });
        }
      },
      
      getAvailableRoleNames: () => {
        const { availableRoles } = get();
        return availableRoles.map(role => role.name);
      }
    }),
    {
      name: 'role-storage',
    }
  )
);