import { useParams, Link } from 'react-router-dom'
import { useRoutineById } from '@/hooks/useRoutines'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/shared/Spinner'
import { BackArrow } from '@/components/shared/BackArrow'
import { Beaker, Edit, Play, Wrench, List } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function RoutineDetailPage() {
  const { t } = useTranslation('routines')
  const { t: tCommon } = useTranslation('common')
  const { id } = useParams<{ id: string }>()
  const routineId = parseInt(id!)

  const { data: routine, isLoading, error } = useRoutineById(routineId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !routine) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{tCommon('errors.loadFailed')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <BackArrow to="/routines" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{routine.name}</h1>
          <p className="text-muted-foreground mt-2">{routine.description}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/routines/${routine.id}/execute`}>
            <Button className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              {t('executeRoutine')}
            </Button>
          </Link>
          <Link to={`/routines/${routine.id}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              {tCommon('actions.edit')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Materials Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5" />
            {t('fields.materials')}
          </CardTitle>
          <CardDescription>
            {t('stats.materialsCount', { count: routine.materials.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {routine.materials.length === 0 ? (
            <p className="text-sm text-muted-foreground">{tCommon('noData')}</p>
          ) : (
            <div className="space-y-3">
              {routine.materials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{material.productName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {material.quantity} {material.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Equipment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            {t('fields.equipment')}
          </CardTitle>
          <CardDescription>
            {t('stats.equipmentCount', { count: routine.equipment.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {routine.equipment.length === 0 ? (
            <p className="text-sm text-muted-foreground">{tCommon('noData')}</p>
          ) : (
            <div className="space-y-3">
              {routine.equipment.map((equipment) => (
                <div
                  key={equipment.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{equipment.equipmentName}</p>
                    {equipment.required && (
                      <p className="text-xs text-muted-foreground">{t('fields.required')}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{equipment.estimatedDuration} min</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Steps Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            {t('fields.steps')}
          </CardTitle>
          <CardDescription>
            {t('stats.stepsCount', { count: routine.steps.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {routine.steps.length === 0 ? (
            <p className="text-sm text-muted-foreground">{tCommon('noData')}</p>
          ) : (
            <div className="space-y-3">
              {routine.steps
                .sort((a, b) => a.order - b.order)
                .map((step, index) => (
                  <div key={step.id} className="flex gap-4 p-3 rounded-lg border">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{step.description}</p>
                      {step.notes && <p className="text-sm text-muted-foreground mt-1">{step.notes}</p>}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
