import { Link, useNavigate } from 'react-router-dom'
import { useRoutines, useDeleteRoutine } from '@/hooks/useRoutines'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/shared/Spinner'
import { Plus, Search, Trash2, Play, Clock, Beaker, Wrench, Calendar } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export function RoutineListPage() {
  const { t } = useTranslation('routines')
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [scheduleType, setScheduleType] = useState<string | undefined>(undefined)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const { data: routines, isLoading, error } = useRoutines(scheduleType)
  const deleteRoutine = useDeleteRoutine()

  const filteredRoutines = useMemo(() => {
    if (!routines) return []

    return routines.filter(
      (routine) =>
        routine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        routine.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [routines, searchTerm])

  const handleDelete = async (id: number) => {
    await deleteRoutine.mutateAsync(id)
    setDeleteConfirm(null)
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
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/routines/statistics">
            <Button variant="outline" className="flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Statistics
            </Button>
          </Link>
          <Link to="/routines/history">
            <Button variant="outline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t('viewHistory')}
            </Button>
          </Link>
          <Link to="/routines/add">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('addRoutine')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search routines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={scheduleType || 'all'} onValueChange={(v) => setScheduleType(v === 'all' ? undefined : v)}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="template">Templates</SelectItem>
            <SelectItem value="one_time">One-time</SelectItem>
            <SelectItem value="recurring">Recurring</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Routines Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRoutines.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Beaker className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('noRoutines')}</h3>
            <p className="text-muted-foreground mb-4">{t('noRoutinesDescription')}</p>
            <Link to="/routines/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('addRoutine')}
              </Button>
            </Link>
          </div>
        ) : (
          filteredRoutines.map((routine) => (
            <Link
              key={routine.id}
              to={`/routines/${routine.id}`}
              className="rounded-lg border p-6 hover:border-primary hover:shadow-lg transition-all duration-200 h-full block group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {routine.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {routine.description}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setDeleteConfirm(routine.id)
                  }}
                  className="p-2 hover:bg-destructive/10 rounded-md transition-colors group/delete"
                  title={t('deleteRoutine')}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground group-hover/delete:text-destructive" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Beaker className="h-4 w-4" />
                  <span>
                    {t('stats.stepsCount', { count: routine.steps.length })} •{' '}
                    {t('stats.materialsCount', { count: routine.materials.length })} •{' '}
                    {t('stats.equipmentCount', { count: routine.equipment.length })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigate(`/routines/${routine.id}/execute`)
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {t('executeRoutine')}
                </Button>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4 border">
            <h3 className="text-lg font-semibold mb-2">{t('deleteConfirmTitle')}</h3>
            <p className="text-muted-foreground mb-6">{t('deleteConfirmMessage')}</p>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteRoutine.isPending}
              >
                {tCommon('actions.cancel')}
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteRoutine.isPending}
              >
                {deleteRoutine.isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    {tCommon('actions.deleting')}
                  </>
                ) : (
                  t('deleteRoutine')
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
