## ABAC (Attribute-Based Access Control) System

A comprehensive, production-ready ABAC system for fine-grained access control.

## 📁 Structure

```
authorization/
├── types/              # TypeScript types, interfaces, enums
│   └── abac.types.ts   # ABAC type definitions
├── services/           # Business logic
│   ├── policy-engine.ts       # Policy evaluation engine
│   └── permission-evaluator.ts # Permission checking service
├── context/            # React context
│   └── AbacContext.tsx # ABAC provider and context
├── hooks/              # Custom hooks
│   ├── usePermission.ts # Permission checking hooks
│   └── useAbac.ts      # Main ABAC hook
├── components/         # Permission components
│   ├── Can.tsx         # Conditional rendering
│   └── ProtectedContent.tsx # Protected content wrapper
├── policies/           # Policy definitions
│   └── policies.ts     # Pre-defined policies
└── index.ts            # Barrel export
```

## 🎯 Core Concepts

### **1. Subject (User)**
Attributes of the user requesting access:
- `userId`: Unique identifier
- `role`: User role (Admin, User, Moderator)
- `department`: Department affiliation
- `clearanceLevel`: Security clearance (1-5)
- `location`: Physical location
- `email`: Email address

### **2. Resource (Object)**
Attributes of the resource being accessed:
- `type`: Resource type (Document, Post, Project, etc.)
- `id`: Resource identifier
- `owner`: Owner user ID
- `department`: Associated department
- `sensitivity`: Sensitivity level (Public, Internal, Confidential, etc.)
- `createdBy`: Creator user ID

### **3. Environment (Context)**
Contextual attributes:
- `time`: Current timestamp
- `isBusinessHours`: Business hours flag
- `location`: Access location
- `device`: Device type
- `ipAddress`: IP address
- `isTrustedNetwork`: Network trust status

### **4. Action**
Operations that can be performed:
- `CREATE`, `READ`, `UPDATE`, `DELETE`
- `EXECUTE`, `APPROVE`, `REJECT`
- `SHARE`, `EXPORT`, `IMPORT`

## 🚀 Usage

### **Setup**

The ABAC system is automatically initialized in `main.tsx`:

```tsx
import { AbacProvider, policyEngine, defaultPolicies } from '@/features/authorization';

// Initialize policies
policyEngine.addPolicies(defaultPolicies);

// Wrap app with provider
<AbacProvider>
  <App />
</AbacProvider>
```

### **Using the useAbac Hook**

```tsx
import { useAbac } from '@/features/authorization';
import { Action, ResourceType } from '@/features/authorization/types';

function DocumentView({ document }) {
  const { can, isOwner } = useAbac();

  const canEdit = can(Action.UPDATE, {
    type: ResourceType.DOCUMENT,
    id: document.id,
    owner: document.ownerId,
  });

  const canDelete = can(Action.DELETE, {
    type: ResourceType.DOCUMENT,
    id: document.id,
    owner: document.ownerId,
  });

  const isDocumentOwner = isOwner({
    type: ResourceType.DOCUMENT,
    owner: document.ownerId,
  });

  return (
    <div>
      <h1>{document.title}</h1>
      {canEdit && <button>Edit</button>}
      {canDelete && <button>Delete</button>}
      {isDocumentOwner && <badge>Owner</badge>}
    </div>
  );
}
```

### **Using the Can Component**

```tsx
import { Can } from '@/features/authorization';
import { Action, ResourceType } from '@/features/authorization/types';

function PostActions({ post }) {
  return (
    <div>
      <Can
        action={Action.UPDATE}
        resource={{ type: ResourceType.POST, id: post.id, owner: post.userId }}
      >
        <button>Edit Post</button>
      </Can>

      <Can
        action={Action.DELETE}
        resource={{ type: ResourceType.POST, id: post.id, owner: post.userId }}
        fallback={<p>You cannot delete this post</p>}
      >
        <button>Delete Post</button>
      </Can>
    </div>
  );
}
```

### **Using ProtectedContent**

```tsx
import { ProtectedContent } from '@/features/authorization';
import { Action, ResourceType } from '@/features/authorization/types';

function DocumentEditor() {
  return (
    <ProtectedContent
      checks={[
        { action: Action.READ, resourceType: ResourceType.DOCUMENT },
        { action: Action.UPDATE, resourceType: ResourceType.DOCUMENT },
      ]}
      requireAll={true}
      fallback={<p>You don't have permission to edit documents</p>}
    >
      <RichTextEditor />
    </ProtectedContent>
  );
}
```

### **Owner-Based Protection**

```tsx
import { OwnerOnly } from '@/features/authorization';
import { ResourceType } from '@/features/authorization/types';

function ProjectSettings({ project }) {
  return (
    <OwnerOnly
      resource={{ type: ResourceType.PROJECT, owner: project.ownerId }}
      fallback={<p>Only the project owner can access settings</p>}
    >
      <ProjectSettingsForm />
    </OwnerOnly>
  );
}
```

### **Department-Based Protection**

```tsx
import { SameDepartmentOnly } from '@/features/authorization';
import { ResourceType, Department } from '@/features/authorization/types';

function EmployeeRecord({ employee }) {
  return (
    <SameDepartmentOnly
      resource={{
        type: ResourceType.EMPLOYEE,
        department: Department.HR,
      }}
      fallback={<p>Access restricted to HR department</p>}
    >
      <EmployeeDetails employee={employee} />
    </SameDepartmentOnly>
  );
}
```

## 📝 Creating Custom Policies

```tsx
import { policyEngine } from '@/features/authorization';
import { PolicyEffect, Action, ResourceType } from '@/features/authorization/types';

// Custom policy: Managers can approve reports in their department
const managerApprovalPolicy = {
  id: 'manager-approve-reports',
  name: 'Manager Can Approve Department Reports',
  effect: PolicyEffect.ALLOW,
  actions: [Action.APPROVE],
  resourceTypes: [ResourceType.REPORT],
  conditions: [
    {
      field: 'subject.role',
      operator: 'equals' as const,
      value: 'MANAGER',
    },
    {
      field: 'subject.department',
      operator: 'equals' as const,
      value: '$resource.department',
    },
  ],
  priority: 80,
};

// Register the policy
policyEngine.addPolicy(managerApprovalPolicy);
```

## 🔐 Pre-defined Policies

### **Admin Policies**
- Admins have full access to all resources

### **User Self-Management**
- Users can read/update their own profile

### **Department Policies**
- HR can view employee records
- Finance can manage financial reports
- Users can access same-department documents

### **Business Hours Policies**
- Confidential documents only accessible during business hours

### **Ownership Policies**
- Resource owners have full access
- Creators can manage their creations

### **Public Resources**
- Anyone can read public resources

### **Moderator Policies**
- Moderators can approve/reject/delete posts

## 🎓 Advanced Usage

### **Check Multiple Permissions**

```tsx
const { checkAll, checkAny } = useAbac();

// Check if user has ALL permissions
const hasAllPermissions = checkAll([
  { action: Action.READ, resourceType: ResourceType.DOCUMENT },
  { action: Action.UPDATE, resourceType: ResourceType.DOCUMENT },
  { action: Action.DELETE, resourceType: ResourceType.DOCUMENT },
]);

// Check if user has ANY permission
const hasAnyPermission = checkAny([
  { action: Action.READ, resourceType: ResourceType.DOCUMENT },
  { action: Action.UPDATE, resourceType: ResourceType.DOCUMENT },
]);
```

### **Get Permission with Reason**

```tsx
const { canWithReason } = useAbac();

const decision = canWithReason(Action.DELETE, {
  type: ResourceType.POST,
  id: '123',
});

console.log(decision.allowed); // true/false
console.log(decision.reason); // "Access allowed by policy: owner-full-access"
console.log(decision.matchedPolicies); // ['owner-full-access']
```

### **Dynamic Policy Management**

```tsx
import { policyEngine } from '@/features/authorization';

// Add a policy
policyEngine.addPolicy(myPolicy);

// Remove a policy
policyEngine.removePolicy('policy-id');

// Clear all policies
policyEngine.clearPolicies();

// Get all policies
const policies = policyEngine.getPolicies();
```

## 🧪 Examples

### **Example 1: Document Management**

```tsx
function DocumentCard({ document }) {
  const { can, isOwner } = useAbac();

  const resource = {
    type: ResourceType.DOCUMENT,
    id: document.id,
    owner: document.owner,
    sensitivity: document.sensitivity,
    department: document.department,
  };

  return (
    <div className="document-card">
      <h3>{document.title}</h3>
      
      {/* Anyone with READ permission can view */}
      <Can action={Action.READ} resource={resource}>
        <button>View</button>
      </Can>

      {/* Only editors can update */}
      <Can action={Action.UPDATE} resource={resource}>
        <button>Edit</button>
      </Can>

      {/* Only owner or admin can delete */}
      <Can action={Action.DELETE} resource={resource}>
        <button>Delete</button>
      </Can>

      {/* Only owner can share */}
      <Can action={Action.SHARE} resource={resource}>
        <button>Share</button>
      </Can>

      {isOwner(resource) && <span className="badge">Owner</span>}
    </div>
  );
}
```

### **Example 2: Employee Portal**

```tsx
function EmployeePortal() {
  const { can, subject } = useAbac();

  return (
    <div>
      {/* HR department features */}
      <Can
        action={Action.READ}
        resource={{ type: ResourceType.EMPLOYEE, department: Department.HR }}
      >
        <HRDashboard />
      </Can>

      {/* Finance department features */}
      <Can
        action={Action.READ}
        resource={{ type: ResourceType.REPORT, department: Department.FINANCE }}
      >
        <FinanceDashboard />
      </Can>

      {/* User's own profile */}
      <Can
        action={Action.UPDATE}
        resource={{ type: ResourceType.USER, id: subject?.userId }}
      >
        <ProfileEditor />
      </Can>
    </div>
  );
}
```

### **Example 3: Multi-Level Approval**

```tsx
function ReportApproval({ report }) {
  const { can } = useAbac();

  const canApprove = can(Action.APPROVE, {
    type: ResourceType.REPORT,
    id: report.id,
    department: report.department,
  });

  const canReject = can(Action.REJECT, {
    type: ResourceType.REPORT,
    id: report.id,
  });

  return (
    <div>
      <h2>{report.title}</h2>
      <ReportViewer report={report} />
      
      <div className="actions">
        {canApprove && (
          <button className="approve">Approve Report</button>
        )}
        {canReject && (
          <button className="reject">Reject Report</button>
        )}
      </div>
    </div>
  );
}
```

## 🔧 Policy Operators

- `equals`: Exact match
- `notEquals`: Not equal
- `in`: Value in array
- `notIn`: Value not in array
- `greaterThan`: Numeric comparison
- `lessThan`: Numeric comparison
- `contains`: String contains
- `matches`: Regex match

## 📊 Policy Priority

Higher priority policies are evaluated first. DENY always takes precedence over ALLOW.

- 100: Admin policies
- 90: Security/time restrictions
- 85: Moderator & clearance policies
- 80: Self-management policies
- 75: Ownership policies
- 70: Department policies
- 60: Team/group policies
- 50: Public access

## 🎯 Best Practices

1. **Always define policies explicitly** - Default is DENY
2. **Use high priority for DENY policies** - Security first
3. **Combine conditions with AND logic** - All conditions must pass
4. **Test policies thoroughly** - Verify expected behavior
5. **Keep policies simple** - Split complex rules
6. **Document custom policies** - Explain intent
7. **Use type-safe values** - Leverage TypeScript enums

## 🚨 Security Considerations

- Policies are evaluated on the frontend - **Always validate on backend**
- DENY policies override ALLOW policies
- No policies = Access denied by default
- Business hours checked client-side - Verify server-side
- Clear sensitive data from context when not needed

## 🔗 Integration with Backend

Your backend should implement the same ABAC logic:

```typescript
// Backend policy evaluation
POST /api/authorize
{
  "subject": { "userId": "123", "role": "USER" },
  "resource": { "type": "DOCUMENT", "id": "456" },
  "action": "DELETE"
}

Response: { "allowed": false, "reason": "..." }
```

## 📚 Additional Resources

- [NIST ABAC Guide](https://csrc.nist.gov/projects/attribute-based-access-control)
- [XACML Standard](http://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html)
- [AWS IAM Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)

