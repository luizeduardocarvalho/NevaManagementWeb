import { useParams, useNavigate } from 'react-router-dom'
import { useRoutineById, useCheckAvailability, useStartExecution, useUpdateStepCompletion, useCompleteExecution, useCancelExecution } from '@/hooks/useRoutines'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/shared/Spinner'
import { BackArrow } from '@/components/shared/BackArrow'
import { AlertCircle, CheckCircle, XCircle, Beaker, Wrench, Play, CheckCheck, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { RoutineExecution } from '@/types/routine.types'

export function ExecuteRoutinePage() {
  const { t } = useTranslation('routines')
  const { t: tCommon } = useTranslation('common')
  const { id } = useParams<{ id: string }>()
  const routineId = parseInt(id!)
  const navigate = useNavigate()

  const { data: routine, isLoading: routineLoading } = useRoutineById(routineId)
  const { data: availability, isLoading: availabilityLoading } = useCheckAvailability(routineId)
  const startExecution = useStartExecution()
  const updateStepCompletion = useUpdateStepCompletion()
  const completeExecution = useCompleteExecution()
  const cancelExecution = useCancelExecution()

  const [execution, setExecution] = useState<RoutineExecution | null>(null)
  const [stepCompletions, setStepCompletions] = useState<Record<number, boolean>>({})
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // Initialize step completions when execution starts
  useEffect(() => {
    if (execution) {
      const initialCompletions: Record<number, boolean> = {}
      execution.stepCompletions.forEach((sc) => {
        initialCompletions[sc.stepId] = sc.completed
      })
      setStepCompletions(initialCompletions)
    }
  }, [execution])

  const handleStartExecution = async () => {
    const result = await startExecution.mutateAsync(routineId)
    setExecution(result)
  }

  const handleStepToggle = async (stepId: number, completed: boolean) => {
    if (!execution) return

    setStepCompletions((prev) => ({ ...prev, [stepId]: completed }))
    await updateStepCompletion.mutateAsync({
      executionId: execution.id,
      stepId,
      completed,
    })
  }

  const handleComplete = async () => {
    if (!execution) return

    await completeExecution.mutateAsync(execution.id)
    navigate('/routines')
  }

  const handleCancel = async () => {
    if (!execution) return

    await cancelExecution.mutateAsync(execution.id)
    navigate('/routines')
  }

  const allStepsComplete =
    execution?.stepCompletions.every((sc) => stepCompletions[sc.stepId]) || false

  if (routineLoading || availabilityLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!routine) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{tCommon('errors.loadFailed')}</p>
      </div>
    )
  }

  // If not started, show availability check
  if (!execution) {
    const canStart = availability?.materialsAvailable && availability?.equipmentAvailable

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <BackArrow to={`/routines/${routineId}`} />

        <div>
          <h1 className="text-3xl font-bold">{routine.name}</h1>
          <p className="text-muted-foreground mt-2">{t('execution.availabilityCheck')}</p>
        </div>

        {/* Material Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5" />
              {t('fields.materials')}
            </CardTitle>
            <CardDescription>
              {availability?.materialsAvailable ? (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {t('execution.materialsAvailable')}
                </span>
              ) : (
                <span className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-4 w-4" />
                  {t('execution.materialIssues')}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {routine.materials.map((material) => {
                const issue = availability?.materialIssues.find((i) => i.productId === material.productId)

                return (
                  <div
                    key={material.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      issue ? 'border-destructive bg-destructive/5' : 'border-border'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{material.productName}</p>
                      {issue && (
                        <p className="text-sm text-destructive">
                          {t('execution.insufficientStock')}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm">
                      <p>
                        <span className="font-semibold">{t('execution.required')}:</span>{' '}
                        {material.quantity} {material.unit}
                      </p>
                      {issue && (
                        <p className="text-destructive">
                          <span className="font-semibold">{t('execution.available')}:</span>{' '}
                          {issue.available} {issue.unit}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Equipment Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              {t('fields.equipment')}
            </CardTitle>
            <CardDescription>
              {availability?.equipmentAvailable ? (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {t('execution.equipmentAvailable')}
                </span>
              ) : (
                <span className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                  {t('execution.equipmentConflicts')}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {routine.equipment.map((equipment) => {
                const conflict = availability?.equipmentConflicts.find(
                  (c) => c.equipmentId === equipment.equipmentId
                )

                return (
                  <div
                    key={equipment.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      conflict ? 'border-orange-500 bg-orange-50' : 'border-border'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{equipment.equipmentName}</p>
                      {conflict && (
                        <p className="text-sm text-orange-600">
                          {t('execution.conflict')}: {conflict.conflictTime}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm">
                      <p>
                        <span className="font-semibold">{t('fields.duration')}:</span>{' '}
                        {equipment.estimatedDuration} min
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate(`/routines/${routineId}`)}>
            {tCommon('actions.cancel')}
          </Button>
          <Button
            onClick={handleStartExecution}
            disabled={!canStart || startExecution.isPending}
            className="flex-1"
          >
            {startExecution.isPending ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {tCommon('loading')}
              </>
            ) : canStart ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                {t('execution.startExecution')}
              </>
            ) : (
              t('execution.cannotStart')
            )}
          </Button>
        </div>
      </div>
    )
  }

  // Execution in progress
  const completedSteps = Object.values(stepCompletions).filter(Boolean).length
  const totalSteps = execution.stepCompletions.length
  const progressPercent = (completedSteps / totalSteps) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <BackArrow to={`/routines/${routineId}`} />

      <div>
        <h1 className="text-3xl font-bold">{routine.name}</h1>
        <p className="text-muted-foreground mt-2">{t('execution.inProgress')}</p>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('execution.progress')}</CardTitle>
          <CardDescription>
            {completedSteps} / {totalSteps} {t('fields.steps').toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {allStepsComplete ? t('execution.allStepsComplete') : t('execution.stepCompletion')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Steps Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>{t('fields.steps')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {execution.stepCompletions
              .sort((a, b) => {
                const stepA = routine.steps.find((s) => s.id === a.stepId)
                const stepB = routine.steps.find((s) => s.id === b.stepId)
                return (stepA?.order || 0) - (stepB?.order || 0)
              })
              .map((stepCompletion, index) => {
                const step = routine.steps.find((s) => s.id === stepCompletion.stepId)
                if (!step) return null

                return (
                  <div
                    key={stepCompletion.stepId}
                    className={`flex gap-4 p-4 rounded-lg border transition-colors ${
                      stepCompletions[stepCompletion.stepId]
                        ? 'bg-primary/5 border-primary/20'
                        : 'bg-background'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        id={`step-${stepCompletion.stepId}`}
                        checked={stepCompletions[stepCompletion.stepId] || false}
                        onCheckedChange={(checked) =>
                          handleStepToggle(stepCompletion.stepId, !!checked)
                        }
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`step-${stepCompletion.stepId}`}
                          className={`font-medium cursor-pointer ${
                            stepCompletions[stepCompletion.stepId]
                              ? 'line-through text-muted-foreground'
                              : ''
                          }`}
                        >
                          {index + 1}. {step.description}
                        </label>
                        {step.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{step.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setShowCancelConfirm(true)}>
          <X className="h-4 w-4 mr-2" />
          {t('execution.cancelRoutine')}
        </Button>
        <Button
          className="flex-1"
          onClick={() => setShowCompleteConfirm(true)}
          disabled={!allStepsComplete}
        >
          <CheckCheck className="h-4 w-4 mr-2" />
          {allStepsComplete
            ? t('execution.completeRoutine')
            : t('execution.completeAllSteps')}
        </Button>
      </div>

      {/* Complete Confirmation Dialog */}
      {showCompleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>{t('execution.completeConfirmTitle')}</CardTitle>
              <CardDescription>{t('execution.completeConfirmMessage')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                {routine.materials.map((material) => (
                  <div key={material.id} className="flex justify-between text-sm">
                    <span>{material.productName}</span>
                    <span className="font-semibold">
                      -{material.quantity} {material.unit}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCompleteConfirm(false)}
                  disabled={completeExecution.isPending}
                >
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleComplete}
                  disabled={completeExecution.isPending}
                >
                  {completeExecution.isPending ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      {tCommon('loading')}
                    </>
                  ) : (
                    t('execution.completeConfirmButton')
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>{t('execution.cancelConfirmTitle')}</CardTitle>
              <CardDescription>{t('execution.cancelConfirmMessage')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={cancelExecution.isPending}
                >
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1"
                  onClick={handleCancel}
                  disabled={cancelExecution.isPending}
                >
                  {cancelExecution.isPending ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      {tCommon('loading')}
                    </>
                  ) : (
                    t('execution.cancelRoutine')
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
