import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePreferencesStore } from '@/store/preferencesStore';
import { Bell, BellOff, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function NotificationSettings() {
  const { t } = useTranslation('common');
  const notifications = usePreferencesStore((state) => state.notifications);
  const updateNotifications = usePreferencesStore((state) => state.updateNotifications);
  const requestBrowserNotificationPermission = usePreferencesStore(
    (state) => state.requestBrowserNotificationPermission
  );

  const handleBrowserNotificationToggle = async (checked: boolean) => {
    if (checked) {
      const granted = await requestBrowserNotificationPermission();
      if (granted) {
        toast.success(t('settings.notifications.browserEnabled'));
      } else {
        toast.error(t('settings.notifications.browserDenied'));
      }
    } else {
      updateNotifications({ browser: false });
      toast.success(t('settings.notifications.browserDisabled'));
    }
  };

  const handleEmailToggle = (checked: boolean) => {
    updateNotifications({ email: checked });
    toast.success(
      checked
        ? t('settings.notifications.emailEnabled')
        : t('settings.notifications.emailDisabled')
    );
  };

  const handleEmailPreferenceToggle = (
    key: keyof typeof notifications,
    checked: boolean
  ) => {
    updateNotifications({ [key]: checked });
  };

  const notificationStatus =
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium">{t('settings.notifications.title')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('settings.notifications.description')}
        </p>
      </div>

      {/* Browser Notifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-start gap-3">
            {notifications.browser ? (
              <Bell className="mt-1 h-5 w-5 text-primary" />
            ) : (
              <BellOff className="mt-1 h-5 w-5 text-muted-foreground" />
            )}
            <div className="space-y-1">
              <Label htmlFor="browser-notifications" className="cursor-pointer">
                {t('settings.notifications.browser')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.notifications.browserDescription')}
              </p>
              {notificationStatus === 'denied' && (
                <p className="text-sm text-destructive">
                  {t('settings.notifications.browserBlocked')}
                </p>
              )}
            </div>
          </div>
          <Switch
            id="browser-notifications"
            checked={notifications.browser}
            onCheckedChange={handleBrowserNotificationToggle}
            disabled={notificationStatus === 'denied'}
          />
        </div>
      </div>

      {/* Email Notifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-primary" />
            <div className="space-y-1">
              <Label htmlFor="email-notifications" className="cursor-pointer">
                {t('settings.notifications.email')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.notifications.emailDescription')}
              </p>
            </div>
          </div>
          <Switch
            id="email-notifications"
            checked={notifications.email}
            onCheckedChange={handleEmailToggle}
          />
        </div>

        {/* Email Preferences */}
        {notifications.email && (
          <div className="ml-8 space-y-3 rounded-lg border p-4">
            <p className="text-sm font-medium">
              {t('settings.notifications.emailPreferences')}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="email-sample-update"
                  className="cursor-pointer text-sm font-normal"
                >
                  {t('settings.notifications.sampleUpdates')}
                </Label>
                <Switch
                  id="email-sample-update"
                  checked={notifications.emailOnSampleUpdate}
                  onCheckedChange={(checked) =>
                    handleEmailPreferenceToggle('emailOnSampleUpdate', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="email-equipment"
                  className="cursor-pointer text-sm font-normal"
                >
                  {t('settings.notifications.equipmentMaintenance')}
                </Label>
                <Switch
                  id="email-equipment"
                  checked={notifications.emailOnEquipmentMaintenance}
                  onCheckedChange={(checked) =>
                    handleEmailPreferenceToggle('emailOnEquipmentMaintenance', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="email-invitation"
                  className="cursor-pointer text-sm font-normal"
                >
                  {t('settings.notifications.invitations')}
                </Label>
                <Switch
                  id="email-invitation"
                  checked={notifications.emailOnInvitation}
                  onCheckedChange={(checked) =>
                    handleEmailPreferenceToggle('emailOnInvitation', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="email-routine"
                  className="cursor-pointer text-sm font-normal"
                >
                  {t('settings.notifications.routineAssignments')}
                </Label>
                <Switch
                  id="email-routine"
                  checked={notifications.emailOnRoutineAssignment}
                  onCheckedChange={(checked) =>
                    handleEmailPreferenceToggle('emailOnRoutineAssignment', checked)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
