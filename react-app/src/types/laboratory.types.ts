export interface Laboratory {
  id: number
  name: string
  description: string
  address: string
  createdAt: string
  updatedAt?: string
}

export interface CreateLaboratoryRequest {
  name: string
  description: string
  address: string
}
