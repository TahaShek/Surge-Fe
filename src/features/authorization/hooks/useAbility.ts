import { useContext } from 'react';
import { AbilityContext } from '../context/ability-context';

export const useAbility = () => {
  const ability = useContext(AbilityContext);
  
  if (!ability) {
    throw new Error('useAbility must be used within an AbilityProvider');
  }
  
  return ability;
};