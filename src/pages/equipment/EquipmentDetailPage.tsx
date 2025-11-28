import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEquipmentById, useEquipmentCalendar, useDeleteEquipment } from '@/hooks/useEquipment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/shared/Spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Wrench, MapPin, Calendar, History, Edit, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function EquipmentDetailPage() {
  const { t } = useTranslation('equipment')
  const { t: tCommon } = useTranslation('common')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const equipmentId = parseInt(id!)
  const { data: equipment, isLoading, error } = useEquipmentById(equipmentId)
  const deleteEquipment = useDeleteEquipment()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  const { data: calendar, isLoading: calendarLoading } = useEquipmentCalendar(equipmentId, year, month)

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month, 1))
  }

  const handleDelete = async () => {
    await deleteEquipment.mutateAsync(equipmentId)
    navigate('/equipment')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !equipment) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{tCommon('errors.loadFailed')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Wrench className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{equipment.name}</h1>
            <p className="text-muted-foreground mt-1">
              Property #{equipment.propertyNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/equipment/${equipment.id}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              {tCommon('actions.edit')}
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {tCommon('actions.delete')}
          </Button>
        </div>
      </div>

      {/* Equipment Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('equipmentInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">{tCommon('fields.description')}</h4>
            <p className="mt-1">{equipment.description}</p>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{equipment.location.name}</span>
            {equipment.location.description && (
              <span className="text-sm">- {equipment.location.description}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('calendar.title')}
              </CardTitle>
              <CardDescription className="mt-2">
                {t('calendar.description', { month: format(currentDate, 'MMMM yyyy') })}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {calendarLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : calendar && calendar.days.length > 0 ? (
            <div className="space-y-4">
              {calendar.days.map((day) => (
                <div key={day.dayNumber} className="border-l-2 border-primary pl-4">
                  <h4 className="font-semibold mb-2">
                    {format(new Date(year, month - 1, day.dayNumber), 'EEEE, MMMM d')}
                  </h4>
                  <div className="space-y-2">
                    {day.appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-3 rounded-lg bg-muted/50 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{appointment.researcher.first_name} {appointment.researcher.last_name}</span>
                          <span className="text-muted-foreground">
                            {format(new Date(appointment.startDate), 'HH:mm')} -{' '}
                            {format(new Date(appointment.endDate), 'HH:mm')}
                          </span>
                        </div>
                        {appointment.description && (
                          <p className="text-muted-foreground mt-1">{appointment.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              {t('calendar.noScheduled')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link to={`/equipment/${equipment.id}/use`} className="flex-1">
          <Button className="w-full flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('actions.scheduleUsage')}
          </Button>
        </Link>
        <Link to={`/equipment/${equipment.id}/history`} className="flex-1">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <History className="h-4 w-4" />
            {t('actions.viewHistory')}
          </Button>
        </Link>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tCommon('actions.delete')} {t('equipment')}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{equipment.name}"? This action cannot be undone and will remove all usage history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteEquipment.isPending ? 'Deleting...' : tCommon('actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
