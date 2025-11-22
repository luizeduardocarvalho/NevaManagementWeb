import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSampleById, useDeleteSample } from '@/hooks/useSamples'
import { useReplicasBySampleId } from '@/hooks/useReplicas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/shared/Spinner'
import { BackArrow } from '@/components/shared/BackArrow'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { FlaskConical, MapPin, User, Calendar, Plus, Beaker, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export function SampleDetailPage() {
  const { t } = useTranslation('samples')
  const { t: tCommon } = useTranslation('common')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const sampleId = parseInt(id!)

  const { data: sample, isLoading, error } = useSampleById(sampleId)
  const { data: replicas, isLoading: replicasLoading } = useReplicasBySampleId(sampleId)
  const deleteSample = useDeleteSample()

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    await deleteSample.mutateAsync(sampleId)
    navigate('/samples')
  }

  if (isLoading || replicasLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !sample) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{tCommon('errors.loadFailed')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BackArrow to="/samples" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <FlaskConical className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{sample.name}</h1>
            {sample.description && (
              <p className="text-muted-foreground mt-1">{sample.description}</p>
            )}
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {tCommon('actions.delete')}
        </Button>
      </div>

      {/* Sample Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('sampleInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">{t('fields.origin')}</h4>
              <p className="mt-1">{sample.origin}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('fields.isolationDate')}
              </h4>
              <p className="mt-1">{format(new Date(sample.isolationDate), 'MMM dd, yyyy')}</p>
            </div>
          </div>

          {(sample.latitude || sample.longitude) && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('fields.coordinates')}
              </h4>
              <p className="mt-1">
                {sample.latitude && `Lat: ${sample.latitude.toFixed(4)}`}
                {sample.latitude && sample.longitude && ', '}
                {sample.longitude && `Lng: ${sample.longitude.toFixed(4)}`}
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('fields.subcultureMedium')}
              </h4>
              <p className="mt-1">{sample.subcultureMedium}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('fields.subcultureInterval')}
              </h4>
              <p className="mt-1">{t('daysInterval', { days: sample.subcultureIntervalDays })}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{sample.researcherName}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{sample.locationName}</span>
            </div>
          </div>

          {sample.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {t('fields.tags')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {sample.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Replicas Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                {t('replicas.title')}
              </CardTitle>
              <CardDescription className="mt-2">
                {t('replicas.description', { count: replicas?.length || 0 })}
              </CardDescription>
            </div>
            <Link to={`/replicas/add?sampleId=${sampleId}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('replicas.addReplica')}
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!replicas || replicas.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">{t('replicas.noReplicas')}</p>
          ) : (
            <div className="space-y-3">
              {replicas.map((replica) => (
                <Link key={replica.id} to={`/replicas/${replica.id}`} className="block">
                  <div className="flex items-center justify-between p-4 rounded-lg border md:hover:border-primary md:transition-colors active:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2 shrink-0">
                        <Beaker className="h-4 w-4 text-primary" />
                      </div>
                      <h4 className="font-semibold">{replica.name}</h4>
                    </div>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tCommon('actions.delete')} {t('sample')}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{sample.name}"? This action cannot be undone and will also delete all associated replicas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteSample.isPending ? 'Deleting...' : tCommon('actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
