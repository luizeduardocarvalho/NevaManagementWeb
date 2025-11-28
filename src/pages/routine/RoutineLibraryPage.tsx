import { Link, useNavigate } from 'react-router-dom'
import { useRoutines } from '@/hooks/useRoutines'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/shared/Spinner'
import { Search, Play, Clock, Beaker, Wrench, Calendar, Plus } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export function RoutineLibraryPage() {
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch all routines (templates, recurring, one-time)
  const { data: routines, isLoading, error } = useRoutines()

  const filteredRoutines = useMemo(() => {
    if (!routines) return []

    return routines.filter(
      (routine) =>
        routine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        routine.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [routines, searchTerm])

  // Calculate estimated duration from equipment
  const getEstimatedDuration = (routine: any) => {
    if (routine.equipment.length === 0) return null
    const totalMinutes = routine.equipment.reduce(
      (sum: number, eq: any) => sum + eq.estimatedDuration,
      0
    )
    return totalMinutes
  }

  const getScheduleTypeBadge = (scheduleType: string) => {
    switch (scheduleType) {
      case 'template':
        return <Badge variant="outline">Template</Badge>
      case 'one_time':
        return <Badge variant="secondary">One-time</Badge>
      case 'recurring':
        return <Badge variant="default">Recurring</Badge>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
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
        <div>
          <h1 className="text-3xl font-bold">Routine Library</h1>
          <p className="text-muted-foreground mt-2">
            Choose a routine to execute ({filteredRoutines.length} available)
          </p>
        </div>
        <Link to="/routines/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Routine
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search routines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Routines Grid */}
      {filteredRoutines.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Beaker className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No routines found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try a different search term' : 'Create your first routine to get started'}
            </p>
            {!searchTerm && (
              <Link to="/routines/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Routine
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRoutines.map((routine) => {
            const estimatedDuration = getEstimatedDuration(routine)

            return (
              <Card
                key={routine.id}
                className="hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{routine.name}</CardTitle>
                    {getScheduleTypeBadge(routine.scheduleType)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {routine.description || 'No description'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  {/* Metadata */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {estimatedDuration && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>~{estimatedDuration} min</span>
                      </div>
                    )}

                    {routine.materials.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Beaker className="h-4 w-4" />
                        <span>{routine.materials.length} material{routine.materials.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}

                    {routine.equipment.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        <span>{routine.equipment.length} equipment</span>
                      </div>
                    )}

                    {routine.steps.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{routine.steps.length} step{routine.steps.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/routines/${routine.id}/execute`)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Execution
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/routines/${routine.id}`)}
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
