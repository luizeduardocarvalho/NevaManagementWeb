import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePreferencesStore, type Theme } from '@/store/preferencesStore';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ThemeSettings() {
  const { t } = useTranslation('common');
  const theme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);

  const handleThemeChange = (value: string) => {
    setTheme(value as Theme);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium">{t('settings.theme.title')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('settings.theme.description')}
        </p>
      </div>

      <RadioGroup value={theme} onValueChange={handleThemeChange}>
        <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent">
          <RadioGroupItem value="light" id="light" />
          <Label
            htmlFor="light"
            className="flex flex-1 cursor-pointer items-center gap-3"
          >
            <Sun className="h-5 w-5" />
            <div>
              <p className="font-medium">{t('settings.theme.light')}</p>
              <p className="text-sm text-muted-foreground">
                {t('settings.theme.lightDescription')}
              </p>
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent">
          <RadioGroupItem value="dark" id="dark" />
          <Label
            htmlFor="dark"
            className="flex flex-1 cursor-pointer items-center gap-3"
          >
            <Moon className="h-5 w-5" />
            <div>
              <p className="font-medium">{t('settings.theme.dark')}</p>
              <p className="text-sm text-muted-foreground">
                {t('settings.theme.darkDescription')}
              </p>
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent">
          <RadioGroupItem value="system" id="system" />
          <Label
            htmlFor="system"
            className="flex flex-1 cursor-pointer items-center gap-3"
          >
            <Monitor className="h-5 w-5" />
            <div>
              <p className="font-medium">{t('settings.theme.system')}</p>
              <p className="text-sm text-muted-foreground">
                {t('settings.theme.systemDescription')}
              </p>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
