import { useNavigate } from 'react-router-dom'
import { useCreateSample } from '@/hooks/useSamples'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SampleForm } from '@/components/sample/SampleForm'
import { BackArrow } from '@/components/shared/BackArrow'
import { useTranslation } from 'react-i18next'
import type { CreateSampleRequest } from '@/types/sample.types'

export function AddSamplePage() {
  const { t } = useTranslation('samples')
  const navigate = useNavigate()
  const createSample = useCreateSample()

  const handleSubmit = async (data: CreateSampleRequest) => {
    await createSample.mutateAsync(data)
    navigate('/samples')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <BackArrow to="/samples" />

      <div>
        <h1 className="text-3xl font-bold">{t('addSample')}</h1>
        <p className="text-muted-foreground mt-2">{t('addSampleSubtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('sampleDetails')}</CardTitle>
          <CardDescription>{t('addSampleDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <SampleForm
            onSubmit={handleSubmit}
            isSubmitting={createSample.isPending}
            submitLabel={t('addSample')}
          />
        </CardContent>
      </Card>
    </div>
  )
}
