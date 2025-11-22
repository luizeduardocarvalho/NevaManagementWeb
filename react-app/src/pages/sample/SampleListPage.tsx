import { Link } from 'react-router-dom'
import { useSamples } from '@/hooks/useSamples'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/shared/Spinner'
import { Plus, Search, FlaskConical } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export function SampleListPage() {
  const { t } = useTranslation('samples')
  const { data: samples, isLoading, error } = useSamples()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Extract all unique tags from samples
  const allTags = useMemo(() => {
    if (!samples) return []
    const tagSet = new Set<string>()
    samples.forEach((sample) => sample.tags.forEach((tag) => tagSet.add(tag)))
    return Array.from(tagSet).sort()
  }, [samples])

  const filteredSamples = useMemo(() => {
    if (!samples) return []

    return samples.filter((sample) => {
      const matchesSearch =
        sample.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => sample.tags.includes(tag))
      return matchesSearch && matchesTags
    })
  }, [samples, searchTerm, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
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
        <p className="text-destructive">{t('errors.loadFailed')}</p>
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
        <Link to="/samples/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('addSample')}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground self-center">
              {t('filterByTags')}:
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:border-primary'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="px-3 py-1 text-xs rounded-full border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSamples.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm || selectedTags.length > 0
                ? t('noSamplesSearch')
                : t('noSamples')}
            </p>
          </div>
        ) : (
          filteredSamples.map((sample) => (
            <Link key={sample.id} to={`/samples/${sample.id}`} className="block">
              <div className="rounded-lg border p-6 md:hover:border-primary md:hover:shadow-lg md:transition-all md:duration-200 h-full active:bg-muted/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-full bg-primary/10 p-3 shrink-0">
                    <FlaskConical className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {sample.name}
                    </h3>
                  </div>
                </div>

                {sample.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {sample.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-muted"
                      >
                        {tag}
                      </span>
                    ))}
                    {sample.tags.length > 4 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-muted">
                        +{sample.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
