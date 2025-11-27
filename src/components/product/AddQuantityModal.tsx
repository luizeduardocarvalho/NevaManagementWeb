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

interface AddQuantityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (quantity: number) => Promise<void>
  currentQuantity: number
  unit: string
  productName: string
  isSubmitting?: boolean
}

export function AddQuantityModal({
  isOpen,
  onClose,
  onSubmit,
  currentQuantity,
  unit,
  productName,
  isSubmitting = false,
}: AddQuantityModalProps) {
  const [quantity, setQuantity] = useState<number>(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (quantity > 0) {
      try {
        await onSubmit(quantity)
        setQuantity(0)
        onClose()
      } catch {
        // toast handled upstream; keep dialog open for correction
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Quantity</DialogTitle>
          <DialogDescription>
            Add more quantity to {productName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Quantity</Label>
              <p className="text-sm text-muted-foreground">
                {currentQuantity} {unit}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity to Add <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0.01"
                value={quantity || ''}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                required
                disabled={isSubmitting}
                placeholder={`Enter amount in ${unit}`}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>New Total</Label>
              <p className="text-sm font-semibold">
                {(currentQuantity + (quantity || 0)).toFixed(2)} {unit}
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
            <Button type="submit" disabled={isSubmitting || quantity <= 0}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Adding...
                </>
              ) : (
                'Add Quantity'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
