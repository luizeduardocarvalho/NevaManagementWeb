import { useParams, useNavigate } from 'react-router-dom'
import { useEquipmentById, useEditEquipment } from '@/hooks/useEquipment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/shared/Spinner'
import { EquipmentForm } from '@/components/equipment/EquipmentForm'
import type { CreateEquipmentRequest } from '@/types/equipment.types'

export function EditEquipmentPage() {
  const { id } = useParams<{ id: string }>()
  const equipmentId = parseInt(id!)
  const navigate = useNavigate()

  const { data: equipment, isLoading, error } = useEquipmentById(equipmentId)
  const editEquipment = useEditEquipment()

  const handleSubmit = async (data: CreateEquipmentRequest) => {
    await editEquipment.mutateAsync({ ...data, id: equipmentId })
    navigate(`/equipment/${equipmentId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !equipment) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load equipment</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Equipment</h1>
        <p className="text-muted-foreground mt-2">
          Update equipment information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Details</CardTitle>
          <CardDescription>
            Modify the equipment information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentForm
            initialData={{
              name: equipment.name,
              description: equipment.description,
              propertyNumber: equipment.propertyNumber,
              location_id: equipment.location_id,
            }}
            onSubmit={handleSubmit}
            isSubmitting={editEquipment.isPending}
            submitLabel="Update Equipment"
          />
        </CardContent>
      </Card>
    </div>
  )
}
