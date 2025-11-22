export interface Sample {
  id: number
  name: string
  description?: string
  origin: string
  isolationDate: string
  latitude?: number
  longitude?: number
  subcultureMedium: string
  subcultureIntervalDays: number
  researcherId: number
  locationId: number
  tags: string[] // e.g., ["temp:25C", "photoperiod:12h", "condition:good"]
  laboratory_id: number
  createdAt: string
}

export interface DetailedSample extends Sample {
  researcherName: string
  locationName: string
  replicaCount: number
}

export interface SimpleSample {
  id: number
  name: string
  tags: string[]
}

export interface CreateSampleRequest {
  name: string
  description?: string
  origin: string
  isolationDate: string
  latitude?: number
  longitude?: number
  subcultureMedium: string
  subcultureIntervalDays: number
  researcherId: number
  locationId: number
  tags: string[]
}

export interface EditSampleRequest {
  id: number
  name: string
  description?: string
  origin: string
  isolationDate: string
  latitude?: number
  longitude?: number
  subcultureMedium: string
  subcultureIntervalDays: number
  researcherId: number
  locationId: number
  tags: string[]
}
