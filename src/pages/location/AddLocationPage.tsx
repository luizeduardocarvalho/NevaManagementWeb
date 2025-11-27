import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { locationService } from '@/services/locationService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/shared/Spinner'
import { toast } from 'sonner'
import { ArrowLeft, MapPin } from 'lucide-react'

export function AddLocationPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [subLocationId, setSubLocationId] = useState<string>('')

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: locationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      toast.success('Location created successfully')
      navigate('/locations')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create location')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createMutation.mutate({
      name,
      description,
      sub_location_id: subLocationId && subLocationId !== 'none' ? parseInt(subLocationId) : null,
    })
  }

  const isSubmitting = createMutation.isPending

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/locations')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add Location</h1>
          <p className="text-muted-foreground">Create a new storage location</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
          <CardDescription>Enter the details for the new location</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Cold Storage Room A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this location"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subLocation">Parent Location (Optional)</Label>
              <Select value={subLocationId} onValueChange={setSubLocationId} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a parent location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top-level location)</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Select a parent location if this is a sub-location (e.g., a shelf within a room)
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Create Location
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/locations')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
