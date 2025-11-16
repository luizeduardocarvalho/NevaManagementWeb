import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { RootLayout } from '@/components/shared/RootLayout'
import { HomePage } from '@/pages/HomePage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { ProductListPage } from '@/pages/product/ProductListPage'
import { AddProductPage } from '@/pages/product/AddProductPage'
import { ProductDetailPage } from '@/pages/product/ProductDetailPage'
import { EditProductPage } from '@/pages/product/EditProductPage'
import { EquipmentListPage } from '@/pages/equipment/EquipmentListPage'
import { AddEquipmentPage } from '@/pages/equipment/AddEquipmentPage'
import { EquipmentDetailPage } from '@/pages/equipment/EquipmentDetailPage'
import { EditEquipmentPage } from '@/pages/equipment/EditEquipmentPage'
import { UseEquipmentPage } from '@/pages/equipment/UseEquipmentPage'
import { UsageHistoryPage } from '@/pages/equipment/UsageHistoryPage'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'products',
        children: [
          { index: true, element: <ProductListPage /> },
          { path: 'add', element: <AddProductPage /> },
          { path: ':id', element: <ProductDetailPage /> },
          { path: ':id/edit', element: <EditProductPage /> },
        ],
      },
      {
        path: 'equipment',
        children: [
          { index: true, element: <EquipmentListPage /> },
          { path: 'add', element: <AddEquipmentPage /> },
          { path: ':id', element: <EquipmentDetailPage /> },
          { path: ':id/edit', element: <EditEquipmentPage /> },
          { path: ':id/use', element: <UseEquipmentPage /> },
          { path: ':id/history', element: <UsageHistoryPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
