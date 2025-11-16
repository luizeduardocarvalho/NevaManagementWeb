import { useNavigate } from 'react-router-dom'
import { useCreateEquipment } from '@/hooks/useEquipment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EquipmentForm } from '@/components/equipment/EquipmentForm'
import type { CreateEquipmentRequest } from '@/types/equipment.types'

export function AddEquipmentPage() {
  const navigate = useNavigate()
  const createEquipment = useCreateEquipment()

  const handleSubmit = async (data: CreateEquipmentRequest) => {
    await createEquipment.mutateAsync(data)
    navigate('/equipment')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Equipment</h1>
        <p className="text-muted-foreground mt-2">
          Register new laboratory equipment
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Details</CardTitle>
          <CardDescription>
            Fill in the information below to add new equipment to your laboratory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentForm
            onSubmit={handleSubmit}
            isSubmitting={createEquipment.isPending}
            submitLabel="Add Equipment"
          />
        </CardContent>
      </Card>
    </div>
  )
}
