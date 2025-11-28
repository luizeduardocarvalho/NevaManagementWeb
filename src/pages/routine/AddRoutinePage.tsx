import { useNavigate } from 'react-router-dom'
import { useCreateRoutine } from '@/hooks/useRoutines'
import { useProducts } from '@/hooks/useProducts'
import { useEquipment } from '@/hooks/useEquipment'
import { useResearchers } from '@/hooks/useResearchers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/shared/Spinner'
import { BackArrow } from '@/components/shared/BackArrow'
import { RecurrenceBuilder } from '@/components/routine/RecurrenceBuilder'
import { Plus, Trash2, GripVertical, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CreateRoutineRequest, RecurrenceRule } from '@/types/routine.types'

interface MaterialItem {
  id: string
  productId: number
  quantity: number
}

interface EquipmentItem {
  id: string
  equipmentId: number
  estimatedDuration: number
  required: boolean
}

interface StepItem {
  id: string
  order: number
  description: string
  notes: string
}

export function AddRoutinePage() {
  const { t } = useTranslation('routines')
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const createRoutine = useCreateRoutine()
  const { data: products } = useProducts()
  const { data: equipment } = useEquipment()
  const { data: researchers, isLoading: researchersLoading } = useResearchers()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [materials, setMaterials] = useState<MaterialItem[]>([])
  const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>([])
  const [steps, setSteps] = useState<StepItem[]>([])

  // Scheduling fields
  const [scheduleType, setScheduleType] = useState<'template' | 'one_time' | 'recurring'>('template')
  const [deadline, setDeadline] = useState('')
  const [assignedUserIds, setAssignedUserIds] = useState<number[]>([])
  const [recurrence, setRecurrence] = useState<RecurrenceRule>({
    frequency: 'daily',
    interval: 1,
    startDate: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  })

  const addMaterial = () => {
    setMaterials([...materials, { id: Date.now().toString(), productId: 0, quantity: 1 }])
  }

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id))
  }

  const updateMaterial = (id: string, field: keyof MaterialItem, value: any) => {
    setMaterials(materials.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const addEquipment = () => {
    setEquipmentItems([
      ...equipmentItems,
      { id: Date.now().toString(), equipmentId: 0, estimatedDuration: 30, required: true },
    ])
  }

  const removeEquipment = (id: string) => {
    setEquipmentItems(equipmentItems.filter((e) => e.id !== id))
  }

  const updateEquipment = (id: string, field: keyof EquipmentItem, value: any) => {
    setEquipmentItems(equipmentItems.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  const addStep = () => {
    setSteps([
      ...steps,
      { id: Date.now().toString(), order: steps.length + 1, description: '', notes: '' },
    ])
  }

  const removeStep = (id: string) => {
    const filtered = steps.filter((s) => s.id !== id)
    // Re-order remaining steps
    const reordered = filtered.map((s, index) => ({ ...s, order: index + 1 }))
    setSteps(reordered)
  }

  const updateStep = (id: string, field: keyof StepItem, value: any) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Convert datetime-local format to RFC3339 (ISO 8601)
    // datetime-local gives us: "2025-11-28T22:10"
    // Backend expects: "2025-11-28T22:10:00Z"
    const rfc3339Deadline = deadline ? `${deadline}:00Z` : undefined

    const data: CreateRoutineRequest = {
      name,
      description,
      materials: materials
        .filter((m) => m.productId > 0)
        .map((m) => ({
          productId: m.productId,
          quantity: m.quantity,
        })),
      equipment: equipmentItems
        .filter((e) => e.equipmentId > 0)
        .map((e) => ({
          equipmentId: e.equipmentId,
          estimatedDuration: e.estimatedDuration,
          required: e.required,
        })),
      steps: steps
        .filter((s) => s.description.trim())
        .map((s) => ({
          order: s.order,
          description: s.description,
          notes: s.notes || undefined,
        })),
      scheduleType,
      deadline: scheduleType === 'one_time' ? rfc3339Deadline : undefined,
      recurrence: scheduleType === 'recurring' ? recurrence : undefined,
      assignedTo: assignedUserIds,
    }

    await createRoutine.mutateAsync(data)
    navigate('/routines')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <BackArrow to="/routines" />

      <div>
        <h1 className="text-3xl font-bold">{t('addRoutine')}</h1>
        <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('routineDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t('fields.name')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('fields.namePlaceholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('fields.description')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('fields.descriptionPlaceholder')}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle>{t('fields.scheduleType')}</CardTitle>
            <CardDescription>Configure when this routine should be executed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scheduleType">{t('fields.scheduleType')}</Label>
              <Select
                value={scheduleType}
                onValueChange={(value: any) => setScheduleType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template">{t('fields.scheduleTypeTemplate')}</SelectItem>
                  <SelectItem value="one_time">{t('fields.scheduleTypeOneTime')}</SelectItem>
                  <SelectItem value="recurring">{t('fields.scheduleTypeRecurring')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {scheduleType === 'one_time' && (
              <div className="space-y-2">
                <Label htmlFor="deadline">
                  {t('fields.deadline')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Set the date and time when this routine must be completed
                </p>
              </div>
            )}

            {scheduleType === 'recurring' && (
              <RecurrenceBuilder recurrence={recurrence} onChange={setRecurrence} />
            )}

            {/* User Assignment */}
            {scheduleType !== 'template' && (
              <div className="space-y-2">
                <Label>{t('fields.assignTo')}</Label>
                <div className="space-y-2">
                  <Select
                    onValueChange={(value) => {
                      const userId = parseInt(value)
                      if (!assignedUserIds.includes(userId)) {
                        setAssignedUserIds([...assignedUserIds, userId])
                      }
                    }}
                    disabled={researchersLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        researchersLoading
                          ? 'Loading researchers...'
                          : researchers && researchers.length === 0
                            ? 'No researchers available'
                            : t('fields.assignToPlaceholder')
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {researchersLoading ? (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          <Spinner size="sm" className="mx-auto" />
                        </div>
                      ) : researchers && researchers.length > 0 ? (
                        researchers
                          .filter(r => r && r.id && !assignedUserIds.includes(r.id))
                          .map((researcher) => {
                            const displayName = `${researcher.first_name || ''} ${researcher.last_name || ''}`.trim() ||
                                               researcher.email ||
                                               `Researcher #${researcher.id}`
                            return (
                              <SelectItem key={researcher.id} value={researcher.id.toString()}>
                                {displayName}
                              </SelectItem>
                            )
                          })
                      ) : (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          No researchers available in this laboratory
                        </div>
                      )}
                    </SelectContent>
                  </Select>

                  {/* Selected users */}
                  {assignedUserIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {assignedUserIds.map((userId) => {
                        const user = researchers?.find(r => r.id === userId)
                        const displayName = user
                          ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Unknown'
                          : `User #${userId}`
                        return (
                          <div
                            key={userId}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-sm"
                          >
                            <span>{displayName}</span>
                            <button
                              type="button"
                              onClick={() => setAssignedUserIds(assignedUserIds.filter(id => id !== userId))}
                              className="hover:bg-primary/20 rounded p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Select users who should execute this routine
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Materials */}
        <Card>
          <CardHeader>
            <CardTitle>{t('fields.materials')}</CardTitle>
            <CardDescription>{t('stats.materialsCount', { count: materials.length })}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <Label>{t('fields.selectProduct')}</Label>
                  <Select
                    value={material.productId.toString()}
                    onValueChange={(value) =>
                      updateMaterial(material.id, 'productId', parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('fields.selectProduct')} />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.filter(product => product && product.id).map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} ({product.quantity} {product.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32 space-y-2">
                  <Label>{t('fields.quantity')}</Label>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={material.quantity}
                    onChange={(e) =>
                      updateMaterial(material.id, 'quantity', parseFloat(e.target.value))
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMaterial(material.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addMaterial} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {t('fields.addMaterial')}
            </Button>
          </CardContent>
        </Card>

        {/* Equipment */}
        <Card>
          <CardHeader>
            <CardTitle>{t('fields.equipment')}</CardTitle>
            <CardDescription>
              {t('stats.equipmentCount', { count: equipmentItems.length })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipmentItems.map((item) => (
              <div key={item.id} className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <Label>{t('fields.selectEquipment')}</Label>
                  <Select
                    value={item.equipmentId.toString()}
                    onValueChange={(value) =>
                      updateEquipment(item.id, 'equipmentId', parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('fields.selectEquipment')} />
                    </SelectTrigger>
                    <SelectContent>
                      {equipment?.filter(equip => equip && equip.id).map((equip) => (
                        <SelectItem key={equip.id} value={equip.id.toString()}>
                          {equip.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32 space-y-2">
                  <Label>{t('fields.duration')}</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.estimatedDuration}
                    onChange={(e) =>
                      updateEquipment(item.id, 'estimatedDuration', parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="flex items-center gap-2 pb-2">
                  <Checkbox
                    id={`required-${item.id}`}
                    checked={item.required}
                    onCheckedChange={(checked) =>
                      updateEquipment(item.id, 'required', !!checked)
                    }
                  />
                  <Label htmlFor={`required-${item.id}`} className="text-sm">
                    {t('fields.required')}
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEquipment(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addEquipment} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {t('fields.addEquipment')}
            </Button>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader>
            <CardTitle>{t('fields.steps')}</CardTitle>
            <CardDescription>{t('stats.stepsCount', { count: steps.length })}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex gap-3">
                <div className="flex items-start pt-9">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <span className="w-8 text-center font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Label>{t('fields.stepDescription')}</Label>
                    <Input
                      value={step.description}
                      onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                      placeholder={t('fields.stepDescription')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('fields.stepNotes')}</Label>
                    <Input
                      value={step.notes}
                      onChange={(e) => updateStep(step.id, 'notes', e.target.value)}
                      placeholder={t('fields.stepNotes')}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-9"
                  onClick={() => removeStep(step.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addStep} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {t('fields.addStep')}
            </Button>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/routines')}
            disabled={createRoutine.isPending}
          >
            {tCommon('actions.cancel')}
          </Button>
          <Button type="submit" className="flex-1" disabled={createRoutine.isPending}>
            {createRoutine.isPending ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {tCommon('actions.saving')}
              </>
            ) : (
              t('addRoutine')
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
