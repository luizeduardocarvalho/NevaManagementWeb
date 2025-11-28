import { useParams } from 'react-router-dom'
import { useExecutionById } from '@/hooks/useRoutines'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/shared/Spinner'
import { BackArrow } from '@/components/shared/BackArrow'
import { CheckCircle, XCircle, Clock, User, Beaker, FileText } from 'lucide-react'
import { format, differenceInMinutes } from 'date-fns'
import { useTranslation } from 'react-i18next'

export function ExecutionDetailPage() {
  const { t: tCommon } = useTranslation('common')
  const { id } = useParams<{ id: string }>()
  const executionId = parseInt(id!)

  const { data: execution, isLoading, error } = useExecutionById(executionId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !execution) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <BackArrow to="/routines/history" />
        <div className="text-center py-12">
          <p className="text-destructive">{tCommon('errors.loadFailed')}</p>
        </div>
      </div>
    )
  }

  const duration = execution.completedAt
    ? differenceInMinutes(new Date(execution.completedAt), new Date(execution.startedAt))
    : null

  const getStatusBadge = () => {
    if (execution.status === 'completed') {
      return (
        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium bg-green-50 text-green-700">
          <CheckCircle className="h-4 w-4" />
          Completed
        </span>
      )
    }
    if (execution.status === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium bg-destructive/10 text-destructive">
          <XCircle className="h-4 w-4" />
          Cancelled
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium bg-orange-50 text-orange-700">
        <Clock className="h-4 w-4" />
        In Progress
      </span>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <BackArrow to="/routines/history" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{execution.routineName}</h1>
          <p className="text-muted-foreground mt-2">Execution #{execution.id}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Executed By
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{execution.executedByName}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              {format(new Date(execution.startedAt), 'MMM dd, HH:mm')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(execution.startedAt), 'yyyy')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {duration !== null ? (
              <>
                <p className="text-xl font-semibold">{duration} min</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Completed at {format(new Date(execution.completedAt!), 'HH:mm')}
                </p>
              </>
            ) : (
              <p className="text-xl font-semibold text-muted-foreground">In progress</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Steps */}
      {execution.stepCompletions && execution.stepCompletions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Steps Completion
            </CardTitle>
            <CardDescription>
              {execution.stepCompletions.filter((s) => s.completed).length} of{' '}
              {execution.stepCompletions.length} completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {execution.stepCompletions.map((step, index) => (
              <div
                key={step.stepId}
                className={`flex gap-4 p-4 rounded-lg border ${
                  step.completed ? 'bg-primary/5 border-primary/20' : 'bg-background'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      step.completed ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {index + 1}. {step.stepDescription}
                  </p>
                  {step.notes && (
                    <p className="text-sm text-muted-foreground mt-1">{step.notes}</p>
                  )}
                  {step.completedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed at {format(new Date(step.completedAt), 'HH:mm')}
                    </p>
                  )}
                </div>
              </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Materials */}
      {execution.materialDeductions && execution.materialDeductions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5" />
              Materials Used
            </CardTitle>
            <CardDescription>Deducted from inventory upon completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {execution.materialDeductions.map((material) => (
                <div
                  key={material.productId}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <span className="font-medium">{material.productName}</span>
                  <span className="text-sm font-semibold text-destructive">
                    -{material.quantityDeducted} {material.unit}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {execution.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Completion Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {/* Notes would come from execution if backend supports it */}
              No additional notes
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
