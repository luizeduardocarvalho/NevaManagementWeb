import { useParams, useNavigate } from 'react-router-dom'
import { useEquipmentById, useEditEquipment } from '@/hooks/useEquipment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/shared/Spinner'
import { EquipmentForm } from '@/components/equipment/EquipmentForm'
import type { CreateEquipmentRequest } from '@/types/equipment.types'
import { useTranslation } from 'react-i18next'

export function EditEquipmentPage() {
  const { t } = useTranslation('equipment')
  const { t: tCommon } = useTranslation('common')
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
        <p className="text-destructive">{tCommon('errors.loadFailed')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('editEquipment')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('actions.updateEquipment')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('equipmentDetails')}</CardTitle>
          <CardDescription>
            {t('actions.updateEquipment')}
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
            submitLabel={t('actions.updateEquipment')}
          />
        </CardContent>
      </Card>
    </div>
  )
}
