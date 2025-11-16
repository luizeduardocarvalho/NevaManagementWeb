import { useParams, Link } from 'react-router-dom'
import { useEquipmentById, useEquipmentCalendar } from '@/hooks/useEquipment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/shared/Spinner'
import { Wrench, MapPin, Calendar, History, Edit, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'

export function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const equipmentId = parseInt(id!)
  const { data: equipment, isLoading, error } = useEquipmentById(equipmentId)

  const [currentDate, setCurrentDate] = useState(new Date())
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  const { data: calendar, isLoading: calendarLoading } = useEquipmentCalendar(equipmentId, year, month)

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month, 1))
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
        <p className="text-destructive">Failed to load equipment</p>
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
        <Link to={`/equipment/${equipment.id}/edit`}>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Equipment Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
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
                Usage Calendar
              </CardTitle>
              <CardDescription className="mt-2">
                Scheduled equipment usage for {format(currentDate, 'MMMM yyyy')}
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
                          <span className="font-medium">{appointment.researcher.name}</span>
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
              No scheduled usage for this month
            </p>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link to={`/equipment/${equipment.id}/use`} className="flex-1">
          <Button className="w-full flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Usage
          </Button>
        </Link>
        <Link to={`/equipment/${equipment.id}/history`} className="flex-1">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <History className="h-4 w-4" />
            View History
          </Button>
        </Link>
      </div>
    </div>
  )
}
