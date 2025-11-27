import { useParams, useNavigate } from 'react-router-dom'
import { useEquipmentById, useUseEquipment, useCheckEquipmentOverlap } from '@/hooks/useEquipment'
import { useResearchers } from '@/hooks/useResearchers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/shared/Spinner'
import { Calendar, AlertTriangle, Clock } from 'lucide-react'
import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import type { UseEquipmentRequest } from '@/types/equipment.types'
import { useTranslation } from 'react-i18next'

export function UseEquipmentPage() {
  const { t } = useTranslation('equipment')
  const { t: tCommon } = useTranslation('common')
  const { id } = useParams<{ id: string }>()
  const equipmentId = parseInt(id!)
  const navigate = useNavigate()

  const { data: equipment, isLoading, error } = useEquipmentById(equipmentId)
  const { data: researchers, isLoading: researchersLoading } = useResearchers()
  const useEquipmentMutation = useUseEquipment()

  const [formData, setFormData] = useState({
    researcherId: 0,
    description: '',
    startDate: '',
    endDate: '',
  })

  // Convert dates to ISO for overlap check
  const overlapStartDate = useMemo(() => {
    return formData.startDate ? new Date(formData.startDate).toISOString() : ''
  }, [formData.startDate])

  const overlapEndDate = useMemo(() => {
    return formData.endDate ? new Date(formData.endDate).toISOString() : ''
  }, [formData.endDate])

  // Check for overlapping bookings
  const { data: overlapCheck } = useCheckEquipmentOverlap(
    equipmentId,
    overlapStartDate,
    overlapEndDate
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data: UseEquipmentRequest = {
      equipmentId,
      researcherId: formData.researcherId,
      description: formData.description || undefined,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    }

    await useEquipmentMutation.mutateAsync(data)
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
        <h1 className="text-3xl font-bold">{t('usage.scheduleTitle')}</h1>
        <p className="text-muted-foreground mt-2">{equipment.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('usage.usageDetails')}
          </CardTitle>
          <CardDescription>
            {t('usage.usageDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="researcher">
                {t('usage.researcher')} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.researcherId ? String(formData.researcherId) : ''}
                onValueChange={(value) => setFormData({ ...formData, researcherId: parseInt(value) })}
                disabled={researchersLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={researchersLoading ? tCommon('loading') : t('usage.selectResearcher')} />
                </SelectTrigger>
                <SelectContent>
                  {researchers && researchers.length > 0 ? (
                    researchers.map((researcher) => {
                      const displayName = researcher.name || `Researcher #${researcher.id}`
                      return (
                        <SelectItem key={researcher.id} value={String(researcher.id)}>
                          {displayName}
                        </SelectItem>
                      )
                    })
                  ) : (
                    <SelectItem value="no-researchers" disabled>
                      No researchers available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('usage.descriptionOptional')}</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={useEquipmentMutation.isPending}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={t('usage.descriptionPlaceholder')}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  {t('usage.startDateTime')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  disabled={useEquipmentMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  {t('usage.endDateTime')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  disabled={useEquipmentMutation.isPending}
                />
              </div>
            </div>

            {/* Overlap Warning */}
            {overlapCheck?.hasOverlap && (
              <div className="rounded-lg border border-orange-500 bg-orange-50 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-900">
                      {t('usage.conflictDetected')}
                    </h4>
                    <p className="text-sm text-orange-800 mt-1">
                      {t('usage.conflictDescription')}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 ml-8">
                  {overlapCheck.conflictingUsages.map((usage) => (
                    <div
                      key={usage.id}
                      className="flex items-center justify-between p-3 rounded-md bg-white border border-orange-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                          {usage.researcher.name}
                        </p>
                        {usage.description && (
                          <p className="text-xs text-gray-600 mt-0.5">{usage.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(new Date(usage.startDate), 'MMM dd, HH:mm')} -{' '}
                          {format(new Date(usage.endDate), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-orange-700 ml-8">
                  {t('usage.conflictNote')}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/equipment/${equipmentId}`)}
                disabled={useEquipmentMutation.isPending}
              >
                {tCommon('actions.cancel')}
              </Button>
              <Button type="submit" className="flex-1" disabled={useEquipmentMutation.isPending}>
                {useEquipmentMutation.isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    {t('usage.scheduling')}
                  </>
                ) : (
                  t('usage.schedule')
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
