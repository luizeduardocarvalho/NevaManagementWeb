import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { ArrowLeft, Save } from 'lucide-react'

export function EditLocationPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [subLocationId, setSubLocationId] = useState<string>('')

  const { data: location, isLoading } = useQuery({
    queryKey: ['location', id],
    queryFn: () => locationService.getById(parseInt(id!)),
    enabled: !!id,
  })

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.getAll(),
  })

  useEffect(() => {
    if (location) {
      setName(location.name)
      setDescription(location.description)
      setSubLocationId(location.sub_location_id ? location.sub_location_id.toString() : 'none')
    }
  }, [location])

  const updateMutation = useMutation({
    mutationFn: locationService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      queryClient.invalidateQueries({ queryKey: ['location', id] })
      toast.success('Location updated successfully')
      navigate('/locations')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update location')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!id) {
      toast.error('Location ID not found')
      return
    }

    updateMutation.mutate({
      id: parseInt(id),
      name,
      description,
      sub_location_id: subLocationId === 'none' ? null : parseInt(subLocationId),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!location) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">Location not found</h3>
        <Button className="mt-4" onClick={() => navigate('/locations')}>
          Back to Locations
        </Button>
      </div>
    )
  }

  const isSubmitting = updateMutation.isPending
  const availableParentLocations = locations.filter((loc) => loc.id !== parseInt(id!))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/locations')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Location</h1>
          <p className="text-muted-foreground">Update location details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
          <CardDescription>Update the details for this location</CardDescription>
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
                  {availableParentLocations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id.toString()}>
                      {loc.name}
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
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
