import { useParams, Link } from 'react-router-dom'
import { useReplicaById, useDuplicateReplica } from '@/hooks/useReplicas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/shared/Spinner'
import { BackArrow } from '@/components/shared/BackArrow'
import { Beaker, MapPin, User, Edit, Copy, FlaskConical, AlertCircle } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function ReplicaDetailPage() {
  const { t } = useTranslation('samples')
  const { t: tCommon } = useTranslation('common')
  const { id } = useParams<{ id: string }>()
  const replicaId = parseInt(id!)

  const { data: replica, isLoading, error } = useReplicaById(replicaId)
  const duplicateReplica = useDuplicateReplica()

  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [newReplicaName, setNewReplicaName] = useState('')

  const handleDuplicate = async () => {
    if (!newReplicaName.trim()) return
    await duplicateReplica.mutateAsync({ id: replicaId, newName: newReplicaName })
    setShowDuplicateDialog(false)
    setNewReplicaName('')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !replica) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{tCommon('errors.loadFailed')}</p>
      </div>
    )
  }

  const daysUntilTransfer = differenceInDays(new Date(replica.nextTransferDate), new Date())
  const isUrgent = daysUntilTransfer <= 7
  const isOverdue = daysUntilTransfer < 0

  return (
    <div className="space-y-6">
      <BackArrow to={`/samples/${replica.sampleId}`} />

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Beaker className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{replica.name}</h1>
              <Link
                to={`/samples/${replica.sampleName ? '#' : '../samples'}`}
                className="text-muted-foreground mt-1 hover:text-primary transition-colors"
              >
                <FlaskConical className="h-3 w-3 inline mr-1" />
                {replica.sampleName}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowDuplicateDialog(true)}
          >
            <Copy className="h-4 w-4" />
            {t('replicas.duplicate')}
          </Button>
          <Link to={`/replicas/${replicaId}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              {tCommon('actions.edit')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Transfer Alert */}
      {(isUrgent || isOverdue) && (
        <Card className={isOverdue ? 'border-destructive' : 'border-orange-500'}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className={`h-5 w-5 ${isOverdue ? 'text-destructive' : 'text-orange-500'}`} />
              <div>
                <p className={`font-semibold ${isOverdue ? 'text-destructive' : 'text-orange-600'}`}>
                  {isOverdue ? t('replicas.transferOverdue') : t('replicas.transferUrgent')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isOverdue
                    ? t('replicas.overdueDays', { days: Math.abs(daysUntilTransfer) })
                    : t('replicas.daysLeft', { days: daysUntilTransfer })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Replica Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('replicas.replicaInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('fields.creationDate')}
              </h4>
              <p className="mt-1">{format(new Date(replica.creationDate), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('fields.nextTransfer')}
              </h4>
              <p className={`mt-1 ${isOverdue ? 'text-destructive font-semibold' : isUrgent ? 'text-orange-600 font-semibold' : ''}`}>
                {format(new Date(replica.nextTransferDate), 'MMM dd, yyyy')}
                {isOverdue && ` (${t('replicas.overdue')})`}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('fields.subcultureMedium')}
              </h4>
              <p className="mt-1">{replica.subcultureMedium}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('fields.subcultureInterval')}
              </h4>
              <p className="mt-1">
                {t('daysInterval', { days: replica.subcultureIntervalDays })}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{replica.researcherName}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{replica.locationName}</span>
            </div>
          </div>

          {replica.parentReplicaName && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('replicas.parentReplica')}
              </h4>
              <p className="mt-1">{replica.parentReplicaName}</p>
            </div>
          )}

          {replica.notes && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">{t('fields.notes')}</h4>
              <p className="mt-1">{replica.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Duplicate Dialog */}
      {showDuplicateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>{t('replicas.duplicateTitle')}</CardTitle>
              <CardDescription>{t('replicas.duplicateDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newName">{t('replicas.newReplicaName')}</Label>
                <Input
                  id="newName"
                  value={newReplicaName}
                  onChange={(e) => setNewReplicaName(e.target.value)}
                  placeholder={`${replica.name}-Copy`}
                  disabled={duplicateReplica.isPending}
                />
              </div>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowDuplicateDialog(false)
                    setNewReplicaName('')
                  }}
                  disabled={duplicateReplica.isPending}
                >
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleDuplicate}
                  disabled={duplicateReplica.isPending || !newReplicaName.trim()}
                >
                  {duplicateReplica.isPending ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      {t('replicas.duplicating')}
                    </>
                  ) : (
                    t('replicas.duplicate')
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
