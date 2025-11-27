import { useParams, Link } from 'react-router-dom'
import { useEquipmentById, useEquipmentUsageHistory } from '@/hooks/useEquipment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/shared/Spinner'
import { History, User, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export function UsageHistoryPage() {
  const { t } = useTranslation('equipment')
  const { t: tCommon } = useTranslation('common')
  const { id } = useParams<{ id: string }>()
  const equipmentId = parseInt(id!)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { data: equipment, isLoading: equipmentLoading } = useEquipmentById(equipmentId)
  const {
    data,
    isLoading: historyLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEquipmentUsageHistory(equipmentId)

  const usages = useMemo(() => {
    return data?.pages.flatMap((page) => page.usages) ?? []
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

  if (equipmentLoading || historyLoading) {
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/equipment/${equipmentId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{t('history.title')}</h1>
          <p className="text-muted-foreground mt-2">{equipment.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {t('history.pastRecords')}
          </CardTitle>
          <CardDescription>
            {t('history.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usages.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              {t('history.noHistory')}
            </p>
          ) : (
            <div className="space-y-4">
              {usages.map((usage) => (
                <div
                  key={usage.id}
                  className="flex items-start gap-3 p-4 rounded-lg border"
                >
                  <div className="rounded-full bg-primary/10 p-2 shrink-0 self-start">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{usage.researcher.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(usage.startDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(usage.startDate), 'HH:mm')} -{' '}
                      {format(new Date(usage.endDate), 'HH:mm')}
                    </div>
                    {usage.description && (
                      <p className="text-sm mt-2">{usage.description}</p>
                    )}
                  </div>
                </div>
              ))}

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

              {!hasNextPage && usages.length > 0 && (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground text-sm">
                    {tCommon('allLoaded', { count: usages.length })}
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
