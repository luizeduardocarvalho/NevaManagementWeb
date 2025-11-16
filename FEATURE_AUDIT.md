# Lab Management Application - Feature Audit Report

**Audit Date:** 2025-11-13
**Current Stack:** Angular 18
**Total Features:** 22

---

## Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Complete | 8 | 36% |
| ⚠️ Partial | 4 | 18% |
| ❌ Missing | 10 | 46% |

---

## 1. SCHEDULE (Equipment Management)

### ✅ COMPLETE: Register Equipment
**Location:** `src/app/equipment/`
- Full CRUD for equipment (name, description, property number, location)
- Files: `add-equipment`, `edit-equipment`, `equipment-list`, `equipment-info`
- Service: `equipment.service.ts`

### ✅ COMPLETE: Show the Schedule
**Location:** `src/app/equipment/equipment-card/`
- Calendar view displays equipment usage by month/day
- Shows appointment times and descriptions
- Model: `CalendarDto` with nested structure
- Service: `equipment-usage.service.ts`

### ✅ COMPLETE: Schedule Times
**Location:** `src/app/equipment/use-equipment/`
- Dynamic form for scheduling (start/end dates + description)
- Usage history tracking
- Service methods: `UseEquipment`, `GetEquipmentUsageHistory`

### ❌ MISSING: Overlap Detection
**What's needed:**
- Validation before scheduling to prevent double-booking
- UI warning when attempting to book occupied time slots
- Server-side validation for concurrent bookings

---

## 2. INVENTORY (Product & Location Management)

### ✅ COMPLETE: Location CRUD (Create, Read, Update)
**Location:** `src/app/location/`
- Add, edit, and list locations
- Hierarchical structure (sublocations)
- Service: `location.service.ts`

### ⚠️ PARTIAL: Location DELETE
**What's missing:**
- No delete functionality in service or UI
- Need `DeleteLocation` endpoint and confirmation dialog

### ✅ COMPLETE: Expiration Tracking
**Location:** `src/app/product-list/product-info/`
- Products have `expirationDate` field
- UI shows if product is expired
- Displays expiration date in product info

### ⚠️ PARTIAL: Expiration Notifications
**What exists:**
- Can identify expired products in UI
**What's missing:**
- No proactive notification/alert system
- No configurable advance warning (e.g., "notify 30 days before")
- No email/push notifications
- No notification center integration

### ✅ COMPLETE: Quantity Management (Add/Use)
**Location:** `src/app/product-list/`
- Add quantity: `add-quantity.component.ts`
- Use product: `use-product.component.ts`
- Unit tracking
- Usage logging with timestamps

### ✅ COMPLETE: Low Stock Notifications
**Location:** `src/app/home/`
- Dashboard shows "Low in Stock" section
- API: `GetLowInStockProducts`
- Shows quantity + 3-month usage history
**What's missing:**
- No configurable threshold (percentage setting)
- Appears to be server-calculated, no client control

---

## 3. SAMPLES (Container/Organism System)

**Note:** App uses "Containers" and "Organisms" for sample management

### ❌ MISSING: Auto-create Replica per Sample
**What exists:**
- Manual container creation with optional `subContainerId`
**What's needed:**
- Automatic replica creation when sample is created
- Default 1 replica for simple samples
- Ability to specify replica count

### ❌ MISSING: Duplicate Replicas Feature
**What's needed:**
- Clone/duplicate button for containers
- Copy all properties to new replica
- Link to parent sample/matrix

### ⚠️ PARTIAL: Sample Location & Identification
**Location:** `src/app/container/`
**What exists:**
- Container name, description, creation date
- Link to organism and researcher
- Sub-container hierarchy
- `getChildrenContainers()` service method
**What's missing:**
- No physical storage location (fridge, shelf, rack position)
- Organism model has some fields: `collectionLocation`, `isolationDate`, `originPart`
- Missing: geographic coordinates, medium used for subculture

### ✅ COMPLETE: Subculture Reminders
**Location:** `src/app/container/next-transfers/`
- Containers have `transferDate` field
- "Next Transfers" view shows upcoming transfers ordered by date
- Dashboard displays next 2 transfers
- API: `GetContainersOrderedByTransferDate`
**What's missing:**
- No configurable reminder period ("X days before transfer")
- No actual notification/email sent

### ❌ MISSING: Sample Conditions as Tags
**What exists:**
- Organisms have type, description (plain text fields)
**What's needed:**
- Tag system for conditions (temperature, photoperiod, etc.)
- Tag CRUD operations
- Tag filtering/search
- Tag display in UI

### ⚠️ PARTIAL: Editable Data Display
**What exists:**
- Basic edit forms for organisms
- Dynamic form system
**What's missing:**
- No customizable column display
- No inline editing
- No user preference for which fields to show/hide

---

## 4. ROUTINES (Process Management)

### ❌ MISSING: Entire Routines Module
**No implementation found for:**
- Checklist for processes
- Register materials/steps/equipment
- Material inventory integration
- Auto inventory removal on completion
- Equipment availability checking

**What's needed:**
1. **Routine Definition**
   - Create/edit routines
   - Add steps (with order/sequence)
   - Attach required materials (with quantities)
   - Attach required equipment (with duration)

2. **Routine Execution**
   - Start routine instance
   - Checklist UI with step completion
   - Material availability check
   - Equipment availability check (today + next day)
   - Auto-deduct materials on finish

3. **Data Models**
   - Routine, RoutineStep, RoutineMaterial, RoutineEquipment
   - RoutineInstance, RoutineStepCompletion

---

## 5. NOTIFICATIONS

### ❌ MISSING: Notification Center
**What exists:**
- Toast notifications (`ngx-toastr`) for action feedback only
**What's needed:**
- Centralized notification inbox/center
- Persistent notifications (not just toasts)
- Notification history
- Mark as read/unread
- Notification types:
  - Expiring products
  - Low stock alerts
  - Upcoming transfers/subcultures
  - Equipment booking confirmations
  - Routine completions
- Push notifications (browser/email)

---

## 6. INVITATION

### ❌ MISSING: Email Invitation System
**What exists:**
- Researcher service (`researcher.service.ts`)
- `GetResearchers` endpoint
- Researchers assigned to containers
**What's needed:**
- Invite researcher form (email input)
- Email sending service
- Invitation tokens
- Registration flow for invited users
- Resend invitation functionality

---

## Additional Implemented Features (Not Requested)

1. **User History** (`user-history.component.ts`)
   - Tracks product usage by researcher over time

2. **Authentication System**
   - Login/logout
   - Auth guard for protected routes
   - JWT token management
   - Change password functionality

3. **Equipment Property Numbers**
   - Asset tracking field

4. **Product Formula Field**
   - Chemical formula tracking

5. **Usage Statistics**
   - 3-month usage tracking for products

---

## Critical Gaps Analysis

### Missing DELETE Operations
**Scope:** Entire application
- No delete for: Products, Equipment, Locations, Organisms, Containers
- Only have Create, Read, Update
- Need to implement soft delete or hard delete with confirmations

### No Real-time Features
- No WebSocket or server-sent events
- No live updates when data changes
- Notifications require manual refresh

### No Email Infrastructure
- No email service integration
- Can't send notifications, invitations, or alerts

### No Workflow Engine
- Can't define multi-step processes
- No state machine for routine execution
- No approval workflows

---

## Migration Priority Recommendations

### Phase A: Complete Existing Features (Before Migration)
**Estimated Time:** 5-8 hours

1. **Add Delete Operations** (2h)
   - Implement delete for all entities
   - Add confirmation dialogs
   - Handle cascade deletes

2. **Overlap Detection** (1h)
   - Equipment scheduling validation
   - UI warnings for conflicts

3. **Expiration Notifications Setup** (2h)
   - Configure notification thresholds
   - Create notification service
   - Add to notification center (if built)

4. **Duplicate Containers** (1h)
   - Clone/duplicate functionality
   - Copy properties to new replica

5. **Sample Tags System** (2h)
   - Tag CRUD
   - Tag assignment to organisms/containers
   - Tag filtering

### Phase B: New Features (During or After Migration)
**Estimated Time:** 15-25 hours

1. **Notification Center** (4-6h)
   - UI component
   - Backend notifications table
   - Real-time updates
   - Email integration

2. **Routines Module** (8-12h)
   - Routine definition CRUD
   - Execution workflow
   - Material/equipment checking
   - Inventory integration

3. **Invitation System** (3-5h)
   - Invitation API
   - Email templates
   - Registration flow
   - Token management

4. **Enhanced Sample Management** (3-5h)
   - Physical location tracking
   - Auto-replica creation
   - Customizable data display
   - Geographic coordinates

---

## React Migration Strategy Recommendation

### Option 1: Migrate Then Enhance (Recommended)
1. Migrate existing features to React (14-19h)
2. Complete Phase A fixes in React (5-8h)
3. Build Phase B new features in React (15-25h)
**Total: 34-52 hours**

**Pros:**
- Single codebase to maintain
- Modern stack for new features
- Better performance/DX for all work
- No duplicate effort

**Cons:**
- Longer before new features arrive
- All eggs in migration basket

### Option 2: Enhance Then Migrate
1. Complete Phase A in Angular (5-8h)
2. Build Phase B in Angular (15-25h)
3. Migrate everything to React (16-22h)
**Total: 36-55 hours**

**Pros:**
- Get features to users faster
- Less risk (stay in familiar territory)
- Can validate features before migration

**Cons:**
- Longer total time
- Maintaining Angular while building new features
- More tedious migration (more features to migrate)

### Option 3: Hybrid Approach
1. Migrate existing features to React (14-19h)
2. Complete Phase A in parallel teams:
   - Angular team fixes (3-5h)
   - React team builds foundation (3-5h)
3. Build Phase B in React only (15-25h)
**Total: Parallel work reduces calendar time**

**Pros:**
- Quick fixes for users
- New features in modern stack
- Parallel work possible

**Cons:**
- Requires maintaining both codebases temporarily
- Need coordination between teams
- More complex deployment

---

## Recommended Approach: **Option 1 (Migrate Then Enhance)**

**Rationale:**
1. Your Angular app is mostly CRUD - migration is straightforward
2. Building Routines module twice (Angular + React) wastes time
3. React ecosystem better for notifications (react-query, zustand)
4. Vite HMR makes feature development much faster
5. Single migration effort vs. continuous maintenance burden

**Timeline:**
- Week 1-2: React migration (existing features)
- Week 3: Phase A completions
- Week 4-5: Notification center + Routines module
- Week 6: Invitation system + polish

---

## Next Steps

1. **Decide migration strategy** (Option 1, 2, or 3)
2. **Prioritize missing features** (which are must-haves?)
3. **Update migration plan** with phased approach
4. **Create feature specs** for Routines module (most complex new feature)
5. **Design notification system** architecture (push vs. poll, email provider)
6. **Begin migration** or feature completion based on chosen strategy
