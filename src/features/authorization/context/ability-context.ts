import { createContext } from 'react';
import type { AppAbility } from '../types/ability.types';

export const AbilityContext = createContext<AppAbility | undefined>(undefined);
