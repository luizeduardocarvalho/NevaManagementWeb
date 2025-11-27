import { useNavigate } from 'react-router-dom'
import { useCreateResearcher } from '@/hooks/useResearchers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResearcherForm } from '@/components/researcher/ResearcherForm'
import { BackArrow } from '@/components/shared/BackArrow'
import { useTranslation } from 'react-i18next'
import type { CreateResearcherRequest } from '@/types/researcher.types'

export function AddResearcherPage() {
  const { t } = useTranslation('researchers')
  const navigate = useNavigate()
  const createResearcher = useCreateResearcher()

  const handleSubmit = async (data: CreateResearcherRequest) => {
    await createResearcher.mutateAsync(data)
    navigate('/researchers')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <BackArrow to="/researchers" />

      <div>
        <h1 className="text-3xl font-bold">{t('addResearcher')}</h1>
        <p className="text-muted-foreground mt-2">{t('addResearcherSubtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('researcherDetails')}</CardTitle>
          <CardDescription>{t('addResearcherDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResearcherForm
            onSubmit={handleSubmit}
            isSubmitting={createResearcher.isPending}
            submitLabel={t('addResearcher')}
          />
        </CardContent>
      </Card>
    </div>
  )
}
