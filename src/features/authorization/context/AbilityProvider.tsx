import React, { createContext, useContext, useEffect, useState } from 'react';
import { createMongoAbility } from '@casl/ability';
import type { AppAbility, Permission } from '../types/ability.types';
import { defineAbilityFor } from '../types/ability.types';
import { useAuthStore } from '@/features/auth/store/auth.store';

// Create context with a default ability
const defaultAbility = createMongoAbility([]);
export const AbilityContext = createContext<AppAbility>(defaultAbility);

export const useAbility = () => {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error('useAbility must be used within an AbilityProvider');
  }
  return context;
};

export const AbilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const [ability, setAbility] = useState<AppAbility>(defaultAbility);

  useEffect(() => {
    if (user?.permissions) {
      const newAbility = defineAbilityFor(user.permissions);
      setAbility(newAbility);
    } else {
      setAbility(defaultAbility);
    }
  }, [user]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};