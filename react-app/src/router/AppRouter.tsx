import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { RootLayout } from '@/components/shared/RootLayout'
import { HomePage } from '@/pages/HomePage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignUpPage } from '@/pages/SignUpPage'
import { CreateLaboratoryPage } from '@/pages/CreateLaboratoryPage'
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
import { SampleListPage } from '@/pages/sample/SampleListPage'
import { AddSamplePage } from '@/pages/sample/AddSamplePage'
import { SampleDetailPage } from '@/pages/sample/SampleDetailPage'
import { ReplicaDetailPage } from '@/pages/replica/ReplicaDetailPage'
import { AddReplicaPage } from '@/pages/replica/AddReplicaPage'
import { EditReplicaPage } from '@/pages/replica/EditReplicaPage'
import { NextTransfersPage } from '@/pages/replica/NextTransfersPage'
import { ResearcherListPage } from '@/pages/researcher/ResearcherListPage'
import { AddResearcherPage } from '@/pages/researcher/AddResearcherPage'
import { ResearcherDetailPage } from '@/pages/researcher/ResearcherDetailPage'
import { EditResearcherPage } from '@/pages/researcher/EditResearcherPage'
import { RoutineListPage } from '@/pages/routine/RoutineListPage'
import { AddRoutinePage } from '@/pages/routine/AddRoutinePage'
import { RoutineDetailPage } from '@/pages/routine/RoutineDetailPage'
import { EditRoutinePage } from '@/pages/routine/EditRoutinePage'
import { ExecuteRoutinePage } from '@/pages/routine/ExecuteRoutinePage'
import { ExecutionHistoryPage } from '@/pages/routine/ExecutionHistoryPage'
import { InviteTeamMemberPage } from '@/pages/team/InviteTeamMemberPage'
import { PendingInvitationsPage } from '@/pages/team/PendingInvitationsPage'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/create-laboratory',
    element: (
      <ProtectedRoute requireLaboratory={false}>
        <CreateLaboratoryPage />
      </ProtectedRoute>
    ),
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
        path: 'settings',
        element: <SettingsPage />,
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
      {
        path: 'samples',
        children: [
          { index: true, element: <SampleListPage /> },
          { path: 'add', element: <AddSamplePage /> },
          { path: ':id', element: <SampleDetailPage /> },
        ],
      },
      {
        path: 'replicas',
        children: [
          { path: 'add', element: <AddReplicaPage /> },
          { path: ':id', element: <ReplicaDetailPage /> },
          { path: ':id/edit', element: <EditReplicaPage /> },
          { path: 'transfers', element: <NextTransfersPage /> },
        ],
      },
      {
        path: 'researchers',
        element: (
          <ProtectedRoute requiredRole="coordinator">
            <ResearcherListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'researchers/add',
        element: (
          <ProtectedRoute requiredRole="coordinator">
            <AddResearcherPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'researchers/:id',
        element: <ResearcherDetailPage />,
      },
      {
        path: 'researchers/:id/edit',
        element: (
          <ProtectedRoute requiredRole="coordinator">
            <EditResearcherPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'routines',
        children: [
          { index: true, element: <RoutineListPage /> },
          { path: 'add', element: <AddRoutinePage /> },
          { path: 'history', element: <ExecutionHistoryPage /> },
          { path: ':id', element: <RoutineDetailPage /> },
          { path: ':id/edit', element: <EditRoutinePage /> },
          { path: ':id/execute', element: <ExecuteRoutinePage /> },
        ],
      },
      {
        path: 'team',
        children: [
          {
            path: 'invite',
            element: (
              <ProtectedRoute requiredRole="coordinator">
                <InviteTeamMemberPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'invitations',
            element: (
              <ProtectedRoute requiredRole="coordinator">
                <PendingInvitationsPage />
              </ProtectedRoute>
            ),
          },
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
