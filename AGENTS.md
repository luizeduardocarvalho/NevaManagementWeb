# Repository Guidelines (LabFlux Web – React / TS / Vite)

## General rules

- Do not apologize  
- Do not thank me  
- Talk to me like a human  
- Verify information before making changes  
- Preserve existing code structures and patterns  
- Provide concise and relevant responses  
- Prefer minimal changes that fully solve the problem  
- Verify all information before making changes  
- Do not change behavior that is not explicitly in scope  
- Do not introduce new major dependencies or design systems without a clear reason

### You will be penalized if you:

- Skip steps in your thought process  
- Add placeholders or TODOs for other developers  
- Deliver code that is not production-ready  
- Break multi-tenancy guarantees or data isolation at the UX level  
- Introduce regressions to existing flows, layouts, or routing  
- Bypass existing abstractions for data fetching or state management

I'm tipping **$9000** for an optimal, elegant, minimal, world-class solution that meets all specifications.  
Your code changes should be specific and complete.  
Think through the problem step-by-step.

---

# Project Context (LabFlux Frontend)

You are working on the **LabFlux** frontend, a web UI for a multi-tenant laboratory management system.

The frontend:

- Is a **React 18 + TypeScript** SPA, built with **Vite**
- Uses **React Router** for client-side routing
- Uses **TanStack Query** for server state and data fetching
- Uses **Zustand** for client-side (UI/app) state
- Uses **shadcn/ui** + **Tailwind CSS** for UI components and styling
- Uses **Sonner** (shadcn toast) for notifications
- Uses **Axios** as the HTTP client
- Uses **Lucide React** for icons
- Talks to a backend that uses **JWT authentication**
- Is deployed to **Vercel** (free tier)

Your job is to extend and maintain this frontend while respecting these constraints and patterns.

---

# Tech Stack Rules

## Core Stack (do not replace)

- **Frontend Framework:** React 18 + TypeScript + Vite
- **Routing:** React Router
- **Data Fetching:** TanStack Query
- **State Management:** Zustand
- **UI Components:** shadcn/ui + Tailwind CSS
- **Notifications:** Sonner
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Authentication:** JWT (backend-managed; frontend is a client)
- **Deployment:** Vercel

### Rules:

- Do not migrate to Next.js, CRA, or other frameworks.
- Do not add a second router, second state library, or alternative query/fetch library.
- When you need new UI pieces, prefer:
  1. Existing shadcn/ui components
  2. Local wrappers built on Tailwind + primitive shadcn/ui building blocks

---

# Suggested Project Structure & Organization

(A concrete structure may already exist; **follow it**. If adding new files, follow this pattern.)

```text
src/
├── app/
│   ├── providers/        # QueryClientProvider, Zustand providers, theme, etc.
│   └── main.tsx          # Root React entry
├── routes/
│   ├── index.tsx         # Route config and layout routes
│   ├── dashboard/
│   ├── products/
│   ├── equipment/
│   └── auth/
├── features/
│   ├── products/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── equipment/
│   └── laboratory/
├── components/
│   ├── ui/               # Re-exported shadcn components
│   └── common/           # Shared layout, tables, modals, etc.
├── hooks/                # Reusable generic hooks (not feature-specific)
├── lib/                  # Axios client, helpers, config, utils
├── store/                # Zustand stores
├── styles/               # Tailwind config, globals
└── types/                # Global/shared TS types
```

### Rules:

- Co-locate feature-specific components, hooks, and API calls inside `features/<domain>`.
- Keep shared, generic components in `components/common`.
- Do not dump everything into a single `components/` or `utils/` folder.
- Route-level components live under `routes/` and orchestrate feature components.

---

# TypeScript & Code Style

- Strict TypeScript (`strict: true` or equivalent) is preferred.
- Do not use `any` unless absolutely necessary (and document why).
- Prefer specific types and interfaces over generic `Record<string, unknown>`.
- Use `type` or `interface` consistently (align with existing codebase).
- Prefer enums or string unions for discrete values (roles, statuses, etc.).

### Style & Patterns

- Use functional components with hooks; no class components.
- Use React 18 idioms (e.g., `createRoot`).
- Use `React.FC` **only if** the codebase is already using it; otherwise, define props explicitly.
- Avoid unnecessary `useEffect`—prefer derived values, memoization, and TanStack Query where appropriate.
- Use `useMemo` / `useCallback` only when there is a measurable benefit or to fix real issues, not preemptively.

---

# Routing (React Router)

- All routing uses React Router.
- Use layout routes for dashboard shells, authentication, etc.
- Use lazy-loaded routes with `React.lazy` and `Suspense` when adding large sections to keep bundle size down.

### Example Pattern

```tsx
const ProductsPage = lazy(() => import("./routes/products/ProductsPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "products", element: <ProductsPage /> },
      // ...
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [{ path: "login", element: <LoginPage /> }],
  },
]);
```

### Protected Routes

- Use a dedicated component / hook to guard authenticated routes.
- Do not duplicate auth checks in every route.
- Auth guard should:
  - Read auth state (from a store/context).
  - Optionally verify via backend when needed.
  - Redirect to login on 401/unauthenticated state.

---

# Data Fetching (TanStack Query + Axios)

TanStack Query is the **single source of truth** for server state.

### Rules:

- Do not use `fetch` or ad-hoc Axios calls in components without going through TanStack Query.
- Use **queries** for GET/read operations and **mutations** for writes.
- Use descriptive, stable query keys: `["products", { laboratoryId, page }]`, etc.
- Invalidate or update queries on mutation success.

### Axios Client

- Create a single Axios instance in `lib/api.ts` (or similar).
- Configure:
  - `baseURL` (from env: `import.meta.env.VITE_API_URL` or equivalent).
  - JSON headers.
  - Auth header injection (if stored in memory/cookie).
  - Response interceptors for handling 401, logging, etc.

Example:

```ts
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Query Hooks

- Create dedicated hooks per feature:

```ts
export const useProducts = (params) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => api.get("/products", { params }).then(r => r.data),
  });
```

- Wrap repetitive patterns in shared hooks/utilities (pagination, filters, etc.).

---

# State Management (Zustand)

Zustand is for **client-side/app state**, not server data.

Use Zustand for:

- Auth/session state (if not purely cookie-based)
- UI flags (sidebars, dialogs, filters that aren’t URL-based)
- Cross-route UI preferences

### Rules:

- Do not duplicate server data from TanStack Query in Zustand.
- Keep stores small and focused.
- Use slices when state grows, e.g. `createAuthSlice`, `createUiSlice`.

Example:

```ts
type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (payload: { token: string; user: User }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: ({ token, user }) => set({ token, user }),
  clearAuth: () => set({ token: null, user: null }),
}));
```

---

# UI, Styling & Components (shadcn/ui + Tailwind + Lucide)

### Rules:

- Use Tailwind utility classes for styling; avoid raw CSS files unless necessary.
- Use shadcn/ui components as the base for UI elements.
- Re-export shadcn components from `components/ui` so imports are consistent.
- Use Lucide icons via shadcn conventions; do not import huge icon sets blindly (tree-shake).

Example:

```tsx
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add product
</Button>
```

- Keep class names focused and readable.
- Reuse shared components for tables, modals, forms, and layouts instead of reimplementing them.

---

# Notifications (Sonner)

Use Sonner for all toast notifications.

### Rules:

- Provide clear, concise messages.
- Use appropriate level (`success`, `error`, `info`).
- Do not spam toasts on every network call; prioritize important actions and errors.

Example:

```ts
import { toast } from "sonner";

toast.success("Product created successfully");
toast.error("Failed to create product");
```

---

# Authentication & Authorization (Frontend Perspective)

Authentication is **backend-managed via JWT**. The frontend is a client of that system.

### Rules:

- Prefer secure token handling:
  - If JWT is in an HttpOnly cookie, do not attempt to read it; let the backend handle auth via cookie and respond with 401 when needed.
  - If JWT is stored client-side, avoid `localStorage` when possible. Prefer memory or secure storage, and understand trade-offs.
- Do not trust decoded JWT alone for security-sensitive decisions; backend remains the source of truth.
- Use role/claims (admin/member/user) only for:
  - Conditional rendering (e.g., hide admin-only buttons).
  - UX hints.
- Still assume the backend will enforce access control.

On 401/403 responses:

- Clear local auth state.
- Redirect to login or show a dedicated “Access denied” view as appropriate.

---

# Multi-Tenancy at the UI Level

The backend enforces strict multi-tenancy via `laboratory_id`.

Frontend responsibilities:

- Reflect the current laboratory context in the UI (e.g., lab selector, name in header).
- Include the correct lab context when making API calls (query params, headers, or implicit via JWT, depending on backend contract).
- Never allow a user to “switch laboratories” in the UI in a way that contradicts what the backend allows.
- If you show lab IDs in query params or URLs, make sure navigation cannot lead to cross-lab data leaks (backend will still block, but avoid confusing UX).

---

# Testing Guidelines

Use tools that align with the current stack (likely Vitest + React Testing Library if present).

### Rules:

- Component tests:
  - Use React Testing Library.
  - Assert on behavior and rendered output, not implementation details.
- Hooks:
  - Test with `@testing-library/react` hook utilities or simple wrapper components.
- Utilities:
  - Test using standard `describe`/`it` patterns with Vitest/Jest.

Naming:

- Test files next to the code:
  - `ProductsTable.tsx` → `ProductsTable.test.tsx`
- Test names describe behavior:
  - `"renders list of products"`
  - `"shows error message when query fails"`

---

# Commit & PR Guidelines

- Use lowercase imperative subjects in commits:

  ```text
  feat: add products list table
  fix: handle expired jwt on dashboard
  chore: refactor equipment filters
  ```

- PRs should include:
  - What you changed.
  - Why you changed it.
  - Screenshots/GIFs for UI changes.
  - Steps to repro and validate behavior.
  - Any impact on routing, auth, or environment variables.

Avoid PRs that mix refactors, feature work, and fixes without clear separation.

---

# Vercel & Environment Configuration

- Do not hardcode API URLs; always use environment variables (e.g., `VITE_API_URL`).
- Respect Vercel environment conventions:
  - `.env.local` for local development (not committed).
  - Vercel dashboard for production env vars.
- Only use variables prefixed with `VITE_` in the client.

Example:

```ts
const baseUrl = import.meta.env.VITE_API_URL;
```

---

# Performance & UX Considerations

- Use code splitting for large routes or heavy feature areas.
- Avoid heavy computations on the main thread; offload when necessary.
- Use React and TanStack Query’s caching effectively instead of refetching constantly.
- Debounce expensive, repeated actions (search, filtering) where appropriate.
- Keep perceived performance high: skeletons, loading states, and optimistic updates where safe.

---

# Accessibility & UX Quality

- Use semantic HTML elements.
- Ensure interactive elements are keyboard accessible.
- Use ARIA attributes where appropriate (but do not overuse).
- Keep color contrast readable and respect theme/dark mode if present.
- Never rely solely on color to convey critical information.

---

# Final Expectations

When modifying the LabFlux frontend:

- Respect the existing architecture and patterns.
- Use React + TS + Vite + TanStack Query + Zustand as intended.
- Use shadcn/ui + Tailwind + Sonner consistently for UI and notifications.
- Maintain multi-tenancy constraints and do not leak data between labs in the UI.
- Produce complete, production-ready code with no TODOs left for others.
- Prefer minimal, targeted changes that clearly solve the problem.
- Explain your reasoning clearly and step-by-step when asked.

