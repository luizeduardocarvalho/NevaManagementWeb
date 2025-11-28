import { useParams, Link } from 'react-router-dom'
import { useResearcherById } from '@/hooks/useResearchers'
import { usePermissions } from '@/hooks/usePermissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/shared/Spinner'
import { BackArrow } from '@/components/shared/BackArrow'
import { User, Mail, Phone, Briefcase, Building, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

export function ResearcherDetailPage() {
  const { t } = useTranslation('researchers')
  const { t: tCommon } = useTranslation('common')
  const { id } = useParams<{ id: string }>()
  const researcherId = parseInt(id!)
  const { canEditResearcher } = usePermissions()

  const { data: researcher, isLoading, error } = useResearcherById(researcherId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !researcher) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{tCommon('errors.loadFailed')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BackArrow to="/researchers" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{researcher.first_name} {researcher.last_name}</h1>
            {researcher.specialization && (
              <p className="text-muted-foreground mt-1">{researcher.specialization}</p>
            )}
          </div>
        </div>
        {canEditResearcher && (
          <Link to={`/researchers/${researcher.id}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              {tCommon('actions.edit')}
            </Button>
          </Link>
        )}
      </div>

      {/* Researcher Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('researcherInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">{t('fields.email')}</p>
              <p className="font-medium">{researcher.email}</p>
            </div>
          </div>

          {researcher.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{t('fields.phone')}</p>
                <p className="font-medium">{researcher.phone}</p>
              </div>
            </div>
          )}

          {researcher.specialization && (
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{t('fields.specialization')}</p>
                <p className="font-medium">{researcher.specialization}</p>
              </div>
            </div>
          )}

          {researcher.department && (
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{t('fields.department')}</p>
                <p className="font-medium">{researcher.department}</p>
              </div>
            </div>
          )}

          {researcher.createdAt && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {t('memberSince', { date: format(new Date(researcher.createdAt), 'MMMM yyyy') })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
