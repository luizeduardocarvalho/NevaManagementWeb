import { useRoutineStatistics } from '@/hooks/useRoutines'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/shared/Spinner'
import { BackArrow } from '@/components/shared/BackArrow'
import { BarChart3, Clock, CheckCircle, TrendingUp, Activity } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function RoutineStatisticsPage() {
  const { t: tCommon } = useTranslation('common')
  const { data: stats, isLoading, error } = useRoutineStatistics()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <BackArrow to="/routines" />
        <div className="text-center py-12">
          <p className="text-destructive">{tCommon('errors.loadFailed')}</p>
        </div>
      </div>
    )
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <BackArrow to="/routines" />

      <div>
        <h1 className="text-3xl font-bold">Routine Statistics</h1>
        <p className="text-muted-foreground mt-2">Performance metrics and analytics</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routines</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoutines}</div>
            <p className="text-xs text-muted-foreground mt-1">Active routines in lab</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExecutions}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed vs total executions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(stats.avgCompletionTime)}</div>
            <p className="text-xs text-muted-foreground mt-1">Per execution</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Routines by Schedule Type */}
        <Card>
          <CardHeader>
            <CardTitle>Routines by Type</CardTitle>
            <CardDescription>Distribution by schedule type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.routinesByScheduleType.map((item: { scheduleType: string; count: number }) => {
                const total = stats.totalRoutines
                const percentage = total > 0 ? (item.count / total) * 100 : 0

                return (
                  <div key={item.scheduleType} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium capitalize">{item.scheduleType}</span>
                      <span className="text-muted-foreground">
                        {item.count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Executions by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Executions by Status</CardTitle>
            <CardDescription>Completed, in progress, and cancelled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.executionsByStatus.map((item: { status: string; count: number }) => {
                const total = stats.totalExecutions
                const percentage = total > 0 ? (item.count / total) * 100 : 0
                const colorClass =
                  item.status === 'completed'
                    ? 'bg-green-600'
                    : item.status === 'in_progress'
                    ? 'bg-orange-500'
                    : 'bg-destructive'

                return (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium capitalize">
                        {item.status.replace('_', ' ')}
                      </span>
                      <span className="text-muted-foreground">
                        {item.count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`${colorClass} h-2 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Routines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Most Executed Routines
          </CardTitle>
          <CardDescription>Top 5 most frequently executed routines</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.topRoutines.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No executions yet
            </p>
          ) : (
            <div className="space-y-4">
              {stats.topRoutines.map((routine: { routineId: number; routineName: string; count: number }, index: number) => {
                const maxCount = stats.topRoutines[0]?.count || 1
                const percentage = (routine.count / maxCount) * 100

                return (
                  <div key={routine.routineId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium">{routine.routineName}</span>
                      </div>
                      <span className="text-muted-foreground">{routine.count} executions</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total executions</span>
            <span className="text-3xl font-bold">{stats.recentActivity.last7Days}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
