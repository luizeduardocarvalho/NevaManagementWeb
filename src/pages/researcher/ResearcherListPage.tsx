import { Link } from 'react-router-dom'
import { useAllResearchers, useDeleteResearcher } from '@/hooks/useResearchers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/shared/Spinner'
import { Plus, Search, User, Mail, Phone, Trash2 } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export function ResearcherListPage() {
  const { t } = useTranslation('researchers')
  const { t: tCommon } = useTranslation('common')
  const { data: researchers, isLoading, error } = useAllResearchers()
  const deleteResearcher = useDeleteResearcher()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const filteredResearchers = useMemo(() => {
    if (!researchers) return []

    return researchers.filter(
      (researcher) => {
        const fullName = `${researcher.first_name} ${researcher.last_name}`.toLowerCase()
        const searchLower = searchTerm.toLowerCase()

        return (
          fullName.includes(searchLower) ||
          researcher.email?.toLowerCase().includes(searchLower) ||
          researcher.specialization?.toLowerCase().includes(searchLower)
        )
      }
    )
  }, [researchers, searchTerm])

  const handleDelete = async (id: number) => {
    await deleteResearcher.mutateAsync(id)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        <Link to="/researchers/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('addResearcher')}
          </Button>
        </Link>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResearchers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? t('noResearchersSearch') : t('noResearchers')}
            </p>
          </div>
        ) : (
          filteredResearchers.map((researcher) => (
            <Link
              key={researcher.id}
              to={`/researchers/${researcher.id}`}
              className="rounded-lg border p-6 md:hover:border-primary md:hover:shadow-lg md:transition-all md:duration-200 h-full block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="rounded-full bg-primary/10 p-3 shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {researcher.first_name} {researcher.last_name}
                    </h3>
                    {researcher.specialization && (
                      <p className="text-sm text-muted-foreground truncate">
                        {researcher.specialization}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setDeleteConfirm(researcher.id)
                  }}
                  className="p-2 hover:bg-destructive/10 rounded-md transition-colors group"
                  title={t('deleteResearcher')}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-destructive" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate">{researcher.email}</span>
                </div>
                {researcher.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3 shrink-0" />
                    <span>{researcher.phone}</span>
                  </div>
                )}
                {researcher.department && (
                  <div className="text-sm text-muted-foreground">
                    {researcher.department}
                  </div>
                )}
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
                disabled={deleteResearcher.isPending}
              >
                {tCommon('actions.cancel')}
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteResearcher.isPending}
              >
                {deleteResearcher.isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    {tCommon('actions.deleting')}
                  </>
                ) : (
                  t('delete')
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
