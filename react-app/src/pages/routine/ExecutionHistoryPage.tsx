import { Link } from 'react-router-dom'
import { useExecutionHistory } from '@/hooks/useRoutines'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/shared/Spinner'
import { BackArrow } from '@/components/shared/BackArrow'
import { CheckCircle, XCircle, Clock, User, Filter, X as XIcon, ChevronRight } from 'lucide-react'
import { format, differenceInMinutes } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export function ExecutionHistoryPage() {
  const { t } = useTranslation('routines')
  const { t: tCommon } = useTranslation('common')

  const [status, setStatus] = useState<string | undefined>('completed')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)

  const filters = {
    status,
    startDate: startDate ? `${startDate}T00:00:00Z` : undefined,
    endDate: endDate ? `${endDate}T23:59:59Z` : undefined,
  }

  const { data: executions, isLoading, error } = useExecutionHistory(filters)

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

  const clearFilters = () => {
    setStatus(undefined)
    setStartDate('')
    setEndDate('')
  }

  const hasActiveFilters = status || startDate || endDate

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <BackArrow to="/routines" />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Completed Executions</h1>
          <p className="text-muted-foreground mt-2">
            {executions?.length || 0} completed {executions?.length === 1 ? 'execution' : 'executions'}
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Filter Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <Select value={status || 'completed'} onValueChange={(v) => setStatus(v === 'all' ? undefined : v)}>
                  <SelectTrigger id="status-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || undefined}
                />
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="mt-4 gap-2"
              >
                <XIcon className="h-4 w-4" />
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!executions || executions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t('noExecutions')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {executions.map((execution) => {
            const duration = execution.completedAt
              ? differenceInMinutes(
                  new Date(execution.completedAt),
                  new Date(execution.startedAt)
                )
              : null

            return (
              <Link key={execution.id} to={`/routines/executions/${execution.id}`}>
                <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {execution.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : execution.status === 'cancelled' ? (
                          <XCircle className="h-5 w-5 text-destructive" />
                        ) : (
                          <Clock className="h-5 w-5 text-orange-600" />
                        )}
                        {execution.routineName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {execution.executedByName}
                        </span>
                        <span>{format(new Date(execution.startedAt), 'MMM dd, yyyy HH:mm')}</span>
                        {duration !== null && <span>{duration} min</span>}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {execution.status === 'completed' && (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-green-50 text-green-700">
                          {t('execution.completed')}
                        </span>
                      )}
                      {execution.status === 'cancelled' && (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-destructive/10 text-destructive">
                          {t('execution.cancelled')}
                        </span>
                      )}
                      {execution.status === 'in_progress' && (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-orange-50 text-orange-700">
                          {t('execution.inProgress')}
                        </span>
                      )}
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Steps Completion */}
                    {execution.stepCompletions && execution.stepCompletions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">{t('execution.stepCompletion')}</h4>
                        <div className="space-y-2">
                          {execution.stepCompletions.map((step, index) => (
                            <div
                              key={step.stepId}
                              className="flex items-start gap-3 text-sm"
                            >
                              {step.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border-2 border-muted mt-0.5" />
                              )}
                              <span
                                className={step.completed ? 'text-muted-foreground' : ''}
                              >
                                {index + 1}. {step.stepDescription}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Materials Deducted */}
                    {execution.materialDeductions && execution.materialDeductions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">
                          {t('execution.materialsDeducted')}
                        </h4>
                        <div className="space-y-1">
                          {execution.materialDeductions.map((material) => (
                            <div
                              key={material.productId}
                              className="flex justify-between text-sm text-muted-foreground"
                            >
                              <span>{material.productName}</span>
                              <span className="font-semibold">
                                -{material.quantityDeducted} {material.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
