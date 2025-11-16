# Angular to React Migration Plan

> **📋 See [FEATURE_AUDIT.md](./FEATURE_AUDIT.md) for detailed current state analysis**

## Project Overview
- **Current Stack**: Angular 18, Bootstrap 5, ng-bootstrap, RxJS, ngx-toastr
- **Components**: 42 components
- **Services**: 14 services
- **Code Size**: ~6,000 lines
- **Feature Status**: 8 complete, 4 partial, 10 missing (see audit)

## Current Feature Implementation Summary

### ✅ Fully Implemented (Migrate as-is)
1. Equipment registration & management
2. Equipment scheduling with calendar view
3. Location CRUD (Create/Read/Update)
4. Product expiration tracking
5. Product quantity management (add/use)
6. Low stock dashboard alerts
7. Container subculture reminders (transfer dates)
8. Next transfers view

### ⚠️ Partially Implemented (Complete during migration)
1. Location DELETE operation (missing)
2. Expiration notifications (no alerts/emails)
3. Sample location & identification (missing physical location, coordinates)
4. Editable data display (basic, needs enhancement)

### ❌ Not Implemented (Build after migration)
1. Equipment scheduling overlap detection
2. Sample auto-replica creation
3. Duplicate replica feature
4. Sample conditions/tags system
5. **Entire Routines module** (checklist, materials, steps, equipment)
6. **Notification center** (persistent notifications)
7. **Email invitation system**

---

## Phase 1: Project Setup & Foundation (2-3 hours)

### Step 1.1: Initialize React Project
**Goal**: Set up new React application with modern tooling

**Actions**:
1. Create new React + TypeScript project with Vite:
   ```bash
   npm create vite@latest nevamanagement-react -- --template react-ts
   cd nevamanagement-react
   ```

2. Install core dependencies:
   ```bash
   npm install react-router-dom @tanstack/react-query axios
   npm install -D @types/node
   ```

3. Install UI libraries (Bootstrap ecosystem):
   ```bash
   npm install bootstrap react-bootstrap
   npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/react-fontawesome
   npm install react-hot-toast  # React alternative to ngx-toastr
   ```

4. Install utility libraries:
   ```bash
   npm install zustand  # State management (simpler than Redux)
   npm install react-infinite-scroll-component  # Alternative to ngx-infinite-scroll
   ```

**Deliverables**:
- ✅ Running React app on dev server
- ✅ All dependencies installed
- ✅ TypeScript configured

---

### Step 1.2: Setup Project Structure
**Goal**: Organize folders to match Angular modules

**Actions**:
1. Create folder structure:
   ```
   src/
   ├── components/
   │   ├── shared/         # Shared components (nav-bar, spinner, etc.)
   │   ├── container/      # Container feature
   │   ├── organism/       # Organism feature
   │   ├── location/       # Location feature
   │   ├── product/        # Product feature
   │   ├── equipment/      # Equipment feature
   │   └── auth/           # Login, change password
   ├── hooks/              # Custom React hooks
   ├── services/           # API services
   ├── types/              # TypeScript interfaces/types
   ├── utils/              # Utility functions
   ├── store/              # Zustand store
   ├── config/             # Config files (environment, constants)
   └── router/             # Routing configuration
   ```

2. Create environment config:
   - Copy `environment.ts` values to `.env` files
   - Create `src/config/env.ts` to read environment variables

**Deliverables**:
- ✅ Organized folder structure
- ✅ Environment configuration

---

### Step 1.3: Setup Routing & Authentication
**Goal**: Implement React Router with protected routes

**Actions**:
1. Create `src/router/AppRouter.tsx`:
   - Define all routes matching Angular routing
   - Implement protected route wrapper component

2. Create `src/router/ProtectedRoute.tsx`:
   - Check authentication status
   - Redirect to login if not authenticated

3. Create route configuration:
   ```typescript
   // Routes to implement:
   / → Home (protected)
   /login → Login
   /menu → Menu (protected)
   /change-password → Change Password
   /user-history → User History (protected)
   /containers/* → Container routes (protected, lazy loaded)
   /organisms/* → Organism routes (protected, lazy loaded)
   /locations/* → Location routes (protected, lazy loaded)
   /products/* → Product routes (protected, lazy loaded)
   /equipment/* → Equipment routes (protected, lazy loaded)
   ```

**Deliverables**:
- ✅ Router setup with all routes
- ✅ Protected route component
- ✅ Lazy loading configured

---

## Phase 2: Core Infrastructure (2-3 hours)

### Step 2.1: Migrate Services & API Layer
**Goal**: Convert Angular services to React API utilities

**Actions**:
1. Create Axios instance (`src/services/api.ts`):
   - Configure base URL
   - Add request interceptor for auth token (replaces AuthorizationInterceptor)
   - Add response interceptor for error handling (replaces HttpErrorInterceptor)

2. Migrate each service to API functions:
   - `auth.service.ts` → `src/services/authService.ts`
   - `container.service.ts` → `src/services/containerService.ts`
   - `organism.service.ts` → `src/services/organismService.ts`
   - `location.service.ts` → `src/services/locationService.ts`
   - `product.service.ts` → `src/services/productService.ts`
   - `equipment.service.ts` → `src/services/equipmentService.ts`
   - `user.service.ts` → `src/services/userService.ts`
   - `researcher.service.ts` → `src/services/researcherService.ts`
   - `equipment-usage.service.ts` → `src/services/equipmentUsageService.ts`
   - `product-usage.service.ts` → `src/services/productUsageService.ts`

3. Convert RxJS Observables to Promises:
   - Replace `Observable<T>` with `Promise<T>`
   - Use async/await instead of subscribe

**Deliverables**:
- ✅ Axios configured with interceptors
- ✅ All 14 services migrated
- ✅ No RxJS dependencies

---

### Step 2.2: Create TypeScript Types/Interfaces
**Goal**: Migrate Angular interfaces to TypeScript types

**Actions**:
1. Copy all interface files from `src/models/`:
   - Create `src/types/` directory
   - Copy and adapt all DTOs and interfaces
   - Remove Angular-specific decorators if any

2. Create shared types:
   - `src/types/auth.types.ts` - User, LoggedUser, LoginDto, ChangePassword
   - `src/types/container.types.ts`
   - `src/types/organism.types.ts`
   - `src/types/location.types.ts`
   - `src/types/product.types.ts`
   - `src/types/equipment.types.ts`
   - `src/types/common.types.ts` - Shared types

**Deliverables**:
- ✅ All TypeScript types migrated
- ✅ Properly organized by domain

---

### Step 2.3: Setup State Management
**Goal**: Create authentication and global state

**Actions**:
1. Create authentication store (`src/store/authStore.ts`):
   ```typescript
   // Using Zustand for simple state management
   - Store: token, user, isAuthenticated
   - Actions: login, logout, setUser, getToken
   ```

2. Create toast notification utility (`src/utils/toast.ts`):
   - Wrap react-hot-toast
   - Replicate ngx-toastr behavior
   - Create success, error, info, warning helpers

3. Create React Query setup (`src/config/queryClient.ts`):
   - Configure default options
   - Setup query client

**Deliverables**:
- ✅ Auth store working
- ✅ Toast notifications configured
- ✅ React Query ready

---

## Phase 3: Shared Components (2-3 hours)

### Step 3.1: Migrate Shared UI Components
**Goal**: Convert shared components used across the app

**Priority Order** (most used first):
1. ✅ `nav-bar.component` → `src/components/shared/NavBar.tsx`
2. ✅ `spinner.component` → `src/components/shared/Spinner.tsx`
3. ✅ `toast.component` → `src/components/shared/Toast.tsx` (use react-hot-toast)
4. ✅ `back-arrow.component` → `src/components/shared/BackArrow.tsx`
5. ✅ `small-card.component` → `src/components/shared/SmallCard.tsx`
6. ✅ `dynamic-form.component` → `src/components/shared/DynamicForm.tsx`
7. ✅ `dynamic-form-question.component` → `src/components/shared/DynamicFormQuestion.tsx`

**Actions** for each component:
1. Create React component file
2. Convert Angular template to JSX
3. Replace Angular directives:
   - `*ngIf` → `{condition && <div>}`
   - `*ngFor` → `.map()`
   - `[(ngModel)]` → `useState` + `onChange`
   - `(click)` → `onClick`
   - `[class.active]` → conditional className
4. Replace Angular services with React hooks
5. Test component in isolation

**Deliverables**:
- ✅ All 7 shared components migrated
- ✅ Components styled with Bootstrap

---

## Phase 4: Feature Modules (5-7 hours)

### Step 4.1: Authentication Module (1 hour)
**Goal**: Migrate login and authentication flows

**Components to migrate**:
1. `login.component` → `src/components/auth/Login.tsx`
2. `change-password.component` → `src/components/auth/ChangePassword.tsx`

**Custom hooks to create**:
1. `useAuth()` - Wraps auth store and login/logout logic
2. `useLogin()` - Handles login form and API call

**Actions**:
1. Create Login component with form handling (react-hook-form or native state)
2. Create ChangePassword component
3. Implement login flow:
   - Form submission
   - API call
   - Store token in localStorage
   - Update auth store
   - Redirect to home
4. Implement logout functionality

**Deliverables**:
- ✅ Login working
- ✅ Change password working
- ✅ Auth flow complete

---

### Step 4.2: Container Module (1-1.5 hours)
**Goal**: Migrate all container-related components

**Components** (6 total):
1. `container.component` → `src/components/container/Container.tsx`
2. `container-list.component` → `src/components/container/ContainerList.tsx`
3. `container-card.component` → `src/components/container/ContainerCard.tsx`
4. `add-container.component` → `src/components/container/AddContainer.tsx`
5. `next-transfers.component` → `src/components/container/NextTransfers.tsx`

**Custom hooks**:
1. `useContainers()` - Fetch container list with React Query
2. `useAddContainer()` - Create mutation for adding container

**Actions**:
1. Migrate each component to React
2. Replace Angular forms with controlled components
3. Implement infinite scroll with react-infinite-scroll-component
4. Setup React Query for data fetching
5. Handle loading and error states

**Deliverables**:
- ✅ All container components working
- ✅ CRUD operations functional
- ✅ Infinite scroll working

---

### Step 4.3: Organism Module (1-1.5 hours)
**Goal**: Migrate all organism-related components

**Components** (4 total):
1. `organism.component` → `src/components/organism/Organism.tsx`
2. `organism-list.component` → `src/components/organism/OrganismList.tsx`
3. `add-organism.component` → `src/components/organism/AddOrganism.tsx`
4. `edit-organism.component` → `src/components/organism/EditOrganism.tsx`

**Custom hooks**:
1. `useOrganisms()` - Fetch organism list
2. `useAddOrganism()` - Create mutation
3. `useEditOrganism()` - Update mutation

**Actions**:
1. Migrate components following same pattern as containers
2. Implement forms with validation
3. Setup data fetching with React Query

**Deliverables**:
- ✅ All organism components working
- ✅ CRUD operations functional

---

### Step 4.4: Location Module (1-1.5 hours)
**Goal**: Migrate all location-related components

**Components** (4 total):
1. `location.component` → `src/components/location/Location.tsx`
2. `location-list.component` → `src/components/location/LocationList.tsx`
3. `add-location.component` → `src/components/location/AddLocation.tsx`
4. `edit-location.component` → `src/components/location/EditLocation.tsx`

**Custom hooks**:
1. `useLocations()` - Fetch location list
2. `useAddLocation()` - Create mutation
3. `useEditLocation()` - Update mutation

**Actions**:
1. Follow same migration pattern
2. Ensure forms work properly

**Deliverables**:
- ✅ All location components working
- ✅ CRUD operations functional

---

### Step 4.5: Product Module (1.5-2 hours)
**Goal**: Migrate all product-related components

**Components** (7 total):
1. `product.component` → `src/components/product/Product.tsx`
2. `product-list.component` → `src/components/product/ProductList.tsx`
3. `product-card.component` → `src/components/product/ProductCard.tsx`
4. `product-info.component` → `src/components/product/ProductInfo.tsx`
5. `add-product.component` → `src/components/product/AddProduct.tsx`
6. `edit-product.component` → `src/components/product/EditProduct.tsx`
7. `add-quantity.component` → `src/components/product/AddQuantity.tsx`
8. `use-product.component` → `src/components/product/UseProduct.tsx`

**Custom hooks**:
1. `useProducts()` - Fetch product list
2. `useProductInfo()` - Fetch single product
3. `useAddProduct()` - Create mutation
4. `useEditProduct()` - Update mutation
5. `useProductUsage()` - Usage tracking

**Actions**:
1. Migrate all components
2. Implement product usage tracking
3. Handle product quantity updates

**Deliverables**:
- ✅ All product components working
- ✅ Usage tracking functional

---

### Step 4.6: Equipment Module (1.5-2 hours)
**Goal**: Migrate all equipment-related components

**Components** (8 total):
1. `equipment.component` → `src/components/equipment/Equipment.tsx`
2. `equipment-list.component` → `src/components/equipment/EquipmentList.tsx`
3. `equipment-card.component` → `src/components/equipment/EquipmentCard.tsx`
4. `equipment-info.component` → `src/components/equipment/EquipmentInfo.tsx`
5. `add-equipment.component` → `src/components/equipment/AddEquipment.tsx`
6. `edit-equipment.component` → `src/components/equipment/EditEquipment.tsx`
7. `use-equipment.component` → `src/components/equipment/UseEquipment.tsx`
8. `usage-history.component` → `src/components/equipment/UsageHistory.tsx`

**Custom hooks**:
1. `useEquipment()` - Fetch equipment list
2. `useEquipmentInfo()` - Fetch single equipment
3. `useAddEquipment()` - Create mutation
4. `useEditEquipment()` - Update mutation
5. `useEquipmentUsage()` - Usage tracking and history

**Actions**:
1. Migrate all components
2. Implement usage history view
3. Handle equipment reservation/usage

**Deliverables**:
- ✅ All equipment components working
- ✅ Usage tracking functional

---

### Step 4.7: Core Pages (30 minutes)
**Goal**: Migrate remaining core pages

**Components** (3 total):
1. `app.component` → `src/App.tsx` (main app shell)
2. `home.component` → `src/components/Home.tsx`
3. `menu.component` → `src/components/Menu.tsx`
4. `user-history.component` → `src/components/UserHistory.tsx`

**Actions**:
1. Create main App component with router
2. Migrate Home dashboard
3. Migrate Menu navigation
4. Migrate User History view

**Deliverables**:
- ✅ Core pages working
- ✅ Navigation functional

---

## Phase 5: Testing & Refinement (2-3 hours)

### Step 5.1: Manual Testing
**Goal**: Test all features end-to-end

**Test Checklist**:
- [ ] Login/Logout flow
- [ ] Change password
- [ ] Protected routes redirect properly
- [ ] Container CRUD operations
- [ ] Organism CRUD operations
- [ ] Location CRUD operations
- [ ] Product CRUD operations
- [ ] Equipment CRUD operations
- [ ] Product usage tracking
- [ ] Equipment usage tracking
- [ ] Infinite scroll on lists
- [ ] Toast notifications appear
- [ ] Spinner shows during loading
- [ ] Back navigation works
- [ ] Forms validate properly
- [ ] Error handling displays correctly

**Actions**:
1. Create test account
2. Go through each feature systematically
3. Document bugs in a list
4. Fix bugs one by one

**Deliverables**:
- ✅ All features tested
- ✅ Bug list created and resolved

---

### Step 5.2: Performance Optimization
**Goal**: Ensure app performs well

**Actions**:
1. Implement code splitting for routes:
   ```typescript
   const Equipment = lazy(() => import('./components/equipment/Equipment'))
   ```

2. Add React.memo to frequently re-rendered components

3. Optimize React Query cache settings

4. Review bundle size:
   ```bash
   npm run build
   npm install -D vite-plugin-bundle-analyzer
   ```

5. Remove unused dependencies

**Deliverables**:
- ✅ Lazy loading implemented
- ✅ Bundle optimized
- ✅ Performance acceptable

---

### Step 5.3: Polish & UI/UX
**Goal**: Match Angular app's look and feel

**Actions**:
1. Review all pages for styling consistency
2. Ensure Bootstrap classes match original
3. Fix any layout issues
4. Verify responsive design works
5. Test FontAwesome icons display correctly
6. Ensure toast notifications match original style

**Deliverables**:
- ✅ UI matches original design
- ✅ Responsive design working

---

## Phase 6: Deployment Preparation (1 hour)

### Step 6.1: Build Configuration
**Goal**: Setup production build

**Actions**:
1. Update `package.json` scripts:
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "tsc && vite build",
       "preview": "vite preview"
     }
   }
   ```

2. Configure environment variables for production

3. Update `server.js` (Express server):
   - Serve React build instead of Angular dist
   - Update paths to `dist/` folder

4. Test production build locally:
   ```bash
   npm run build
   npm start
   ```

**Deliverables**:
- ✅ Production build working
- ✅ Express server configured

---

### Step 6.2: Migration Validation
**Goal**: Final verification before deployment

**Actions**:
1. Compare feature parity:
   - Create checklist of all Angular features
   - Verify each exists in React version

2. Performance comparison:
   - Measure bundle size (Angular vs React)
   - Test load times
   - Check Lighthouse scores

3. Create migration notes:
   - Document any differences
   - Note breaking changes
   - List new dependencies

**Deliverables**:
- ✅ Feature parity confirmed
- ✅ Migration documentation complete

---

## Summary Timeline

### Core Migration (Existing Features Only)

| Phase | Duration | Description |
|-------|----------|-------------|
| **Phase 1** | 2-3 hours | Project setup, routing, auth foundation |
| **Phase 2** | 2-3 hours | Services, types, state management |
| **Phase 3** | 2-3 hours | Shared components |
| **Phase 4** | 5-7 hours | Feature modules (auth, container, organism, location, product, equipment) |
| **Phase 5** | 2-3 hours | Testing, optimization, polish |
| **Phase 6** | 1 hour | Deployment preparation |
| **SUBTOTAL** | **14-19 hours** | Migrate existing features |

### Post-Migration Feature Completion

| Task | Duration | Priority |
|------|----------|----------|
| Add DELETE operations (all entities) | 2h | HIGH |
| Equipment overlap detection | 1h | HIGH |
| Duplicate container/replica | 1h | MEDIUM |
| Sample tags system | 2h | MEDIUM |
| Enhanced sample identification | 2h | MEDIUM |
| **SUBTOTAL** | **8 hours** | Complete partial features |

### New Feature Development (Post-Migration)

| Feature | Duration | Priority |
|---------|----------|----------|
| Notification Center (UI + backend) | 4-6h | HIGH |
| Email integration & invitation system | 3-5h | HIGH |
| Routines Module (complete system) | 8-12h | HIGH |
| Enhanced sample management | 3-5h | MEDIUM |
| **SUBTOTAL** | **18-28 hours** | Build new features |

### **TOTAL PROJECT TIME**: **40-55 hours**
- Migration: 14-19h
- Completion: 8h
- New Features: 18-28h

---

## Key Migration Patterns

### Angular → React Conversions

| Angular | React Equivalent |
|---------|------------------|
| `*ngIf="condition"` | `{condition && <Component />}` |
| `*ngFor="let item of items"` | `{items.map(item => <Component key={item.id} />)}` |
| `[(ngModel)]="value"` | `value={value} onChange={(e) => setValue(e.target.value)}` |
| `(click)="method()"` | `onClick={method}` |
| `[class.active]="isActive"` | `className={isActive ? 'active' : ''}` |
| `Observable<T>` | `Promise<T>` or React Query |
| `Injectable` service | Plain TypeScript function/class |
| `@Input()` | Component props |
| `@Output()` | Callback props |
| `FormGroup` | `useState` or `react-hook-form` |
| `HttpClient` | `axios` |
| Route guards | `ProtectedRoute` wrapper |
| Interceptors | Axios interceptors |

---

## Dependencies Comparison

### Removed (Angular-specific)
- All `@angular/*` packages
- `rxjs` (partially - may keep for complex state)
- `zone.js`
- `ngx-toastr`
- `ngx-infinite-scroll`
- `@ng-bootstrap/ng-bootstrap`

### Added (React ecosystem)
- `react` + `react-dom`
- `react-router-dom`
- `@tanstack/react-query`
- `axios`
- `zustand`
- `react-hot-toast`
- `react-bootstrap`
- `react-infinite-scroll-component`
- `vite` (build tool)

---

## Risk Mitigation

### Potential Challenges
1. **Complex forms**: Dynamic forms may need custom React implementation
2. **RxJS operators**: Complex observable chains need refactoring
3. **Service dependencies**: Ensure all service calls are properly migrated
4. **Styling differences**: Bootstrap behavior may differ between ng-bootstrap and react-bootstrap

### Mitigation Strategies
1. Keep Angular app running during migration for reference
2. Migrate module by module, testing each thoroughly
3. Use feature flags if deploying incrementally
4. Keep detailed migration log of issues and solutions

---

## Post-Migration Benefits

1. **Smaller bundle size**: React + Vite typically produces smaller bundles than Angular
2. **Faster development**: HMR (Hot Module Replacement) in Vite is extremely fast
3. **Simpler state management**: Less boilerplate than Angular services
4. **Larger ecosystem**: More React libraries and community support
5. **Better performance**: React's virtual DOM is highly optimized
6. **Modern tooling**: Vite provides superior DX compared to Angular CLI

---

## Next Steps After Migration

1. **Add tests**: Implement unit tests with Vitest, integration tests with Testing Library
2. **Setup CI/CD**: Configure automated testing and deployment
3. **Documentation**: Update README with React setup instructions
4. **Team training**: If team is new to React, provide training sessions
5. **Monitoring**: Setup error tracking (Sentry) and analytics
