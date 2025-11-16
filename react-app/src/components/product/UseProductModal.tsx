import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/shared/Spinner'

interface UseProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (quantity: number) => Promise<void>
  currentQuantity: number
  unit: string
  productName: string
  isSubmitting?: boolean
}

export function UseProductModal({
  isOpen,
  onClose,
  onSubmit,
  currentQuantity,
  unit,
  productName,
  isSubmitting = false,
}: UseProductModalProps) {
  const [quantity, setQuantity] = useState<number>(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (quantity > 0 && quantity <= currentQuantity) {
      try {
        await onSubmit(quantity)
        setQuantity(0)
        onClose()
      } catch {
        // toast handled upstream; keep dialog open for correction
      }
    }
  }

  const remainingQuantity = currentQuantity - (quantity || 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Use Product</DialogTitle>
          <DialogDescription>
            Record usage of {productName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Available Quantity</Label>
              <p className="text-sm text-muted-foreground">
                {currentQuantity} {unit}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity to Use <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0.01"
                max={currentQuantity}
                value={quantity || ''}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                required
                disabled={isSubmitting}
                placeholder={`Enter amount in ${unit}`}
                autoFocus
              />
              {quantity > currentQuantity && (
                <p className="text-sm text-destructive">
                  Cannot use more than available quantity
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Remaining Quantity</Label>
              <p className={`text-sm font-semibold ${remainingQuantity < 0 ? 'text-destructive' : ''}`}>
                {remainingQuantity.toFixed(2)} {unit}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || quantity <= 0 || quantity > currentQuantity}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Recording...
                </>
              ) : (
                'Use Product'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
