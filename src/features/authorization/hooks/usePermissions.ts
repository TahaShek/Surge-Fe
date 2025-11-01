import { useAbility } from '../context/AbilityProvider';
import type { Actions, Subjects } from '../types/ability.types';

export function usePermissions() {
  const ability = useAbility();

  return {
    can: (action: Actions, subject: Subjects) => ability.can(action, subject),
    cannot: (action: Actions, subject: Subjects) => ability.cannot(action, subject),
    ability
  };
}