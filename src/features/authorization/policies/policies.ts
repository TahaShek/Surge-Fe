/**
 * Policy Definitions
 * Pre-defined ABAC policies for common scenarios
 */

import type { IPolicyRule } from '../types';
import {
  Action,
  ResourceType,
  PolicyEffect,
  Department,
  SensitivityLevel,
} from '../types';
import { UserRole } from '@/features/auth/types';

/**
 * Admin Policies
 * Admins have full access to everything
 */
export const adminPolicies: IPolicyRule[] = [
  {
    id: 'admin-full-access',
    name: 'Admin Full Access',
    description: 'Admins can perform any action on any resource',
    effect: PolicyEffect.ALLOW,
    actions: Object.values(Action),
    resourceTypes: Object.values(ResourceType),
    conditions: [
      {
        field: 'subject.role',
        operator: 'equals',
        value: UserRole.ADMIN,
      },
    ],
    priority: 100,
  },
];

/**
 * User Self-Management Policies
 * Users can manage their own data
 */
export const userSelfManagementPolicies: IPolicyRule[] = [
  {
    id: 'user-read-own-profile',
    name: 'User Can Read Own Profile',
    description: 'Users can view their own profile',
    effect: PolicyEffect.ALLOW,
    actions: [Action.READ],
    resourceTypes: [ResourceType.USER],
    conditions: [
      {
        field: 'subject.userId',
        operator: 'equals',
        value: '$resource.id', // Special syntax for dynamic comparison
      },
    ],
    priority: 80,
  },
  {
    id: 'user-update-own-profile',
    name: 'User Can Update Own Profile',
    description: 'Users can update their own profile',
    effect: PolicyEffect.ALLOW,
    actions: [Action.UPDATE],
    resourceTypes: [ResourceType.USER],
    conditions: [
      {
        field: 'subject.userId',
        operator: 'equals',
        value: '$resource.id',
      },
    ],
    priority: 80,
  },
];

/**
 * Department-Based Policies
 * Access based on department membership
 */
export const departmentPolicies: IPolicyRule[] = [
  {
    id: 'hr-view-employees',
    name: 'HR Can View Employee Records',
    description: 'HR department can view all employee records',
    effect: PolicyEffect.ALLOW,
    actions: [Action.READ],
    resourceTypes: [ResourceType.EMPLOYEE],
    conditions: [
      {
        field: 'subject.department',
        operator: 'equals',
        value: Department.HR,
      },
    ],
    priority: 70,
  },
  {
    id: 'finance-manage-reports',
    name: 'Finance Can Manage Financial Reports',
    description: 'Finance department can create, read, update financial reports',
    effect: PolicyEffect.ALLOW,
    actions: [Action.CREATE, Action.READ, Action.UPDATE],
    resourceTypes: [ResourceType.REPORT],
    conditions: [
      {
        field: 'subject.department',
        operator: 'equals',
        value: Department.FINANCE,
      },
      {
        field: 'resource.department',
        operator: 'equals',
        value: Department.FINANCE,
      },
    ],
    priority: 70,
  },
  {
    id: 'same-department-access',
    name: 'Same Department Document Access',
    description: 'Users can read documents from their own department',
    effect: PolicyEffect.ALLOW,
    actions: [Action.READ],
    resourceTypes: [ResourceType.DOCUMENT],
    conditions: [
      {
        field: 'subject.department',
        operator: 'equals',
        value: '$resource.department',
      },
    ],
    priority: 60,
  },
];

/**
 * Business Hours Policies
 * Time-based access control
 */
export const businessHoursPolicies: IPolicyRule[] = [
  {
    id: 'confidential-business-hours-only',
    name: 'Confidential Access During Business Hours',
    description: 'Confidential documents can only be accessed during business hours',
    effect: PolicyEffect.DENY,
    actions: [Action.READ, Action.UPDATE],
    resourceTypes: [ResourceType.DOCUMENT],
    conditions: [
      {
        field: 'resource.sensitivity',
        operator: 'in',
        value: [SensitivityLevel.CONFIDENTIAL, SensitivityLevel.RESTRICTED],
      },
      {
        field: 'environment.isBusinessHours',
        operator: 'equals',
        value: false,
      },
    ],
    priority: 90, // High priority to enforce time restrictions
  },
];

/**
 * Clearance Level Policies
 * Security clearance-based access
 */
export const clearancePolicies: IPolicyRule[] = [
  {
    id: 'clearance-level-access',
    name: 'Clearance Level Based Access',
    description: 'Users can access resources matching their clearance level',
    effect: PolicyEffect.ALLOW,
    actions: [Action.READ],
    resourceTypes: [ResourceType.DOCUMENT, ResourceType.REPORT],
    conditions: [
      {
        field: 'subject.clearanceLevel',
        operator: 'greaterThan',
        value: '$resource.requiredClearance',
      },
    ],
    priority: 85,
  },
];

/**
 * Owner-Based Policies
 * Resource ownership permissions
 */
export const ownershipPolicies: IPolicyRule[] = [
  {
    id: 'owner-full-access',
    name: 'Owner Full Access',
    description: 'Resource owners have full access to their resources',
    effect: PolicyEffect.ALLOW,
    actions: [Action.READ, Action.UPDATE, Action.DELETE, Action.SHARE],
    resourceTypes: [ResourceType.POST, ResourceType.DOCUMENT, ResourceType.PROJECT],
    conditions: [
      {
        field: 'subject.userId',
        operator: 'equals',
        value: '$resource.owner',
      },
    ],
    priority: 75,
  },
  {
    id: 'creator-access',
    name: 'Creator Access',
    description: 'Resource creators can manage their creations',
    effect: PolicyEffect.ALLOW,
    actions: [Action.READ, Action.UPDATE, Action.DELETE],
    resourceTypes: Object.values(ResourceType),
    conditions: [
      {
        field: 'subject.userId',
        operator: 'equals',
        value: '$resource.createdBy',
      },
    ],
    priority: 75,
  },
];

/**
 * Public Resource Policies
 * Public resources are accessible to all
 */
export const publicResourcePolicies: IPolicyRule[] = [
  {
    id: 'public-read-access',
    name: 'Public Read Access',
    description: 'Anyone can read public resources',
    effect: PolicyEffect.ALLOW,
    actions: [Action.READ],
    resourceTypes: Object.values(ResourceType),
    conditions: [
      {
        field: 'resource.sensitivity',
        operator: 'equals',
        value: SensitivityLevel.PUBLIC,
      },
    ],
    priority: 50,
  },
];

/**
 * Moderator Policies
 * Moderators have elevated permissions
 */
export const moderatorPolicies: IPolicyRule[] = [
  {
    id: 'moderator-content-management',
    name: 'Moderator Content Management',
    description: 'Moderators can approve, reject, and delete posts',
    effect: PolicyEffect.ALLOW,
    actions: [Action.READ, Action.UPDATE, Action.DELETE, Action.APPROVE, Action.REJECT],
    resourceTypes: [ResourceType.POST],
    conditions: [
      {
        field: 'subject.role',
        operator: 'equals',
        value: UserRole.MODERATOR,
      },
    ],
    priority: 85,
  },
];

/**
 * All Policies Combined
 */
export const defaultPolicies: IPolicyRule[] = [
  ...adminPolicies,
  ...moderatorPolicies,
  ...businessHoursPolicies,
  ...clearancePolicies,
  ...ownershipPolicies,
  ...userSelfManagementPolicies,
  ...departmentPolicies,
  ...publicResourcePolicies,
];

