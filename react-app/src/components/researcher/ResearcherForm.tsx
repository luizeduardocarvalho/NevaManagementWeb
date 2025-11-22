import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/shared/Spinner'
import { useTranslation } from 'react-i18next'
import type { CreateResearcherRequest } from '@/types/researcher.types'

interface ResearcherFormProps {
  initialData?: Partial<CreateResearcherRequest>
  onSubmit: (data: CreateResearcherRequest) => void
  isSubmitting: boolean
  submitLabel: string
}

export function ResearcherForm({ initialData, onSubmit, isSubmitting, submitLabel }: ResearcherFormProps) {
  const { t } = useTranslation('researchers')
  const { t: tCommon } = useTranslation('common')

  const [formData, setFormData] = useState<CreateResearcherRequest>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    specialization: initialData?.specialization || '',
    department: initialData?.department || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          {t('fields.name')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t('fields.namePlaceholder')}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">
          {t('fields.email')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder={t('fields.emailPlaceholder')}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">{t('fields.phone')}</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder={t('fields.phonePlaceholder')}
          disabled={isSubmitting}
        />
      </div>

      {/* Specialization */}
      <div className="space-y-2">
        <Label htmlFor="specialization">{t('fields.specialization')}</Label>
        <Input
          id="specialization"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          placeholder={t('fields.specializationPlaceholder')}
          disabled={isSubmitting}
        />
      </div>

      {/* Department */}
      <div className="space-y-2">
        <Label htmlFor="department">{t('fields.department')}</Label>
        <Input
          id="department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          placeholder={t('fields.departmentPlaceholder')}
          disabled={isSubmitting}
        />
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              {tCommon('actions.saving')}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}
