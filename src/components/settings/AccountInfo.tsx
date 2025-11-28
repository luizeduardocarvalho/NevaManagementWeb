import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { Mail, User, Building2, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AccountInfo() {
  const { t } = useTranslation('common');
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const roleLabels = {
    'org-coordinator': t('settings.account.roles.orgCoordinator'),
    'lab-coordinator': t('settings.account.roles.labCoordinator'),
    coordinator: t('settings.account.roles.labCoordinator'),
    technician: t('settings.account.roles.technician'),
    student: t('settings.account.roles.student'),
  };

  const roleColors = {
    'org-coordinator': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'lab-coordinator': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    coordinator: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    technician: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    student: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium">{t('settings.account.title')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('settings.account.description')}
        </p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div className="flex items-start gap-3 rounded-lg border p-4">
          <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {t('settings.account.name')}
            </p>
            <p className="text-sm">
              {user.firstName} {user.lastName}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-3 rounded-lg border p-4">
          <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {t('settings.account.email')}
            </p>
            <p className="text-sm">{user.email}</p>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-start gap-3 rounded-lg border p-4">
          <Shield className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {t('settings.account.role')}
            </p>
            <Badge className={roleColors[user.role] || roleColors.student}>
              {roleLabels[user.role] || user.role}
            </Badge>
          </div>
        </div>

        {/* Laboratory ID */}
        {user.laboratoryId && (
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t('settings.account.laboratory')}
              </p>
              <p className="text-sm">
                {t('settings.account.laboratoryId')}: {user.laboratoryId}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-xs text-muted-foreground">
          {t('settings.account.note')}
        </p>
      </div>
    </div>
  );
}
