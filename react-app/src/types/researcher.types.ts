export interface Researcher {
  id: number
  name: string
  email: string
  phone?: string
  specialization?: string
  department?: string
  laboratory_id: number
  createdAt: string
}

export interface SimpleResearcher {
  id: number
  name: string
}

export interface CreateResearcherRequest {
  name: string
  email: string
  phone?: string
  specialization?: string
  department?: string
}

export interface EditResearcherRequest {
  id: number
  name: string
  email: string
  phone?: string
  specialization?: string
  department?: string
}
