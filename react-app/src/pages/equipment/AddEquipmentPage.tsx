import { useNavigate } from 'react-router-dom'
import { useCreateEquipment } from '@/hooks/useEquipment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EquipmentForm } from '@/components/equipment/EquipmentForm'
import type { CreateEquipmentRequest } from '@/types/equipment.types'
import { useTranslation } from 'react-i18next'

export function AddEquipmentPage() {
  const { t } = useTranslation('equipment')
  const navigate = useNavigate()
  const createEquipment = useCreateEquipment()

  const handleSubmit = async (data: CreateEquipmentRequest) => {
    await createEquipment.mutateAsync(data)
    navigate('/equipment')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('addEquipment')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('subtitle')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('equipmentDetails')}</CardTitle>
          <CardDescription>
            {t('actions.saveEquipment')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentForm
            onSubmit={handleSubmit}
            isSubmitting={createEquipment.isPending}
            submitLabel={t('addEquipment')}
          />
        </CardContent>
      </Card>
    </div>
  )
}
