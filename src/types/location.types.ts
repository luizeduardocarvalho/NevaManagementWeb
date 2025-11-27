export interface Location {
  id: number
  name: string
  description: string
  sub_location_id: number | null
  laboratoryId?: number
}
