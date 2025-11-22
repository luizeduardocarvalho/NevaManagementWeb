import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function SettingsPage() {
  const { t } = useTranslation('common')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your application preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Preferences
          </CardTitle>
          <CardDescription>
            Configure your application settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t('language')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select your preferred language for the application
            </p>
            <LanguageSwitcher />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
