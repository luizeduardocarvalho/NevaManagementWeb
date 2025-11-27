# LabFlux Migration - Implementation Checklist

**Migration Goal:** Auth + Product Management MVP
**Start Date:** 2025-11-15
**Tech Stack:** React 18 + TypeScript + Vite + TanStack Query + Zustand + shadcn/ui + Clerk

---

## Phase 1: Project Setup ✅

### Step 1.1: Initialize React Project
- [x] Create React + TypeScript project with Vite: `pnpm create vite@latest react-app -- --template react-ts`
- [x] Navigate to project: `cd react-app`
- [x] Verify project runs: `pnpm install && pnpm run dev` ✅ Server running on http://localhost:5173/

### Step 1.2: Install Core Dependencies
```bash
# Core dependencies
pnpm install react-router-dom @tanstack/react-query axios zustand

# Clerk for authentication
pnpm install @clerk/clerk-react

# Date handling
pnpm install date-fns
```
- [x] Core dependencies installed
- [x] Clerk installed
- [x] Date-fns installed

### Step 1.3: Install Tailwind CSS
```bash
pnpm install -D tailwindcss postcss autoprefixer
pnpm install tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react
```
- [x] Tailwind CSS installed
- [x] `tailwind.config.js` created
- [x] `postcss.config.js` created

### Step 1.4: Install shadcn/ui Dependencies
```bash
pnpm install tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react
```
- [x] shadcn/ui dependencies installed

### Step 1.5: Initialize shadcn/ui
- [x] shadcn/ui initialized (manual configuration)
- [x] `components.json` created
- [x] `src/lib/utils.ts` created
- [x] `src/index.css` updated with Tailwind + CSS variables
- [x] `tsconfig.app.json` updated with @ path alias
- [x] `vite.config.ts` updated with @ path alias

### Step 1.6: Install shadcn/ui Components
**Note:** Install components as needed during development using:
```bash
npx shadcn-ui@latest add <component-name>
```
- [ ] Install components as needed (button, card, input, label, select, table, dialog, toast, badge, separator, skeleton, dropdown-menu)

---

## Phase 2: Configuration Files ✅

### Step 2.1: Environment Variables
- [x] Create `.env.local` with production API URL and Clerk key
- [x] Create `.env.development` with local API URL and Clerk key
- [x] Add `.env*.local` to `.gitignore` (already in .gitignore as *.local)

**`.env.local`:**
```env
VITE_API_BASE_URL=https://us-central1-labflux-475521.cloudfunctions.net/labflux-api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

**`.env.development`:**
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Step 2.2: Tailwind Configuration
- [ ] Verify `tailwind.config.js` includes correct content paths
- [ ] Verify dark mode is configured

### Step 2.3: Update CSS
- [ ] Update `src/index.css` with Tailwind directives

**`src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Phase 3: Project Structure ✅

### Step 3.1: Create Folder Structure
```bash
mkdir -p src/components/{shared,product,auth} src/hooks src/services src/types src/store src/config src/router src/pages/product
```

- [x] All folders created

**Expected structure:**
```
src/
├── components/
│   ├── ui/              # shadcn components (auto-generated)
│   ├── shared/          # NavBar, Spinner, etc.
│   ├── product/         # Product feature components
│   └── auth/            # Auth wrapper components
├── hooks/               # Custom React hooks
├── services/            # API service functions
├── types/               # TypeScript types
├── store/               # Zustand stores
├── config/              # Config files
├── router/              # Routing setup
├── pages/               # Page components
│   └── product/         # Product pages
├── lib/                 # Utilities (shadcn utils)
├── App.tsx
├── main.tsx
└── index.css
```

---

## Phase 4: TypeScript Types ✅

### Step 4.1: Create Type Files

**`src/types/auth.types.ts`**
- [x] Created with User interface

**`src/types/laboratory.types.ts`**
- [x] Created with Laboratory interface

**`src/types/location.types.ts`**
- [x] Created with Location interface

**`src/types/product.types.ts`**
- [x] Created with Product, DetailedProduct interfaces
- [x] Created with CreateProductRequest, EditProductRequest interfaces
- [x] Created with AddQuantityRequest, UseProductRequest interfaces

**`src/types/common.types.ts`**
- [x] Created with ApiError, PaginationParams interfaces

---

## Phase 5: Core Services ✅

### Step 5.1: Axios Instance
**`src/services/api.ts`**
- [x] Created Axios instance with base URL
- [x] Added request interceptor for JWT token
- [x] Added response interceptor for 401 errors
- [x] Token read from localStorage

### Step 5.2: Auth Service
**`src/services/authService.ts`**
- [x] Created getCurrentUser function
- [x] Exports authService object

### Step 5.3: Product Service
**`src/services/productService.ts`**
- [x] Created getAll function
- [x] Created getById function
- [x] Created getDetailedById function
- [x] Created getLowInStock function
- [x] Created create function
- [x] Created edit function
- [x] Created addQuantity function
- [x] Created useProduct function
- [x] Exports productService object

---

## Phase 6: State Management ✅

### Step 6.1: Auth Store (Zustand)
**`src/store/authStore.ts`**
- [x] Created auth store with token, user, isAuthenticated, laboratoryId
- [x] Implemented setAuth function
- [x] Implemented clearAuth function
- [x] Implemented updateUser function
- [x] Store persists to localStorage

### Step 6.2: TanStack Query Setup
**`src/config/queryClient.ts`**
- [x] Created and exported queryClient
- [x] Configured default options (staleTime, retry, refetchOnWindowFocus)

---

## Phase 7: Custom Hooks (TanStack Query) ⏳

### Step 7.1: Product Hooks
**`src/hooks/useProducts.ts`**
- [ ] Created useProducts hook (list with pagination)
- [ ] Created useProduct hook (single product)
- [ ] Created useDetailedProduct hook (detailed product)
- [ ] Created useLowStockProducts hook
- [ ] Created useCreateProduct mutation
- [ ] Created useEditProduct mutation
- [ ] Created useAddQuantity mutation
- [ ] Created useUseProduct mutation
- [ ] All hooks integrate with toast notifications

---

## Phase 8: Authentication Components ⏳

### Step 8.1: Clerk Auth Wrapper
**`src/components/auth/ClerkAuthWrapper.tsx`**
- [ ] Created ClerkAuthWrapper component
- [ ] Syncs Clerk session with Zustand store
- [ ] Fetches backend user on auth
- [ ] Shows loading spinner while initializing
- [ ] Stores JWT token in localStorage

### Step 8.2: Protected Route
**`src/router/ProtectedRoute.tsx`**
- [ ] Created ProtectedRoute component
- [ ] Checks isAuthenticated from Zustand
- [ ] Redirects to /sign-in if not authenticated

---

## Phase 9: Routing ⏳

### Step 9.1: Root Layout
**`src/components/shared/RootLayout.tsx`**
- [ ] Created RootLayout with Outlet
- [ ] Includes NavBar
- [ ] Includes Toaster (for notifications)
- [ ] Main content area with proper spacing

### Step 9.2: Router Configuration
**`src/router/AppRouter.tsx`**
- [ ] Created router with createBrowserRouter
- [ ] Added /sign-in route with Clerk SignIn
- [ ] Added /sign-up route with Clerk SignUp
- [ ] Added protected / route with RootLayout
- [ ] Added /products routes (list, add, detail, edit)
- [ ] Added catch-all redirect to /

---

## Phase 10: Shared Components ⏳

### Step 10.1: NavBar
**`src/components/shared/NavBar.tsx`**
- [ ] Created NavBar component
- [ ] Shows user name/email from Zustand
- [ ] Shows laboratory name
- [ ] Navigation links (Home, Products)
- [ ] User menu with logout
- [ ] Uses shadcn/ui DropdownMenu
- [ ] Clerk UserButton integration

### Step 10.2: Spinner/Loading
**`src/components/shared/Spinner.tsx`**
- [ ] Created Spinner component
- [ ] Uses Lucide Loader2 icon with spin animation
- [ ] Accepts size prop

### Step 10.3: Back Button
**`src/components/shared/BackButton.tsx`**
- [ ] Created BackButton component
- [ ] Uses react-router navigate(-1)
- [ ] Uses shadcn/ui Button with variant="ghost"
- [ ] Shows arrow icon

---

## Phase 11: Product Components ⏳

### Step 11.1: Product Card
**`src/components/product/ProductCard.tsx`**
- [ ] Created ProductCard component
- [ ] Shows product name, formula, quantity, unit
- [ ] Shows expiration date (formatted with date-fns)
- [ ] Shows location name
- [ ] Link to product detail page
- [ ] Uses shadcn/ui Card
- [ ] Shows low stock badge if quantity <= 10

### Step 11.2: Product Form
**`src/components/product/ProductForm.tsx`**
- [ ] Created ProductForm component
- [ ] Handles both create and edit modes
- [ ] Fields: name, description, formula, quantity, unit, expiration_date, location_id
- [ ] Form validation
- [ ] Uses shadcn/ui Input, Label, Select, Button
- [ ] Submits to useCreateProduct or useEditProduct mutation
- [ ] Shows loading state during submission

### Step 11.3: Add Quantity Dialog
**`src/components/product/AddQuantityDialog.tsx`**
- [ ] Created AddQuantityDialog component
- [ ] Uses shadcn/ui Dialog
- [ ] Input for quantity to add
- [ ] Calls useAddQuantity mutation
- [ ] Shows current quantity
- [ ] Shows projected quantity after addition

### Step 11.4: Use Product Dialog
**`src/components/product/UseProductDialog.tsx`**
- [ ] Created UseProductDialog component
- [ ] Uses shadcn/ui Dialog
- [ ] Input for quantity to use
- [ ] Calls useUseProduct mutation
- [ ] Shows current quantity
- [ ] Validates sufficient quantity
- [ ] Shows projected quantity after use

---

## Phase 12: Product Pages ⏳

### Step 12.1: Product List Page
**`src/pages/product/ProductListPage.tsx`**
- [ ] Created ProductListPage component
- [ ] Fetches products with useProducts hook
- [ ] Implements pagination (10 per page)
- [ ] Shows loading skeleton
- [ ] Shows error state
- [ ] Maps products to ProductCard components
- [ ] "Add Product" button navigating to /products/add
- [ ] Shows empty state if no products

### Step 12.2: Product Detail Page
**`src/pages/product/ProductDetailPage.tsx`**
- [ ] Created ProductDetailPage component
- [ ] Fetches detailed product with useDetailedProduct hook
- [ ] Shows all product information
- [ ] Shows location information
- [ ] Shows quantity used in last 3 months
- [ ] "Edit" button navigating to /products/:id/edit
- [ ] "Add Quantity" button opening AddQuantityDialog
- [ ] "Use Product" button opening UseProductDialog
- [ ] BackButton component
- [ ] Uses shadcn/ui Card, Badge, Separator

### Step 12.3: Add Product Page
**`src/pages/product/AddProductPage.tsx`**
- [ ] Created AddProductPage component
- [ ] Renders ProductForm in create mode
- [ ] Redirects to product list after success
- [ ] BackButton component
- [ ] Page title "Add New Product"

### Step 12.4: Edit Product Page
**`src/pages/product/EditProductPage.tsx`**
- [ ] Created EditProductPage component
- [ ] Fetches product with useProduct hook
- [ ] Renders ProductForm in edit mode with initial data
- [ ] Shows loading state while fetching
- [ ] Redirects to product detail after success
- [ ] BackButton component
- [ ] Page title "Edit Product"

### Step 12.5: Home Page
**`src/pages/HomePage.tsx`**
- [ ] Created HomePage component
- [ ] Shows welcome message with user name
- [ ] Shows laboratory name
- [ ] Shows low stock products section
- [ ] Fetches low stock products with useLowStockProducts hook
- [ ] Shows count of low stock items
- [ ] Maps low stock products to ProductCard
- [ ] Link to all products
- [ ] Dashboard-style layout with shadcn/ui Cards

---

## Phase 13: Main App Setup ⏳

### Step 13.1: Main Entry Point
**`src/main.tsx`**
- [ ] Imports ClerkProvider
- [ ] Wraps app with ClerkProvider
- [ ] Wraps app with QueryClientProvider
- [ ] Includes Toaster component
- [ ] Sets up Clerk with publishable key from env

### Step 13.2: App Component
**`src/App.tsx`**
- [ ] Wraps AppRouter with ClerkAuthWrapper
- [ ] Clean, simple component

---

## Phase 14: Testing ⏳

### Step 14.1: Authentication Flow
- [ ] Sign up works
- [ ] Sign in works
- [ ] JWT token stored in localStorage
- [ ] User data fetched from backend
- [ ] Protected routes redirect to sign-in
- [ ] After sign-in, redirected to home
- [ ] Sign out clears token and redirects to sign-in

### Step 14.2: Product CRUD
- [ ] Product list displays (with pagination)
- [ ] Product detail displays
- [ ] Create product works
- [ ] Edit product works
- [ ] Add quantity works
- [ ] Use product works
- [ ] Low stock products display on home
- [ ] Navigation between pages works
- [ ] Back buttons work
- [ ] Loading states display
- [ ] Error states display
- [ ] Success toasts appear
- [ ] Error toasts appear

### Step 14.3: Multi-tenant Isolation
- [ ] Products filtered by laboratoryId
- [ ] Cannot access other laboratory's data
- [ ] Laboratory name displays correctly

---

## Phase 15: Deployment ⏳

### Step 15.1: Vercel Configuration
**`vercel.json`**
- [ ] Created vercel.json
- [ ] Added rewrite rules for SPA routing

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Step 15.2: Build & Deploy
- [ ] Run `npm run build` locally to verify
- [ ] Fix any build errors
- [ ] Connect GitHub repo to Vercel
- [ ] Configure environment variables in Vercel dashboard
- [ ] Deploy to Vercel
- [ ] Verify production build works
- [ ] Test authentication in production
- [ ] Test product CRUD in production

---

## Phase 16: Cleanup ⏳

### Step 16.1: Remove Angular App (After React is Stable)
- [ ] Backup Angular app
- [ ] Delete Angular files
- [ ] Move React app to root
- [ ] Update package.json name to "labflux-web"
- [ ] Update server.js if needed (for local dev)
- [ ] Test everything still works

---

## Next Features (Post-MVP)

### Equipment Management
- [ ] Equipment CRUD
- [ ] Equipment usage scheduling
- [ ] Equipment usage calendar view
- [ ] Equipment usage history
- [ ] Conflict detection for double-booking

### Location Management
- [ ] Location CRUD (when backend endpoints available)
- [ ] Hierarchical locations (sub-locations)

### Laboratory Management
- [ ] Create laboratory
- [ ] Invite users
- [ ] Accept invitation flow
- [ ] View invitations

### Container & Organism Modules
- [ ] Determine if still needed
- [ ] Implement if backend endpoints exist

---

## Notes

**Tech Stack:**
- React 18 + TypeScript
- Vite (build tool)
- TanStack Query (data fetching)
- Zustand (state management)
- shadcn/ui + Tailwind CSS (UI)
- Clerk (authentication)
- Axios (HTTP client)
- Lucide React (icons)
- date-fns (date formatting)

**Key Decisions:**
- Manual JWT management (token stored in localStorage)
- Clerk only for auth UI, backend handles validation
- Multi-tenant via laboratoryId in JWT
- Pagination: 10 items per page
- Toast notifications for all mutations

**Important:**
- Mark tasks as you complete them with [x]
- Keep this file in sync across all work sessions
- Update with any deviations from the plan

**Last Updated:** 2025-11-15
