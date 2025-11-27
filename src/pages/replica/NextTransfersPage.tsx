import { Link } from 'react-router-dom'
import { useReplicasByTransferDate } from '@/hooks/useReplicas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/shared/Spinner'
import { Calendar, Beaker, MapPin, User, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export function NextTransfersPage() {
  const { t } = useTranslation('samples')
  const { t: tCommon } = useTranslation('common')
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useReplicasByTransferDate()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const replicas = useMemo(() => {
    return data?.pages.flatMap((page) => page.replicas) ?? []
  }, [data])

  // Infinite scroll intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

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
      <div>
        <h1 className="text-3xl font-bold">{t('transfers.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('transfers.subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('transfers.upcoming')}
          </CardTitle>
          <CardDescription>{t('transfers.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {replicas.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">{t('transfers.noTransfers')}</p>
          ) : (
            <div className="space-y-4">
              {replicas.map((replica) => {
                const isOverdue = replica.daysUntilTransfer < 0
                const isUrgent = replica.daysUntilTransfer <= 7 && replica.daysUntilTransfer >= 0

                return (
                  <Link
                    key={replica.id}
                    to={`/replicas/${replica.id}`}
                    className="block"
                  >
                    <div
                      className={`flex items-start gap-3 p-4 rounded-lg border md:hover:border-primary md:transition-colors active:bg-muted/50 ${
                        isOverdue
                          ? 'border-destructive/20 bg-destructive/5'
                          : isUrgent
                          ? 'border-orange-500/20 bg-orange-500/5'
                          : ''
                      }`}
                    >
                      <div
                        className={`rounded-full p-2 shrink-0 self-start ${
                          isOverdue
                            ? 'bg-destructive/10'
                            : isUrgent
                            ? 'bg-orange-500/10'
                            : 'bg-primary/10'
                        }`}
                      >
                        {isOverdue || isUrgent ? (
                          <AlertCircle
                            className={`h-4 w-4 ${isOverdue ? 'text-destructive' : 'text-orange-500'}`}
                          />
                        ) : (
                          <Beaker className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{replica.name}</h4>
                          <span
                            className={`text-sm font-semibold ${
                              isOverdue
                                ? 'text-destructive'
                                : isUrgent
                                ? 'text-orange-600'
                                : ''
                            }`}
                          >
                            {isOverdue
                              ? t('transfers.overdue', { days: Math.abs(replica.daysUntilTransfer) })
                              : isUrgent
                              ? t('transfers.daysLeft', { days: replica.daysUntilTransfer })
                              : format(new Date(replica.nextTransferDate), 'MMM dd')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{replica.sampleName}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {replica.locationName}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {replica.researcherName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}

              {/* Infinite scroll trigger */}
              {hasNextPage && (
                <div ref={loadMoreRef} className="py-4 text-center">
                  {isFetchingNextPage ? (
                    <Spinner size="md" />
                  ) : (
                    <p className="text-muted-foreground text-sm">{tCommon('loadMore')}</p>
                  )}
                </div>
              )}

              {!hasNextPage && replicas.length > 0 && (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground text-sm">
                    {tCommon('allLoaded', { count: replicas.length })}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
