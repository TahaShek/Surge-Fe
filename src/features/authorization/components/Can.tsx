import React from 'react';
import { useAbility } from '../context/AbilityProvider';
import type { Actions, Subjects } from '../types/ability.types';

interface CanProps {
  action: Actions;
  subject: Subjects;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ action, subject, children, fallback = null }) => {
  const ability = useAbility();
  return ability.can(action, subject) ? <>{children}</> : <>{fallback}</>;
};