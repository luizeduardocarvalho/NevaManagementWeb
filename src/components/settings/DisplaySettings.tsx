import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePreferencesStore, type DateFormat, type TimeFormat } from '@/store/preferencesStore';
import { Calendar, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function DisplaySettings() {
  const { t } = useTranslation('common');
  const display = usePreferencesStore((state) => state.display);
  const updateDisplay = usePreferencesStore((state) => state.updateDisplay);

  const handleDateFormatChange = (value: DateFormat) => {
    updateDisplay({ dateFormat: value });
    toast.success(t('settings.display.dateFormatUpdated'));
  };

  const handleTimeFormatChange = (value: TimeFormat) => {
    updateDisplay({ timeFormat: value });
    toast.success(t('settings.display.timeFormatUpdated'));
  };

  const handleDecimalsChange = (value: string) => {
    const decimals = parseInt(value, 10);
    updateDisplay({ showDecimals: decimals });
    toast.success(t('settings.display.decimalsUpdated'));
  };

  // Example dates for preview
  const now = new Date();
  const dateExamples: Record<DateFormat, string> = {
    'MM/DD/YYYY': `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()}`,
    'DD/MM/YYYY': `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`,
    'YYYY-MM-DD': `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`,
  };

  const timeExamples: Record<TimeFormat, string> = {
    '12h': now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    '24h': `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium">{t('settings.display.title')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('settings.display.description')}
        </p>
      </div>

      {/* Date Format */}
      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="date-format" className="text-sm font-medium">
            {t('settings.display.dateFormat')}
          </Label>
        </div>
        <Select value={display.dateFormat} onValueChange={handleDateFormatChange}>
          <SelectTrigger id="date-format">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MM/DD/YYYY">
              MM/DD/YYYY <span className="text-muted-foreground">({dateExamples['MM/DD/YYYY']})</span>
            </SelectItem>
            <SelectItem value="DD/MM/YYYY">
              DD/MM/YYYY <span className="text-muted-foreground">({dateExamples['DD/MM/YYYY']})</span>
            </SelectItem>
            <SelectItem value="YYYY-MM-DD">
              YYYY-MM-DD <span className="text-muted-foreground">({dateExamples['YYYY-MM-DD']})</span>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {t('settings.display.dateFormatDescription')}
        </p>
      </div>

      {/* Time Format */}
      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="time-format" className="text-sm font-medium">
            {t('settings.display.timeFormat')}
          </Label>
        </div>
        <Select value={display.timeFormat} onValueChange={handleTimeFormatChange}>
          <SelectTrigger id="time-format">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12h">
              12-hour <span className="text-muted-foreground">({timeExamples['12h']})</span>
            </SelectItem>
            <SelectItem value="24h">
              24-hour <span className="text-muted-foreground">({timeExamples['24h']})</span>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {t('settings.display.timeFormatDescription')}
        </p>
      </div>

      {/* Decimal Places */}
      <div className="space-y-3 rounded-lg border p-4">
        <Label htmlFor="decimals" className="text-sm font-medium">
          {t('settings.display.decimals')}
        </Label>
        <Select value={display.showDecimals.toString()} onValueChange={handleDecimalsChange}>
          <SelectTrigger id="decimals">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0 {t('settings.display.decimalsPlaces')}</SelectItem>
            <SelectItem value="1">1 {t('settings.display.decimalsPlaces')}</SelectItem>
            <SelectItem value="2">2 {t('settings.display.decimalsPlaces')}</SelectItem>
            <SelectItem value="3">3 {t('settings.display.decimalsPlaces')}</SelectItem>
            <SelectItem value="4">4 {t('settings.display.decimalsPlaces')}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {t('settings.display.decimalsDescription')}
        </p>
      </div>
    </div>
  );
}
