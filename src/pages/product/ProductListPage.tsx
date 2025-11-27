import { Link } from 'react-router-dom'
import { useInfiniteProducts } from '@/hooks/useProducts'
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
import { Plus, Search, AlertTriangle, ArrowUpDown } from 'lucide-react'
import { useState, useMemo, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import type { Product } from '@/types/product.types'
import { useTranslation } from 'react-i18next'

type SortOption = 'name' | 'expiration' | 'quantity' | 'lowStock'

export function ProductListPage() {
  const { t } = useTranslation('products')
  const { t: tCommon } = useTranslation('common')
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const products = useMemo(() => {
    const result = data?.pages.flatMap((page) => page.products) ?? []
    console.log('Products from API:', result)
    console.log('Pages data:', data?.pages)
    return result
  }, [data])

  const isExpired = (expirationDate: string) => {
    return new Date(expirationDate) < new Date()
  }

  const isLowStock = (product: Product) => {
    return product.quantity_used_in_the_last_three_months &&
           product.quantity < product.quantity_used_in_the_last_three_months
  }

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) =>
      product && product.name &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.formula?.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'expiration':
          return new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime()
        case 'quantity':
          return a.quantity - b.quantity
        case 'lowStock': {
          const aLowStock = isLowStock(a) ? 1 : 0
          const bLowStock = isLowStock(b) ? 1 : 0
          return bLowStock - aLowStock
        }
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchTerm, sortBy])

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
        <p className="text-destructive">Failed to load products</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('subtitle')}
          </p>
        </div>
        <Link to="/products/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('addProduct')}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 sm:w-auto">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={tCommon('sorting.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">{tCommon('sorting.nameAZ')}</SelectItem>
              <SelectItem value="expiration">{tCommon('sorting.expiringSoon')}</SelectItem>
              <SelectItem value="quantity">{tCommon('sorting.quantityLowToHigh')}</SelectItem>
              <SelectItem value="lowStock">{tCommon('sorting.lowStockFirst')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? t('noProductsSearch') : t('noProducts')}
            </p>
          </div>
        ) : (
          filteredAndSortedProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="block"
            >
              <div className="rounded-lg border p-6 md:hover:border-primary md:hover:shadow-lg md:transition-all md:duration-200 h-full active:bg-muted/50">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    {product.formula && (
                      <p className="text-sm text-muted-foreground">{product.formula}</p>
                    )}
                  </div>

                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('info.quantity')}:</span>
                    <span className={`text-sm font-semibold ${isLowStock(product) ? 'text-destructive' : ''}`}>
                      {product.quantity} {product.unit}
                      {isLowStock(product) && (
                        <AlertTriangle className="inline h-3 w-3 ml-1" />
                      )}
                    </span>
                  </div>

                  {product.location && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('info.location')}:</span>
                      <span className="text-sm">{product.location.name}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('info.expires')}:</span>
                    <span className={`text-sm ${isExpired(product.expiration_date) ? 'text-destructive font-semibold' : ''}`}>
                      {format(new Date(product.expiration_date), 'MMM dd, yyyy')}
                      {isExpired(product.expiration_date) && ` ${t('info.expired')}`}
                    </span>
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

      {!hasNextPage && filteredAndSortedProducts.length > 0 && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground text-sm">
            All products loaded ({filteredAndSortedProducts.length} total)
          </p>
        </div>
      )}
    </div>
  )
}
