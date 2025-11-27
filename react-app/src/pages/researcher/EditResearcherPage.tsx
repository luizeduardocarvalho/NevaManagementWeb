import { useParams, useNavigate } from 'react-router-dom'
import { useResearcherById, useEditResearcher } from '@/hooks/useResearchers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/shared/Spinner'
import { BackArrow } from '@/components/shared/BackArrow'
import { ResearcherForm } from '@/components/researcher/ResearcherForm'
import { useTranslation } from 'react-i18next'
import type { CreateResearcherRequest } from '@/types/researcher.types'

export function EditResearcherPage() {
  const { t } = useTranslation('researchers')
  const { t: tCommon } = useTranslation('common')
  const { id } = useParams<{ id: string }>()
  const researcherId = parseInt(id!)
  const navigate = useNavigate()

  const { data: researcher, isLoading, error } = useResearcherById(researcherId)
  const editResearcher = useEditResearcher()

  const handleSubmit = async (data: CreateResearcherRequest) => {
    await editResearcher.mutateAsync({ id: researcherId, data })
    navigate(`/researchers/${researcherId}`)
  }

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
    <div className="max-w-2xl mx-auto space-y-6">
      <BackArrow to={`/researchers/${researcherId}`} />

      <div>
        <h1 className="text-3xl font-bold">{t('editResearcher')}</h1>
        <p className="text-muted-foreground mt-2">{researcher.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('researcherDetails')}</CardTitle>
          <CardDescription>{t('editResearcherDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResearcherForm
            initialData={{
              name: researcher.name,
              email: researcher.email,
              phone: researcher.phone,
              specialization: researcher.specialization,
              department: researcher.department,
            }}
            onSubmit={handleSubmit}
            isSubmitting={editResearcher.isPending}
            submitLabel={t('updateResearcher')}
          />
        </CardContent>
      </Card>
    </div>
  )
}
