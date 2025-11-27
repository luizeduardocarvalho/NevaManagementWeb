import { Link } from 'react-router-dom'
import { useUpcomingRoutines } from '@/hooks/useRoutines'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/shared/Spinner'
import { Calendar, Clock, AlertCircle, CheckCircle, Users } from 'lucide-react'
import { format, differenceInDays, startOfDay, isValid } from 'date-fns'
import { useTranslation } from 'react-i18next'

export function UpcomingRoutinesWidget() {
  const { t } = useTranslation('routines')
  const { t: tCommon } = useTranslation('common')
  const { data: upcomingRoutines, isLoading, error } = useUpcomingRoutines(7)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('upcomingRoutines')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner size="md" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('upcomingRoutines')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{tCommon('errors.loadFailed')}</p>
        </CardContent>
      </Card>
    )
  }

  const calculateDaysUntilDue = (dueDate: string): number => {
    const today = startOfDay(new Date())
    const due = new Date(dueDate)
    if (!isValid(due)) {
      return 999 // Return a large number for invalid dates
    }
    return differenceInDays(startOfDay(due), today)
  }

  const getUrgencyColor = (daysUntilDue: number) => {
    if (daysUntilDue === 0) return 'text-destructive'
    if (daysUntilDue === 1) return 'text-orange-600'
    if (daysUntilDue <= 2) return 'text-yellow-600'
    return 'text-muted-foreground'
  }

  const getUrgencyIcon = (daysUntilDue: number) => {
    if (daysUntilDue === 0) return <AlertCircle className="h-4 w-4 text-destructive" />
    if (daysUntilDue <= 2) return <Clock className="h-4 w-4 text-orange-600" />
    return <CheckCircle className="h-4 w-4 text-green-600" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t('upcomingRoutines')}
        </CardTitle>
        <CardDescription>{t('next7Days')}</CardDescription>
      </CardHeader>
      <CardContent>
        {!upcomingRoutines || upcomingRoutines.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">{t('noUpcomingRoutines')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingRoutines.slice(0, 5).map((scheduled, index) => {
              const daysUntilDue = calculateDaysUntilDue(scheduled.dueDate)
              const dueDate = new Date(scheduled.dueDate)
              const isValidDate = isValid(dueDate)

              return (
                <Link
                  key={`${scheduled.id}-${index}`}
                  to={`/routines/${scheduled.routineId}/execute`}
                  className="block p-3 rounded-lg border hover:border-primary hover:bg-accent/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getUrgencyIcon(daysUntilDue)}
                        <h4 className="font-medium text-sm truncate">{scheduled.routineName}</h4>
                      </div>
                      {scheduled.routineDescription && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {scheduled.routineDescription}
                        </p>
                      )}
                      {scheduled.assignedToNames && scheduled.assignedToNames.length > 0 ? (
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{scheduled.assignedToNames.join(', ')}</span>
                        </div>
                      ) : scheduled.assignedTo && scheduled.assignedTo.length > 0 ? (
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{scheduled.assignedTo.length} {scheduled.assignedTo.length === 1 ? 'person' : 'people'} assigned</span>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-semibold ${getUrgencyColor(daysUntilDue)}`}>
                        {daysUntilDue === 0
                          ? t('dueToday')
                          : daysUntilDue === 1
                          ? t('dueTomorrow')
                          : daysUntilDue < 999
                          ? t('dueInDays', { count: daysUntilDue })
                          : 'Invalid date'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isValidDate ? format(dueDate, 'MMM dd, HH:mm') : 'Invalid date'}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}

            {upcomingRoutines.length > 5 && (
              <Link to="/routines">
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  {t('viewAllRoutines')} ({upcomingRoutines.length})
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
