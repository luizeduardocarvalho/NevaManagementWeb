import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { AccountInfo } from '@/components/settings/AccountInfo';
import { ThemeSettings } from '@/components/settings/ThemeSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { DisplaySettings } from '@/components/settings/DisplaySettings';
import { User, Bell, Monitor, Settings as SettingsIcon, Languages, Layout } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SettingsPage() {
  const { t } = useTranslation('common');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('settings.description')}
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex">
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            {t('settings.tabs.general')}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Monitor className="h-4 w-4" />
            {t('settings.tabs.appearance')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            {t('settings.tabs.notifications')}
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" />
            {t('settings.tabs.account')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                {t('settings.language.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.language.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSwitcher />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                {t('settings.display.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.display.cardDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DisplaySettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                {t('settings.appearance.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.appearance.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('settings.notifications.cardTitle')}
              </CardTitle>
              <CardDescription>
                {t('settings.notifications.cardDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('settings.account.cardTitle')}
              </CardTitle>
              <CardDescription>
                {t('settings.account.cardDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccountInfo />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
