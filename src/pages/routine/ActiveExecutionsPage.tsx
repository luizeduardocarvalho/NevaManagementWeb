import { Link } from 'react-router-dom'
import { useExecutionHistory, useCancelExecution } from '@/hooks/useRoutines'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/shared/Spinner'
import { Clock, User, CheckCircle, Play, XCircle, AlertCircle } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

export function ActiveExecutionsPage() {
  const { t: tCommon } = useTranslation('common')

  // Fetch only in-progress executions
  const { data: executions, isLoading, error, refetch } = useExecutionHistory({ status: 'in_progress' })
  const cancelExecution = useCancelExecution()
  const [cancelConfirm, setCancelConfirm] = useState<number | null>(null)

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 30000)

    return () => clearInterval(interval)
  }, [refetch])

  const handleCancel = async (executionId: number) => {
    await cancelExecution.mutateAsync(executionId)
    setCancelConfirm(null)
  }

  const calculateProgress = (execution: any) => {
    if (!execution.stepCompletions || execution.stepCompletions.length === 0) {
      return { completed: 0, total: 0, percentage: 0 }
    }

    const completed = execution.stepCompletions.filter((s: any) => s.completed).length
    const total = execution.stepCompletions.length
    const percentage = (completed / total) * 100

    return { completed, total, percentage }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{tCommon('errors.loadFailed')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Active Executions</h1>
        <p className="text-muted-foreground mt-2">
          {executions?.length || 0} routine{executions?.length !== 1 ? 's' : ''} in progress
        </p>
      </div>

      {/* Empty State */}
      {!executions || executions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No active executions</h3>
            <p className="text-muted-foreground mb-4">
              Start a routine from the library to see it here
            </p>
            <Link to="/routines/library">
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Browse Routines
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {executions.map((execution) => {
            const progress = calculateProgress(execution)
            const timeAgo = formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })

            return (
              <Card key={execution.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-orange-600 animate-pulse" />
                        {execution.routineName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {execution.executedByName}
                        </span>
                        <span>Started {timeAgo}</span>
                        <span className="text-xs">
                          {format(new Date(execution.startedAt), 'MMM dd, HH:mm')}
                        </span>
                      </CardDescription>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-orange-50 text-orange-700">
                      <Clock className="h-3 w-3" />
                      In Progress
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Progress</span>
                      <span className="text-muted-foreground">
                        {progress.completed} / {progress.total} steps ({progress.percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Step Summary */}
                  {execution.stepCompletions && execution.stepCompletions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Steps</h4>
                      <div className="space-y-1">
                        {execution.stepCompletions.slice(0, 3).map((step: any, index: number) => (
                          <div
                            key={step.stepId}
                            className="flex items-center gap-2 text-sm"
                          >
                            {step.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-muted flex-shrink-0" />
                            )}
                            <span
                              className={step.completed ? 'text-muted-foreground line-through' : ''}
                            >
                              {index + 1}. {step.stepDescription}
                            </span>
                          </div>
                        ))}
                        {execution.stepCompletions.length > 3 && (
                          <p className="text-xs text-muted-foreground pl-6">
                            +{execution.stepCompletions.length - 3} more steps
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link to={`/routines/executions/${execution.id}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Continue
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCancelConfirm(execution.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancelConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Cancel Execution?
              </CardTitle>
              <CardDescription>
                This will stop the routine and release all reserved materials and equipment. This
                action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCancelConfirm(null)}
                  disabled={cancelExecution.isPending}
                >
                  Keep Running
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleCancel(cancelConfirm)}
                  disabled={cancelExecution.isPending}
                >
                  {cancelExecution.isPending ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Execution
                    </>
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
