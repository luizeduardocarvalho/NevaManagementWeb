import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { format, addDays, addMonths, startOfDay } from 'date-fns'
import type { RecurrenceRule } from '@/types/routine.types'

interface RecurrenceBuilderProps {
  recurrence: RecurrenceRule
  onChange: (recurrence: RecurrenceRule) => void
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
]

export function RecurrenceBuilder({ recurrence, onChange }: RecurrenceBuilderProps) {
  const updateRecurrence = (updates: Partial<RecurrenceRule>) => {
    onChange({ ...recurrence, ...updates })
  }

  const toggleDayOfWeek = (day: number) => {
    const current = recurrence.daysOfWeek || []
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort()
    updateRecurrence({ daysOfWeek: updated })
  }

  // Calculate next 3 occurrences for preview
  const calculateNextOccurrences = (): Date[] => {
    const occurrences: Date[] = []
    const startDate = new Date(recurrence.startDate)

    if (!startDate || isNaN(startDate.getTime())) return []

    let currentDate = startOfDay(startDate)
    const today = startOfDay(new Date())

    // Start from today if start date is in the past
    if (currentDate < today) {
      currentDate = today
    }

    for (let i = 0; i < 10 && occurrences.length < 3; i++) {
      let nextDate: Date

      switch (recurrence.frequency) {
        case 'daily':
          nextDate = addDays(currentDate, i * recurrence.interval)
          occurrences.push(nextDate)
          break

        case 'weekly':
          if (!recurrence.daysOfWeek || recurrence.daysOfWeek.length === 0) {
            return []
          }
          // For weekly, find next occurrence based on selected days
          let daysChecked = 0
          while (occurrences.length < 3 && daysChecked < 60) {
            const checkDate = addDays(currentDate, daysChecked)
            if (recurrence.daysOfWeek.includes(checkDate.getDay())) {
              occurrences.push(checkDate)
            }
            daysChecked++
          }
          return occurrences

        case 'monthly':
          if (!recurrence.dayOfMonth) {
            return []
          }
          nextDate = addMonths(currentDate, i * recurrence.interval)
          nextDate.setDate(Math.min(recurrence.dayOfMonth, new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()))
          occurrences.push(nextDate)
          break
      }
    }

    return occurrences
  }

  const nextOccurrences = calculateNextOccurrences()

  return (
    <div className="space-y-4">
      {/* Frequency */}
      <div className="space-y-2">
        <Label>Frequency</Label>
        <Select
          value={recurrence.frequency}
          onValueChange={(value: 'daily' | 'weekly' | 'monthly') =>
            updateRecurrence({ frequency: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Interval */}
      <div className="space-y-2">
        <Label>Repeat every</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            value={recurrence.interval}
            onChange={(e) => updateRecurrence({ interval: parseInt(e.target.value) || 1 })}
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">
            {recurrence.frequency === 'daily' && `day${recurrence.interval > 1 ? 's' : ''}`}
            {recurrence.frequency === 'weekly' && `week${recurrence.interval > 1 ? 's' : ''}`}
            {recurrence.frequency === 'monthly' && `month${recurrence.interval > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Days of Week (for weekly) */}
      {recurrence.frequency === 'weekly' && (
        <div className="space-y-2">
          <Label>Repeat on</Label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <label
                key={day.value}
                className={`flex items-center justify-center px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                  recurrence.daysOfWeek?.includes(day.value)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-accent'
                }`}
              >
                <input
                  type="checkbox"
                  checked={recurrence.daysOfWeek?.includes(day.value) || false}
                  onChange={() => toggleDayOfWeek(day.value)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{day.short}</span>
              </label>
            ))}
          </div>
          {(!recurrence.daysOfWeek || recurrence.daysOfWeek.length === 0) && (
            <p className="text-xs text-destructive">Please select at least one day</p>
          )}
        </div>
      )}

      {/* Day of Month (for monthly) */}
      {recurrence.frequency === 'monthly' && (
        <div className="space-y-2">
          <Label>Day of month</Label>
          <Select
            value={recurrence.dayOfMonth?.toString() || '1'}
            onValueChange={(value) => updateRecurrence({ dayOfMonth: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day}
                  {day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of the month
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Start Date */}
      <div className="space-y-2">
        <Label>Start date</Label>
        <Input
          type="date"
          value={recurrence.startDate ? recurrence.startDate.split('T')[0] : ''}
          onChange={(e) => {
            const date = e.target.value ? `${e.target.value}T00:00:00Z` : ''
            updateRecurrence({ startDate: date })
          }}
          required
        />
      </div>

      {/* End Date (optional) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="has-end-date"
            checked={!!recurrence.endDate}
            onCheckedChange={(checked) => {
              if (checked) {
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 7)
                updateRecurrence({ endDate: tomorrow.toISOString().split('T')[0] + 'T00:00:00Z' })
              } else {
                updateRecurrence({ endDate: undefined })
              }
            }}
          />
          <Label htmlFor="has-end-date" className="cursor-pointer">
            Set end date (optional)
          </Label>
        </div>
        {recurrence.endDate && (
          <Input
            type="date"
            value={recurrence.endDate ? recurrence.endDate.split('T')[0] : ''}
            onChange={(e) => {
              const date = e.target.value ? `${e.target.value}T00:00:00Z` : undefined
              updateRecurrence({ endDate: date })
            }}
            min={recurrence.startDate ? recurrence.startDate.split('T')[0] : undefined}
          />
        )}
      </div>

      {/* Preview */}
      {nextOccurrences.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Next occurrences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {nextOccurrences.map((date, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {format(date, 'EEEE, MMMM d, yyyy')}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
