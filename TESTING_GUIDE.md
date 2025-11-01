# Testing Guide

Complete guide to test the Authentication & Authorization system with mock users.

## 🎯 Mock Users Available

### 1. **Admin User** (Full Access)
- **Email**: ``
- **Password**: `Admin@123`
- **Role**: Admin
- **Department**: IT
- **Clearance**: Level 5
- **Permissions**: Full access to everything

### 2. **HR Manager** (HR Department)
- **Email**: `hr@example.com`
- **Password**: `Hr@123456`
- **Role**: User
- **Department**: HR
- **Clearance**: Level 4
- **Permissions**: 
  - View all employee records
  - Manage HR documents
  - Access HR reports

### 3. **Finance User** (Finance Department)
- **Email**: `finance@example.com`
- **Password**: `Finance@123`
- **Role**: User
- **Department**: Finance
- **Clearance**: Level 3
- **Permissions**:
  - Create, read, update finance reports
  - Access finance department resources
  - View finance documents

### 4. **Marketing User** (Marketing Department)
- **Email**: `marketing@example.com`
- **Password**: `Marketing@123`
- **Role**: User
- **Department**: Marketing
- **Clearance**: Level 2
- **Permissions**:
  - Access marketing resources
  - Create marketing content
  - Limited access to other departments

### 5. **Engineer** (Engineering Department)
- **Email**: `engineer@example.com`
- **Password**: `Engineer@123`
- **Role**: User
- **Department**: Engineering
- **Clearance**: Level 3
- **Permissions**:
  - Access engineering resources
  - Manage projects
  - View technical documents

### 6. **Moderator** (Content Moderation)
- **Email**: `moderator@example.com`
- **Password**: `Moderator@123`
- **Role**: Moderator
- **Department**: Operations
- **Clearance**: Level 3
- **Permissions**:
  - Approve/reject posts
  - Delete content
  - Moderate user submissions

### 7. **Sales User** (Sales Department)
- **Email**: `sales@example.com`
- **Password**: `Sales@123`
- **Role**: User
- **Department**: Sales
- **Clearance**: Level 2
- **Permissions**:
  - Access sales resources
  - View customer data
  - Create sales reports

### 8. **IT Support** (IT Department)
- **Email**: `it@example.com`
- **Password**: `It@123456`
- **Role**: User
- **Department**: IT
- **Clearance**: Level 2
- **Permissions**:
  - Basic IT access
  - Support tickets
  - System status

### 9. **Basic User** (No Department)
- **Email**: `user@example.com`
- **Password**: `User@123456`
- **Role**: User
- **Department**: None
- **Clearance**: Level 1
- **Permissions**:
  - View own profile
  - Update own data
  - Public resource access

### 10. **Guest User** (Limited Access)
- **Email**: `guest@example.com`
- **Password**: `Guest@123`
- **Role**: Guest
- **Clearance**: Level 1
- **Permissions**:
  - Read-only access
  - Public resources only

---

## 🚀 Quick Start Testing

### Method 1: Login Page
1. Navigate to `/auth/login`
2. Use any of the credentials above
3. Explore the app with different permission levels

### Method 2: Dev User Switcher (Recommended)
1. Look for the **purple circle button** in the bottom-right corner
2. Click it to open the user switcher
3. Click any user to instantly switch
4. No need to log out and log back in!

---

## 🧪 Test Scenarios

### Scenario 1: Admin Access
```bash
Login: admin@example.com / Admin@123
```
**Expected Results:**
- ✅ Can access all pages
- ✅ Can create, read, update, delete all resources
- ✅ Can see all departments
- ✅ Full permission to everything

**Test:**
- Navigate to different pages
- Try editing/deleting resources
- Check if admin badge appears

---

### Scenario 2: Department-Based Access
```bash
Login: hr@example.com / Hr@123456
```
**Expected Results:**
- ✅ Can view employee records
- ✅ Can access HR department resources
- ❌ Cannot access Finance reports
- ❌ Cannot access Engineering projects

**Test:**
```tsx
// In your component
<Can action={Action.READ} resource={{ type: ResourceType.EMPLOYEE }}>
  <EmployeeList /> {/* Should show for HR */}
</Can>

<Can action={Action.READ} resource={{ 
  type: ResourceType.REPORT, 
  department: Department.FINANCE 
}}>
  <FinanceReports /> {/* Should NOT show for HR */}
</Can>
```

---

### Scenario 3: Ownership Permissions
```bash
Login: user@example.com / User@123456
```
**Expected Results:**
- ✅ Can edit own profile
- ✅ Can delete own posts
- ❌ Cannot edit other users' profiles
- ❌ Cannot delete others' posts

**Test:**
```tsx
// User can edit their own post
<OwnerOnly resource={{ type: ResourceType.POST, owner: currentUser.id }}>
  <EditButton /> {/* Shows for owned posts */}
</OwnerOnly>

// User cannot edit others' posts
<OwnerOnly resource={{ type: ResourceType.POST, owner: 'other-user-id' }}>
  <EditButton /> {/* Does NOT show */}
</OwnerOnly>
```

---

### Scenario 4: Moderator Permissions
```bash
Login: moderator@example.com / Moderator@123
```
**Expected Results:**
- ✅ Can approve posts
- ✅ Can reject posts
- ✅ Can delete any post
- ❌ Cannot access admin settings

**Test:**
```tsx
<Can action={Action.APPROVE} resource={{ type: ResourceType.POST }}>
  <ApproveButton /> {/* Shows for moderators */}
</Can>

<Can action={Action.REJECT} resource={{ type: ResourceType.POST }}>
  <RejectButton /> {/* Shows for moderators */}
</Can>
```

---

### Scenario 5: Business Hours Restriction
```bash
Login: Any user
Resource: Confidential document
```
**Expected Results:**
- ✅ Can access during business hours (9am-5pm Mon-Fri)
- ❌ Cannot access outside business hours

**Test:**
```tsx
// This will be automatically enforced by policies
<Can 
  action={Action.READ} 
  resource={{ 
    type: ResourceType.DOCUMENT, 
    sensitivity: SensitivityLevel.CONFIDENTIAL 
  }}
>
  <ConfidentialDoc /> {/* Only shows during business hours */}
</Can>
```

---

### Scenario 6: Multiple Permission Check
```bash
Login: engineer@example.com / Engineer@123
```
**Expected Results:**
- ✅ Has READ permission for documents
- ✅ Has UPDATE permission for own documents
- ❌ Does NOT have DELETE permission (admin only)

**Test:**
```tsx
const { checkAll, checkAny } = useAbac();

// Requires ALL permissions (READ + UPDATE + DELETE)
const canFullyManage = checkAll([
  { action: Action.READ, resourceType: ResourceType.DOCUMENT },
  { action: Action.UPDATE, resourceType: ResourceType.DOCUMENT },
  { action: Action.DELETE, resourceType: ResourceType.DOCUMENT },
]);
// Result: false (missing DELETE)

// Requires ANY permission (READ OR UPDATE)
const canView = checkAny([
  { action: Action.READ, resourceType: ResourceType.DOCUMENT },
  { action: Action.UPDATE, resourceType: ResourceType.DOCUMENT },
]);
// Result: true (has READ)
```

---

### Scenario 7: Guest User Limitations
```bash
Login: guest@example.com / Guest@123
```
**Expected Results:**
- ✅ Can view public resources
- ❌ Cannot create anything
- ❌ Cannot update anything
- ❌ Cannot delete anything
- ❌ Cannot access any department resources

---

## 📋 Testing Checklist

### Authentication Tests
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Signup new user
- [ ] Signup with existing email (should fail)
- [ ] Logout functionality
- [ ] Remember me checkbox
- [ ] Password visibility toggle
- [ ] Form validation errors
- [ ] Protected routes redirect to login

### Authorization Tests
- [ ] Admin can access everything
- [ ] Users can only access their department resources
- [ ] Users can edit own profile
- [ ] Users cannot edit others' profiles
- [ ] Moderators can approve/reject posts
- [ ] Ownership checks work correctly
- [ ] Business hours restrictions apply
- [ ] Clearance level enforcement
- [ ] Public resources accessible to all
- [ ] Protected content shows fallback

### UI/UX Tests
- [ ] Login form is responsive
- [ ] Signup form is responsive
- [ ] Error messages display correctly
- [ ] Loading states work
- [ ] DevUserSwitcher appears in dev
- [ ] User avatar displays
- [ ] Navbar shows correct user info
- [ ] Logout updates UI immediately

---

## 🔧 Configuration

### Enable/Disable Mock API

Create or update `.env`:
```bash
# Use mock authentication (default: true in dev)
VITE_USE_MOCK_AUTH=true

# API base URL (not used when mock is enabled)
VITE_API_BASE_URL=http://localhost:3000/api
```

### Disable Mock API
```bash
VITE_USE_MOCK_AUTH=false
```

---

## 🎨 DevUserSwitcher Features

The DevUserSwitcher (purple button bottom-right) provides:
- ✅ Quick user switching without logout
- ✅ Visual user list with avatars
- ✅ Shows role and department badges
- ✅ Displays clearance level
- ✅ Quick credential reference
- ✅ Highlights current user
- ✅ Only visible in development

---

## 🐛 Troubleshooting

### Users not loading?
Check console for errors. Make sure you're in development mode.

### DevUserSwitcher not showing?
It only shows in development (`import.meta.env.DEV === true`)

### Permissions not working?
1. Check if policies are loaded (check console)
2. Verify user has correct role/department
3. Check policy priority (DENY overrides ALLOW)

### Login fails with mock users?
Ensure you're using exact credentials from the list above.

---

## 📚 API Simulation

The mock API simulates:
- ✅ Network delays (800ms for login, 1s for signup)
- ✅ Token generation
- ✅ User validation
- ✅ Error responses
- ✅ Token refresh
- ✅ Current user fetching

---

## 🎯 Next Steps

1. **Test all scenarios** above
2. **Create test-specific components** to verify permissions
3. **Add custom policies** for your use case
4. **Replace mock API** with real backend when ready
5. **Add unit tests** for policy engine
6. **Add E2E tests** for auth flows

---

## 💡 Tips

- Use DevUserSwitcher for quick testing
- Check browser console for permission logs
- Test with different devices/screen sizes
- Try edge cases (no department, guest user, etc.)
- Verify business hours logic
- Test protected routes
- Check ownership scenarios

---

## 📞 Need Help?

If you encounter issues:
1. Check the README.md files in `/features/auth` and `/features/authorization`
2. Review USAGE_EXAMPLES.tsx for code samples
3. Check browser console for detailed error messages
4. Verify environment variables are set correctly

Happy Testing! 🚀

