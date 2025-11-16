import { Link } from 'react-router-dom'
import { useInfiniteEquipment } from '@/hooks/useEquipment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/shared/Spinner'
import { Plus, Search, ArrowUpDown, Wrench } from 'lucide-react'
import { useState, useMemo, useEffect, useRef } from 'react'

type SortOption = 'name' | 'propertyNumber'

export function EquipmentListPage() {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteEquipment()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const equipment = useMemo(() => {
    return data?.pages.flatMap((page) => page.equipment) ?? []
  }, [data])

  const filteredAndSortedEquipment = useMemo(() => {
    let filtered = equipment.filter((eq) =>
      eq.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [equipment, searchTerm, sortBy])

  // Infinite scroll intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return <Spinner size="lg" />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load equipment</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipment</h1>
          <p className="text-muted-foreground mt-2">
            Manage laboratory equipment and schedule usage
          </p>
        </div>
        <Link to="/equipment/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Equipment
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search equipment by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 sm:w-auto">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedEquipment.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? 'No equipment found matching your search' : 'No equipment yet'}
            </p>
          </div>
        ) : (
          filteredAndSortedEquipment.map((equipment) => (
            <Link
              key={equipment.id}
              to={`/equipment/${equipment.id}`}
              className="block"
            >
              <div className="rounded-lg border p-6 md:hover:border-primary md:hover:shadow-lg md:transition-all md:duration-200 h-full active:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3 shrink-0">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{equipment.name}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="py-8 text-center">
          {isFetchingNextPage ? (
            <Spinner size="md" />
          ) : (
            <p className="text-muted-foreground text-sm">Scroll to load more</p>
          )}
        </div>
      )}

      {!hasNextPage && filteredAndSortedEquipment.length > 0 && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground text-sm">
            All equipment loaded ({filteredAndSortedEquipment.length} total)
          </p>
        </div>
      )}
    </div>
  )
}
