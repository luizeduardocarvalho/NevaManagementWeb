# MVP Migration Plan - Lab Management System

> **Focus**: Equipment Scheduling, Product Management, Sample Tracking, Invitation System

---

## MVP Scope Definition

### ✅ In Scope (Must-Have for MVP)

#### 1. **Equipment Scheduling** (HIGH PRIORITY)
- Register equipment (name, description, property number, location)
- View equipment list
- Calendar view showing bookings by month/day
- Schedule equipment usage (start/end time, description)
- **NEW**: Overlap detection to prevent double-booking
- Usage history per equipment
- Edit/delete equipment
- Edit/delete bookings

#### 2. **Product Management** (HIGH PRIORITY)
- Product CRUD (name, description, formula, location, quantity, units)
- Expiration date tracking
- Add quantity to existing products
- Use/consume products (with usage logging)
- Low stock alerts on dashboard
- **NEW**: Delete products
- View product details and history

#### 3. **Sample Tracking** (HIGH PRIORITY)
- Container & Organism management
- Create samples (organisms) with identification:
  - Name, type, description
  - Collection date & location
  - Isolation date
  - Origin organism & origin part
  - **NEW**: Geographic coordinates
  - **NEW**: Medium used for subculture
- Create containers (physical samples/replicas)
  - Link to organism
  - Assign to researcher
  - Set transfer/subculture date
  - Track creation date
  - **NEW**: Physical storage location (fridge, shelf, rack)
- View next transfers dashboard
- Container hierarchy (sub-containers)
- **NEW**: Duplicate container/replica functionality
- Edit/delete organisms and containers

#### 4. **Invitation System** (MEDIUM PRIORITY)
- **NEW**: Invite researchers by email
- **NEW**: Email with registration link/token
- **NEW**: User registration flow for invited users
- View list of researchers
- Assign researchers to containers

### ✅ **5. Routines Module** (HIGH PRIORITY)
- **NEW**: Create routine templates
  - Define routine name and description
  - Add required materials (products from inventory)
  - Add required equipment (with estimated duration)
  - Define steps/checklist items (ordered sequence)
- **NEW**: Execute routines
  - Check material availability (quantity in stock)
  - Check equipment availability (today + next day)
  - Step-by-step checklist completion
  - Auto-deduct materials from inventory on completion
- View list of available routines
- Edit/delete routines
- Track routine execution history

### ⚠️ Deferred to Post-MVP

- Notification Center (persistent notifications)
- Sample conditions/tags system
- Expiration email notifications (tracking exists, just no emails)
- Configurable low stock thresholds
- Advanced filtering and search
- Customizable data display preferences
- User history tracking
- Analytics and reporting

### ❌ Out of Scope for MVP

- Routine/checklist workflows
- Material management
- Automated inventory deduction
- Tag-based sample categorization
- Role-based access control (RBAC)
- Audit logging
- Mobile app
- Barcode/QR code scanning
- Import/export functionality

---

## MVP Migration Timeline

### Total Estimated Time: **32-43 hours**

---

## Phase 1: React Setup & Core Infrastructure (3-4 hours)

### Step 1.1: Initialize React Project (45 min)
**Goal**: Set up Vite + React + TypeScript with all dependencies

```bash
# Create project
npm create vite@latest nevamanagement-mvp -- --template react-ts
cd nevamanagement-mvp

# Core dependencies
npm install react-router-dom @tanstack/react-query axios zustand

# UI dependencies
npm install bootstrap react-bootstrap
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/react-fontawesome
npm install react-hot-toast
npm install react-infinite-scroll-component

# Dev dependencies
npm install -D @types/node
```

**Deliverable**: ✅ Running dev server

---

### Step 1.2: Project Structure (30 min)

```
src/
├── components/
│   ├── auth/              # Login, registration
│   ├── equipment/         # Equipment scheduling
│   ├── product/           # Product management
│   ├── sample/            # Containers & organisms
│   │   ├── container/     # Container components
│   │   └── organism/      # Organism components
│   ├── researcher/        # Researcher & invitation
│   ├── shared/            # NavBar, Spinner, etc.
│   └── dashboard/         # Home dashboard
├── hooks/                 # Custom React hooks
├── services/              # API services
├── types/                 # TypeScript interfaces
├── store/                 # Zustand stores
├── config/                # Environment & constants
├── utils/                 # Utilities (toast, etc.)
└── router/                # Routing config
```

**Deliverable**: ✅ Organized folder structure

---

### Step 1.3: Routing & Auth (1 hour)

**Routes to implement:**
```typescript
/ → Home Dashboard (protected)
/login → Login
/register/:token → Registration (invited users)
/equipment → Equipment list (protected)
/equipment/:id → Equipment details + calendar (protected)
/equipment/add → Add equipment (protected)
/equipment/:id/edit → Edit equipment (protected)
/products → Product list (protected)
/products/:id → Product details (protected)
/products/add → Add product (protected)
/samples/organisms → Organism list (protected)
/samples/organisms/:id → Organism details (protected)
/samples/containers → Container list (protected)
/samples/containers/:id → Container details (protected)
/samples/next-transfers → Next transfers view (protected)
/researchers → Researcher list + invite (protected)
```

**Components to create:**
- `src/router/AppRouter.tsx` - Main router
- `src/router/ProtectedRoute.tsx` - Auth guard
- `src/components/auth/Login.tsx`
- `src/components/auth/Register.tsx` (new for invited users)

**Deliverable**: ✅ Routing + auth working

---

### Step 1.4: API Layer (1-1.5 hours)

**Create Axios instance** (`src/services/api.ts`):
- Base URL from env
- Request interceptor (add auth token)
- Response interceptor (error handling)

**Migrate services:**
1. `authService.ts` - login, register, getToken, getUser
2. `equipmentService.ts` - CRUD, calendar, schedule
3. `equipmentUsageService.ts` - usage history, calendar data
4. `productService.ts` - CRUD, add quantity, use product, low stock
5. `containerService.ts` - CRUD, next transfers, children
6. `organismService.ts` - CRUD
7. `researcherService.ts` - list, invite (new)
8. `locationService.ts` - list (for dropdowns)

**Deliverable**: ✅ All API services migrated

---

### Step 1.5: TypeScript Types (30 min)

**Create type files:**
- `src/types/auth.types.ts` - User, LoginDto, RegisterDto
- `src/types/equipment.types.ts` - Equipment, EquipmentUsage, Calendar
- `src/types/product.types.ts` - Product, ProductUsage
- `src/types/container.types.ts` - Container, ContainerDto
- `src/types/organism.types.ts` - Organism, OrganismDto
- `src/types/researcher.types.ts` - Researcher, InviteDto
- `src/types/location.types.ts` - Location
- `src/types/common.types.ts` - Shared types

**Deliverable**: ✅ All types defined

---

### Step 1.6: State Management (30 min)

**Create stores:**
1. `src/store/authStore.ts` - Auth state (user, token, login, logout)
2. `src/config/queryClient.ts` - React Query configuration

**Create utilities:**
1. `src/utils/toast.ts` - Toast notification helpers

**Deliverable**: ✅ State management ready

---

## Phase 2: Shared Components (1.5-2 hours)

### Priority shared components (migrate from Angular):

1. **NavBar** (30 min) - `src/components/shared/NavBar.tsx`
   - Logo/brand
   - Navigation links
   - User menu with logout
   - Responsive mobile menu

2. **Spinner** (15 min) - `src/components/shared/Spinner.tsx`
   - Loading indicator
   - Used throughout app

3. **BackArrow** (15 min) - `src/components/shared/BackArrow.tsx`
   - Navigation back button
   - Uses react-router navigate

4. **SmallCard** (15 min) - `src/components/shared/SmallCard.tsx`
   - Reusable card component
   - Used on dashboard

5. **DynamicForm** (30 min) - `src/components/shared/DynamicForm.tsx`
   - Dynamic form rendering
   - Used for equipment scheduling, product forms

**Deliverable**: ✅ 5 shared components ready

---

## Phase 3: Equipment Scheduling Module (3-4 hours)

### Step 3.1: Equipment List (45 min)

**Component**: `src/components/equipment/EquipmentList.tsx`

**Features:**
- Display equipment in grid/list
- Search/filter by name
- Link to equipment details
- Add equipment button
- Delete equipment (with confirmation)

**Custom hooks:**
- `useEquipment()` - Fetch equipment list with React Query

**Deliverable**: ✅ Equipment list working

---

### Step 3.2: Add/Edit Equipment (45 min)

**Components:**
- `src/components/equipment/AddEquipment.tsx`
- `src/components/equipment/EditEquipment.tsx`

**Form fields:**
- Name (required)
- Description
- Property number
- Location (dropdown)

**Custom hooks:**
- `useAddEquipment()` - Create mutation
- `useEditEquipment()` - Update mutation

**Deliverable**: ✅ Add/edit equipment working

---

### Step 3.3: Equipment Calendar View (1.5 hours)

**Component**: `src/components/equipment/EquipmentCalendar.tsx`

**Features:**
- Month/day view toggle
- Display bookings by date
- Color-coded appointments
- Click to view booking details
- **NEW**: Visual overlap warnings

**Data structure:**
```typescript
interface CalendarDto {
  month: MonthDto[]
}

interface MonthDto {
  month: number
  days: DayDto[]
}

interface DayDto {
  day: number
  appointments: AppointmentDto[]
}

interface AppointmentDto {
  startTime: string
  endTime: string
  description: string
  researcher: string
}
```

**Custom hooks:**
- `useEquipmentCalendar(equipmentId)` - Fetch calendar data

**Deliverable**: ✅ Calendar view working

---

### Step 3.4: Schedule Equipment (NEW: Overlap Detection) (1 hour)

**Component**: `src/components/equipment/ScheduleEquipment.tsx`

**Form fields:**
- Equipment (dropdown, or pre-selected)
- Start date/time
- End date/time
- Description
- Researcher (from auth)

**NEW: Overlap Detection Logic:**
```typescript
// Before submitting, check for conflicts
const checkOverlap = async (equipmentId, startTime, endTime) => {
  const calendar = await getEquipmentCalendar(equipmentId)
  const conflicts = findConflicts(calendar, startTime, endTime)

  if (conflicts.length > 0) {
    // Show warning modal
    return {
      hasConflict: true,
      conflicts: conflicts // List of overlapping bookings
    }
  }
  return { hasConflict: false }
}

// Client-side conflict detection
const findConflicts = (calendar, newStart, newEnd) => {
  const conflicts = []

  calendar.month.forEach(month => {
    month.days.forEach(day => {
      day.appointments.forEach(appt => {
        const apptStart = new Date(appt.startTime)
        const apptEnd = new Date(appt.endTime)
        const reqStart = new Date(newStart)
        const reqEnd = new Date(newEnd)

        // Check for overlap
        if (reqStart < apptEnd && reqEnd > apptStart) {
          conflicts.push({
            date: day.day,
            time: `${apptStart.toLocaleTimeString()} - ${apptEnd.toLocaleTimeString()}`,
            description: appt.description,
            researcher: appt.researcher
          })
        }
      })
    })
  })

  return conflicts
}
```

**UI Flow:**
1. Fill out booking form
2. Click "Schedule"
3. System checks for overlaps
4. If overlap exists:
   - Show modal with conflict details
   - "Override and book anyway" button
   - "Cancel" button
5. If no overlap or override clicked:
   - Submit booking
   - Show success toast
   - Redirect to calendar

**Custom hooks:**
- `useScheduleEquipment()` - Schedule mutation with overlap check

**Deliverable**: ✅ Scheduling with overlap detection

---

### Step 3.5: Usage History (30 min)

**Component**: `src/components/equipment/UsageHistory.tsx`

**Features:**
- List all past bookings for equipment
- Filter by date range
- Show researcher, dates, description

**Deliverable**: ✅ Usage history view

---

## Phase 4: Product Management Module (2-3 hours)

### Step 4.1: Product List (45 min)

**Component**: `src/components/product/ProductList.tsx`

**Features:**
- Display products with infinite scroll
- Show name, quantity, location, expiration
- Low stock indicator
- Search/filter
- Add product button
- Click to view details

**Custom hooks:**
- `useProducts()` - Fetch with pagination

**Deliverable**: ✅ Product list working

---

### Step 4.2: Add/Edit Product (45 min)

**Components:**
- `src/components/product/AddProduct.tsx`
- `src/components/product/EditProduct.tsx`

**Form fields:**
- Name (required)
- Description
- Formula
- Location (dropdown)
- Initial quantity
- Units
- Expiration date
- Minimum stock threshold (optional)

**Custom hooks:**
- `useAddProduct()`
- `useEditProduct()`
- `useDeleteProduct()` - NEW

**Deliverable**: ✅ Product CRUD complete

---

### Step 4.3: Product Details & Actions (1 hour)

**Component**: `src/components/product/ProductDetails.tsx`

**Display:**
- All product information
- Current quantity with units
- Expiration date (with expired indicator)
- Location
- Usage history (last 10 uses)

**Actions:**
- Add quantity button → Modal
- Use product button → Modal
- Edit product button
- Delete product button

**Deliverable**: ✅ Product details page

---

### Step 4.4: Add Quantity & Use Product Modals (30 min)

**Components:**
- `src/components/product/AddQuantityModal.tsx`
- `src/components/product/UseProductModal.tsx`

**Add Quantity form:**
- Quantity to add
- Notes (optional)

**Use Product form:**
- Quantity to use
- Purpose/notes
- Researcher (from auth)

**Custom hooks:**
- `useAddQuantity(productId)`
- `useUseProduct(productId)`

**Deliverable**: ✅ Quantity management working

---

## Phase 5: Sample Tracking Module (4-5 hours)

### Step 5.1: Organism Management (1.5 hours)

#### Organism List
**Component**: `src/components/sample/organism/OrganismList.tsx`

**Features:**
- List all organisms
- Search by name
- Filter by type
- Add organism button

#### Add/Edit Organism (Enhanced)
**Components:**
- `src/components/sample/organism/AddOrganism.tsx`
- `src/components/sample/organism/EditOrganism.tsx`

**Form fields:**
- Name (required)
- Type
- Description
- Collection date
- Collection location
- Isolation date
- Origin organism (dropdown, optional)
- Origin part
- **NEW**: Geographic coordinates (latitude, longitude)
- **NEW**: Medium used for subculture

**Example form:**
```typescript
interface OrganismFormData {
  name: string
  type: string
  description: string
  collectionDate: Date
  collectionLocation: string
  isolationDate: Date
  originOrganismId?: string
  originPart?: string
  latitude?: number  // NEW
  longitude?: number // NEW
  subcultureMedium?: string // NEW
}
```

**Custom hooks:**
- `useOrganisms()`
- `useAddOrganism()`
- `useEditOrganism()`
- `useDeleteOrganism()` - NEW

**Deliverable**: ✅ Enhanced organism management

---

### Step 5.2: Container Management (Enhanced) (2 hours)

#### Container List by Organism Flow
**Component**: `src/components/sample/container/ContainerFlow.tsx`

**Flow:**
1. Select organism from list
2. View all containers for that organism
3. Click container to see details + replicas

#### Container List
**Component**: `src/components/sample/container/ContainerList.tsx`

**Features:**
- View containers grouped by organism
- Show container name, creation date, transfer date
- Physical location indicator
- Researcher assignment

#### Add Container (Enhanced)
**Component**: `src/components/sample/container/AddContainer.tsx`

**Form fields:**
- Container name (required)
- Organism (dropdown, required)
- Researcher (dropdown, required)
- Description
- Creation date (auto-filled, editable)
- Transfer/subculture date (required)
- Sub-container of (dropdown, optional)
- **NEW**: Physical storage location
  - Building/room
  - Storage unit (fridge, freezer, incubator)
  - Shelf/rack
  - Position

**Example form:**
```typescript
interface ContainerFormData {
  name: string
  organismId: string
  researcherId: string
  description?: string
  creationDate: Date
  transferDate: Date
  subContainerId?: string
  physicalLocation?: {
    building?: string
    room?: string
    storageUnit: string  // e.g., "Fridge A"
    shelf?: string       // e.g., "Shelf 3"
    position?: string    // e.g., "A5"
  }
}
```

**Custom hooks:**
- `useAddContainer()`
- `useEditContainer()`
- `useDeleteContainer()` - NEW

**Deliverable**: ✅ Enhanced container creation

---

### Step 5.3: Duplicate Container (NEW) (30 min)

**Component**: `src/components/sample/container/DuplicateContainer.tsx` (modal)

**Flow:**
1. Click "Duplicate" button on container
2. Modal opens with pre-filled form
3. User can modify:
   - Container name (auto-append "- Copy" or increment)
   - Researcher
   - Transfer date
   - Physical location
4. Click "Create Duplicate"
5. New container created with all other fields copied

**Implementation:**
```typescript
const duplicateContainer = async (originalContainer: Container) => {
  const duplicate = {
    ...originalContainer,
    id: undefined, // New ID will be generated
    name: `${originalContainer.name} - Copy`,
    creationDate: new Date(),
    transferDate: calculateNextTransferDate(), // Helper function
  }

  await containerService.addContainer(duplicate)
}
```

**Custom hooks:**
- `useDuplicateContainer(containerId)`

**Deliverable**: ✅ Duplicate functionality

---

### Step 5.4: Next Transfers Dashboard (45 min)

**Component**: `src/components/sample/container/NextTransfers.tsx`

**Features:**
- List containers ordered by transfer date (ascending)
- Show container name, organism, researcher, transfer date
- Days until transfer indicator
- Quick actions: Mark as transferred, edit, view details
- Filter: Show only upcoming (not past due)

**Display format:**
```
Container A - Organism X - Dr. Smith - Transfer in 2 days
Container B - Organism Y - Dr. Jones - Transfer in 5 days
Container C - Organism Z - Dr. Smith - OVERDUE by 3 days (red highlight)
```

**Custom hooks:**
- `useNextTransfers()` - Fetch ordered containers

**Deliverable**: ✅ Next transfers view

---

## Phase 6: Invitation System (NEW) (2.5-3 hours)

### Step 6.1: Backend API Requirements

**New endpoints needed** (to be implemented on backend):

```typescript
// POST /api/researchers/invite
interface InviteResearcherDto {
  email: string
  name: string
  role?: string
}

// Response
interface InviteResponse {
  token: string
  expiresAt: Date
  emailSent: boolean
}

// GET /api/auth/validate-token/:token
interface ValidateTokenResponse {
  valid: boolean
  email: string
  name: string
  expiresAt: Date
}

// POST /api/auth/register
interface RegisterDto {
  token: string
  password: string
  confirmPassword: string
}
```

**Email template** (to be sent by backend):
```html
Subject: Invitation to Lab Management System

Hi {{name}},

You've been invited to join the Lab Management System.

Click here to create your account:
{{registrationUrl}}

This link will expire on {{expirationDate}}.

Best regards,
Lab Management Team
```

---

### Step 6.2: Researcher List & Invite UI (1 hour)

**Component**: `src/components/researcher/ResearcherList.tsx`

**Features:**
- List all researchers
- Show name, email, join date
- "Invite Researcher" button at top

**Invite Modal:**
**Component**: `src/components/researcher/InviteResearcherModal.tsx`

**Form:**
- Email (required, validated)
- Name (required)
- Role (optional)

**Flow:**
1. Click "Invite Researcher"
2. Modal opens with form
3. Enter email and name
4. Click "Send Invitation"
5. Backend:
   - Creates invitation token
   - Sends email
   - Returns success
6. Show success toast: "Invitation sent to {email}"
7. Close modal

**Custom hooks:**
- `useResearchers()`
- `useInviteResearcher()`

**Deliverable**: ✅ Invitation sending

---

### Step 6.3: Registration Page (1-1.5 hours)

**Component**: `src/components/auth/Register.tsx`

**Route**: `/register/:token`

**Flow:**
1. User clicks link in email
2. App loads registration page
3. Validate token:
   - If invalid/expired: Show error message
   - If valid: Show registration form

**Registration form:**
- Display invited email (read-only)
- Display name (pre-filled, editable)
- Password (required, strength indicator)
- Confirm password (required, must match)
- Terms acceptance checkbox
- "Create Account" button

**Validation:**
- Password minimum 8 characters
- Must include uppercase, lowercase, number
- Passwords must match

**On submit:**
1. Call `POST /api/auth/register` with token + password
2. Backend:
   - Validates token
   - Creates user account
   - Invalidates token
   - Auto-login (return JWT)
3. Frontend:
   - Store token
   - Redirect to home dashboard
   - Show welcome toast

**Custom hooks:**
- `useValidateToken(token)` - Check token validity
- `useRegister()` - Registration mutation

**Deliverable**: ✅ Registration flow complete

---

### Step 6.4: Invitation Management (30 min)

**Component**: `src/components/researcher/InvitationList.tsx` (optional, nice to have)

**Features:**
- View pending invitations
- Resend invitation email
- Cancel/revoke invitation

**This is optional for MVP** - can be added post-launch.

**Deliverable**: ⚠️ Optional for MVP

---

## Phase 7: Routines Module (NEW) (8-10 hours)

### Step 7.1: Data Models & Types (30 min)

**Create type files:**
`src/types/routine.types.ts`

```typescript
// Routine definition
interface Routine {
  id: string
  name: string
  description: string
  materials: RoutineMaterial[]
  equipment: RoutineEquipment[]
  steps: RoutineStep[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// Material required for routine
interface RoutineMaterial {
  id: string
  productId: string
  productName: string
  quantity: number
  unit: string
}

// Equipment required for routine
interface RoutineEquipment {
  id: string
  equipmentId: string
  equipmentName: string
  estimatedDuration: number // minutes
  required: boolean
}

// Step in routine checklist
interface RoutineStep {
  id: string
  order: number
  description: string
  notes?: string
}

// Routine execution instance
interface RoutineExecution {
  id: string
  routineId: string
  routineName: string
  executedBy: string
  startedAt: Date
  completedAt?: Date
  status: 'in_progress' | 'completed' | 'cancelled'
  stepCompletions: StepCompletion[]
  materialDeductions: MaterialDeduction[]
}

// Individual step completion
interface StepCompletion {
  stepId: string
  completed: boolean
  completedAt?: Date
  notes?: string
}

// Material deducted after completion
interface MaterialDeduction {
  productId: string
  quantityDeducted: number
}
```

**Deliverable**: ✅ Types defined

---

### Step 7.2: Routine Service (1 hour)

**Create service file:**
`src/services/routineService.ts`

```typescript
import api from './api'
import { Routine, RoutineExecution } from '@/types/routine.types'

export const routineService = {
  // Routine CRUD
  getRoutines: () =>
    api.get<Routine[]>('/routines'),

  getRoutineById: (id: string) =>
    api.get<Routine>(`/routines/${id}`),

  createRoutine: (routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Routine>('/routines', routine),

  updateRoutine: (id: string, routine: Partial<Routine>) =>
    api.put<Routine>(`/routines/${id}`, routine),

  deleteRoutine: (id: string) =>
    api.delete(`/routines/${id}`),

  // Execution
  checkAvailability: (routineId: string, date: Date) =>
    api.post<{
      materialsAvailable: boolean
      equipmentAvailable: boolean
      conflicts: any[]
    }>(`/routines/${routineId}/check-availability`, { date }),

  startExecution: (routineId: string) =>
    api.post<RoutineExecution>(`/routines/${routineId}/execute`),

  updateStepCompletion: (executionId: string, stepId: string, completed: boolean) =>
    api.patch(`/routine-executions/${executionId}/steps/${stepId}`, { completed }),

  completeExecution: (executionId: string) =>
    api.post(`/routine-executions/${executionId}/complete`),

  cancelExecution: (executionId: string) =>
    api.post(`/routine-executions/${executionId}/cancel`),

  // History
  getExecutionHistory: (routineId?: string) =>
    api.get<RoutineExecution[]>('/routine-executions', { params: { routineId } }),
}
```

**Deliverable**: ✅ Service ready

---

### Step 7.3: Routine List (1 hour)

**Component**: `src/components/routine/RoutineList.tsx`

**Features:**
- Display all routines in cards/list
- Show routine name, description, # of steps, # of materials
- Search/filter by name
- "Create Routine" button
- Click to view details
- Edit/delete actions

**Custom hooks:**
- `useRoutines()` - Fetch routines with React Query

**UI Layout:**
```
┌─────────────────────────────────────────┐
│ Routines                    [+ Create]  │
├─────────────────────────────────────────┤
│ [Search...]                             │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 70% Alcohol Preparation             │ │
│ │ 5 steps • 3 materials • 1 equipment │ │
│ │ [Execute] [Edit] [Delete]           │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Medium Sterilization                │ │
│ │ 8 steps • 2 materials • 2 equipment │ │
│ │ [Execute] [Edit] [Delete]           │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Deliverable**: ✅ Routine list

---

### Step 7.4: Create/Edit Routine (2.5-3 hours)

**Component**: `src/components/routine/RoutineForm.tsx`

**Form sections:**

#### 1. Basic Information
- Name (required)
- Description (textarea)

#### 2. Required Materials
- Add material button → Opens product selector modal
- Selected materials list:
  - Product name
  - Quantity input
  - Unit (from product)
  - Remove button
- Shows current stock for each material

#### 3. Required Equipment
- Add equipment button → Opens equipment selector modal
- Selected equipment list:
  - Equipment name
  - Estimated duration (minutes)
  - Required checkbox
  - Remove button

#### 4. Steps/Checklist
- Add step button
- Step list (drag to reorder):
  - Step number (auto)
  - Description (textarea)
  - Optional notes
  - Remove button
  - Drag handle for reordering

**Implementation example:**
```typescript
const RoutineForm = ({ routineId }: { routineId?: string }) => {
  const [formData, setFormData] = useState<Routine>({
    name: '',
    description: '',
    materials: [],
    equipment: [],
    steps: []
  })

  // Material management
  const addMaterial = (product: Product) => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, {
        id: generateId(),
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unit: product.unit
      }]
    }))
  }

  const removeMaterial = (id: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m.id !== id)
    }))
  }

  // Equipment management
  const addEquipment = (equip: Equipment) => {
    setFormData(prev => ({
      ...prev,
      equipment: [...prev.equipment, {
        id: generateId(),
        equipmentId: equip.id,
        equipmentName: equip.name,
        estimatedDuration: 60,
        required: true
      }]
    }))
  }

  // Step management
  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, {
        id: generateId(),
        order: prev.steps.length + 1,
        description: ''
      }]
    }))
  }

  const reorderSteps = (newOrder: RoutineStep[]) => {
    const reordered = newOrder.map((step, index) => ({
      ...step,
      order: index + 1
    }))
    setFormData(prev => ({ ...prev, steps: reordered }))
  }

  // ... form submission logic
}
```

**Custom hooks:**
- `useAddRoutine()`
- `useEditRoutine()`

**Deliverable**: ✅ Create/edit routine form

---

### Step 7.5: Routine Execution Flow (3-3.5 hours)

**Component**: `src/components/routine/ExecuteRoutine.tsx`

**Flow:**

#### Step 1: Pre-execution Checks
```typescript
const ExecuteRoutineStart = ({ routine }) => {
  const { data: availability } = useCheckAvailability(routine.id, new Date())

  return (
    <div>
      <h2>Execute: {routine.name}</h2>

      {/* Material availability */}
      <section>
        <h3>Required Materials</h3>
        {routine.materials.map(material => (
          <div key={material.id}>
            <span>{material.productName}</span>
            <span>Need: {material.quantity} {material.unit}</span>
            <span>In Stock: {material.currentStock} {material.unit}</span>
            {material.currentStock < material.quantity && (
              <Badge color="red">Insufficient Stock</Badge>
            )}
          </div>
        ))}
      </section>

      {/* Equipment availability */}
      <section>
        <h3>Required Equipment</h3>
        {routine.equipment.map(equip => (
          <div key={equip.id}>
            <span>{equip.equipmentName}</span>
            <span>Duration: {equip.estimatedDuration} min</span>
            {availability.equipmentConflicts[equip.id] && (
              <Badge color="orange">
                Conflict: {availability.equipmentConflicts[equip.id]}
              </Badge>
            )}
          </div>
        ))}
      </section>

      {/* Action buttons */}
      <div>
        {availability.materialsAvailable && availability.equipmentAvailable ? (
          <Button onClick={startExecution}>Start Routine</Button>
        ) : (
          <Button disabled>Cannot Start - Missing Resources</Button>
        )}
        <Button variant="secondary" onClick={goBack}>Cancel</Button>
      </div>
    </div>
  )
}
```

#### Step 2: Checklist Execution
```typescript
const ExecuteRoutineChecklist = ({ execution }) => {
  const [completions, setCompletions] = useState<Record<string, boolean>>({})
  const updateStep = useUpdateStepCompletion()

  const handleStepToggle = async (stepId: string, completed: boolean) => {
    setCompletions(prev => ({ ...prev, [stepId]: completed }))
    await updateStep.mutateAsync({
      executionId: execution.id,
      stepId,
      completed
    })
  }

  const allStepsComplete = execution.steps.every(
    step => completions[step.id]
  )

  return (
    <div>
      <h2>Executing: {execution.routineName}</h2>
      <p>Started: {formatDate(execution.startedAt)}</p>

      {/* Progress bar */}
      <ProgressBar
        value={Object.values(completions).filter(Boolean).length}
        max={execution.steps.length}
      />

      {/* Checklist */}
      <div>
        {execution.steps.map((step, index) => (
          <div key={step.id}>
            <Checkbox
              checked={completions[step.id] || false}
              onChange={(e) => handleStepToggle(step.id, e.target.checked)}
            />
            <span>Step {index + 1}</span>
            <span>{step.description}</span>
            {step.notes && <small>{step.notes}</small>}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div>
        <Button
          onClick={handleComplete}
          disabled={!allStepsComplete}
        >
          {allStepsComplete ? 'Finish & Deduct Materials' : 'Complete All Steps First'}
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel Routine
        </Button>
      </div>
    </div>
  )
}
```

#### Step 3: Completion & Material Deduction
```typescript
const handleComplete = async () => {
  // Show confirmation modal
  const confirmed = await showConfirmModal({
    title: 'Complete Routine?',
    message: `This will deduct materials from inventory:\n${
      execution.routine.materials.map(m =>
        `- ${m.quantity} ${m.unit} of ${m.productName}`
      ).join('\n')
    }`,
    confirmText: 'Complete & Deduct',
    cancelText: 'Cancel'
  })

  if (!confirmed) return

  try {
    // Complete execution (backend deducts inventory)
    await completeExecution(execution.id)

    toast.success('Routine completed! Materials deducted from inventory.')
    navigate('/routines')
  } catch (error) {
    toast.error('Failed to complete routine')
  }
}
```

**Custom hooks:**
- `useCheckAvailability(routineId, date)`
- `useStartExecution(routineId)`
- `useUpdateStepCompletion()`
- `useCompleteExecution(executionId)`
- `useCancelExecution(executionId)`

**Deliverable**: ✅ Full execution flow

---

### Step 7.6: Execution History (1 hour)

**Component**: `src/components/routine/ExecutionHistory.tsx`

**Features:**
- List all past executions
- Filter by routine (dropdown)
- Show execution date, duration, completed by
- Status badge (completed, cancelled)
- Click to view details

**Execution detail view:**
- Routine name
- Executed by
- Started/completed times
- Duration
- Steps completed (checklist with timestamps)
- Materials deducted

**Custom hooks:**
- `useExecutionHistory(routineId?)`

**Deliverable**: ✅ History view

---

## Phase 8: Dashboard & Home (1.5 hours)

### Step 8.1: Home Dashboard (1.5 hours)

**Component**: `src/components/dashboard/Home.tsx`

**Sections:**

1. **Next Transfers** (top section)
   - Show next 2 upcoming transfers
   - Link to "View All"

2. **Low Stock Products** (middle section)
   - Show products below threshold
   - Display current quantity and 3-month usage
   - Link to product details

3. **Quick Actions** (cards)
   - Schedule Equipment → Link
   - Add Product → Link
   - Create Sample → Link
   - View Calendar → Link

4. **Recent Activity** (optional for MVP)
   - Last 5 equipment bookings
   - Last 5 product uses
   - Last 5 containers created

**Custom hooks:**
- `useNextTransfers({ limit: 2 })`
- `useLowStockProducts()`
- `useRecentActivity()` (optional)

**Deliverable**: ✅ Dashboard complete

---

## Phase 9: Testing & Polish (2-3 hours)

### Step 9.1: Manual Testing Checklist (1.5 hours)

**Authentication:**
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout
- [ ] Protected routes redirect to login
- [ ] Token refresh/expiry handling

**Equipment:**
- [ ] Add new equipment
- [ ] Edit equipment
- [ ] Delete equipment (with confirmation)
- [ ] View equipment calendar
- [ ] Schedule equipment
- [ ] Overlap detection works (try booking same time twice)
- [ ] View usage history

**Products:**
- [ ] Add new product
- [ ] Edit product
- [ ] Delete product
- [ ] Add quantity
- [ ] Use product
- [ ] View product details
- [ ] Low stock appears on dashboard
- [ ] Expiration date validation

**Samples:**
- [ ] Add organism with new fields (coordinates, medium)
- [ ] Edit organism
- [ ] Delete organism
- [ ] Add container with physical location
- [ ] Edit container
- [ ] Delete container
- [ ] Duplicate container
- [ ] Next transfers shows correct data
- [ ] Container hierarchy works

**Invitations:**
- [ ] Send invitation email
- [ ] Email received (check spam)
- [ ] Click registration link
- [ ] Invalid token shows error
- [ ] Valid token shows registration form
- [ ] Create account
- [ ] Auto-login after registration
- [ ] New user can access system

**Routines:**
- [ ] Create new routine with materials, equipment, steps
- [ ] Edit routine
- [ ] Delete routine
- [ ] View routine list
- [ ] Execute routine - check material availability
- [ ] Execute routine - check equipment availability
- [ ] Cannot start if missing resources
- [ ] Complete checklist steps
- [ ] Finish routine and deduct materials
- [ ] View execution history
- [ ] Cancel in-progress execution

**Dashboard:**
- [ ] Next transfers displayed
- [ ] Low stock products shown
- [ ] Quick action links work

---

### Step 9.2: Bug Fixes (1 hour)

- Fix any issues found during testing
- Handle edge cases
- Improve error messages
- Fix styling issues

---

### Step 9.3: UI/UX Polish (30 min)

- Ensure consistent styling
- Add loading states
- Improve form validation messages
- Add empty states (no data views)
- Mobile responsiveness check

**Deliverable**: ✅ Polished MVP

---

## Phase 10: Deployment (1 hour)

### Step 10.1: Build Configuration (30 min)

**Update `package.json`:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

**Environment variables:**
- Create `.env.production`
- Set `VITE_API_BASE_URL`

**Test production build:**
```bash
npm run build
npm run preview
```

**Deliverable**: ✅ Production build working

---

### Step 10.2: Server Configuration (30 min)

**Update `server.js`** (Express server):
```javascript
const express = require('express');
const path = require('path');

const app = express();

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Test deployment:**
```bash
npm run build
npm start
```

**Deliverable**: ✅ Deployment ready

---

## MVP Summary

### ✅ What You'll Have After Migration

**Core Features:**
1. ✅ Equipment scheduling with overlap detection
2. ✅ Full product management (CRUD + quantity + expiration)
3. ✅ Enhanced sample tracking (organisms + containers)
4. ✅ Routines module (define, execute, track)
5. ✅ Invitation system with email registration
6. ✅ Dashboard with key insights
7. ✅ Authentication & protected routes

**Enhancements from Angular:**
1. ✅ Delete operations (equipment, products, organisms, containers)
2. ✅ Overlap detection for equipment bookings
3. ✅ Duplicate container functionality
4. ✅ Geographic coordinates for organisms
5. ✅ Subculture medium tracking
6. ✅ Physical storage location for containers
7. ✅ Invitation & registration system

**Tech Stack:**
- React 18 + TypeScript
- Vite (fast builds, HMR)
- React Router (routing)
- React Query (data fetching)
- Zustand (state management)
- Axios (HTTP client)
- React Bootstrap (UI)
- React Hot Toast (notifications)

---

## Timeline Breakdown

| Phase | Duration | Description |
|-------|----------|-------------|
| **Phase 1** | 3-4h | React setup & infrastructure |
| **Phase 2** | 1.5-2h | Shared components |
| **Phase 3** | 3-4h | Equipment scheduling + overlap detection |
| **Phase 4** | 2-3h | Product management |
| **Phase 5** | 4-5h | Sample tracking (enhanced) |
| **Phase 6** | 2.5-3h | Invitation system (NEW) |
| **Phase 7** | 8-10h | Routines module (NEW) |
| **Phase 8** | 1.5h | Dashboard |
| **Phase 9** | 2-3h | Testing & polish |
| **Phase 10** | 1h | Deployment |
| **TOTAL** | **32-43 hours** | Complete MVP |

---

## Post-MVP Roadmap (Deferred Features)

### Phase 11: Notification Center (4-6 hours)
- Persistent notification inbox
- Mark as read/unread
- Notification types: expiring products, upcoming transfers, low stock
- Email notifications

### Phase 12: Advanced Sample Management (3-5 hours)
- Tag-based categorization
- Advanced filtering
- Customizable data display
- Bulk operations

### Phase 13: Analytics & Reporting (4-6 hours)
- Equipment utilization reports
- Product consumption trends
- Sample tracking analytics
- Export to CSV/PDF

---

## Backend Requirements (for MVP)

**New API endpoints needed:**

1. **DELETE operations:**
   - `DELETE /api/equipment/:id`
   - `DELETE /api/products/:id`
   - `DELETE /api/organisms/:id`
   - `DELETE /api/containers/:id`

2. **Invitation system:**
   - `POST /api/researchers/invite` - Send invitation
   - `GET /api/auth/validate-token/:token` - Validate registration token
   - `POST /api/auth/register` - Create user from invitation

3. **Enhanced fields (update DTOs):**
   - Organism: Add `latitude`, `longitude`, `subcultureMedium`
   - Container: Add `physicalLocation` object

4. **Routine system:**
   - `POST /api/routines` - Create routine
   - `PUT /api/routines/:id` - Update routine
   - `DELETE /api/routines/:id` - Delete routine
   - `GET /api/routines` - List routines
   - `GET /api/routines/:id` - Get routine details
   - `POST /api/routines/:id/check-availability` - Check material/equipment availability
   - `POST /api/routines/:id/execute` - Start routine execution
   - `PATCH /api/routine-executions/:id/steps/:stepId` - Update step completion
   - `POST /api/routine-executions/:id/complete` - Complete execution & deduct inventory
   - `POST /api/routine-executions/:id/cancel` - Cancel execution
   - `GET /api/routine-executions` - Get execution history

5. **Overlap checking (optional backend validation):**
   - `POST /api/equipment/:id/check-availability` - Server-side conflict detection

6. **Email service:**
   - Configure SMTP (SendGrid, AWS SES, etc.)
   - Email templates for invitations

---

## Risk Assessment & Mitigation

### Risk 1: Email Delivery
**Risk**: Invitation emails may go to spam
**Mitigation**:
- Use reputable email service (SendGrid)
- Configure SPF/DKIM records
- Test with multiple email providers
- Provide "resend invitation" functionality

### Risk 2: Overlap Detection Performance
**Risk**: Large calendars may slow down overlap checking
**Mitigation**:
- Implement server-side validation
- Cache calendar data with React Query
- Only check relevant date range (not entire history)

### Risk 3: Physical Location Complexity
**Risk**: Free-form text for locations may cause inconsistency
**Mitigation**:
- Use dropdowns for common fields (building, storage unit)
- Allow custom input only for position
- Add location templates for future

### Risk 4: Duplicate Container Edge Cases
**Risk**: Duplicating containers with sub-containers may cause issues
**Mitigation**:
- Only duplicate single container (not hierarchy)
- Add warning if container has sub-containers
- Optionally: Allow "deep copy" vs "shallow copy"

---

## Success Metrics for MVP

**Launch Criteria:**
- [ ] All equipment, product, sample CRUD operations working
- [ ] Overlap detection prevents double-bookings
- [ ] Invitation emails sent successfully
- [ ] Users can register from invitation
- [ ] Dashboard displays accurate data
- [ ] No critical bugs
- [ ] Mobile responsive
- [ ] Production build deployed

**User Acceptance:**
- [ ] Researchers can schedule equipment without conflicts
- [ ] Lab managers can track inventory effectively
- [ ] Sample transfers are visible and trackable
- [ ] New users can be invited and onboarded
- [ ] System is intuitive and easy to use

---

## Next Steps

1. **Review & Approve** this MVP plan
2. **Backend API**: Ensure new endpoints are ready
   - DELETE operations
   - Invitation system
   - Enhanced organism/container fields
3. **Begin Phase 1**: React project setup
4. **Parallel work**: Frontend migration + backend API development
5. **Weekly demos**: Show progress to stakeholders
6. **Beta testing**: Internal testing before public launch

---

## Questions to Answer Before Starting

1. **Email Service**: Which email provider should we use? (SendGrid, AWS SES, SMTP)
2. **Backend Timeline**: When will new API endpoints be ready?
3. **Domain Model Changes**: OK to add new fields to organisms/containers?
4. **User Roles**: For MVP, all users have same permissions?
5. **Data Migration**: Need to migrate existing Angular data?
6. **Staging Environment**: Do we have a staging server for testing?

---

**Ready to start? Let me know and we can begin Phase 1! 🚀**
