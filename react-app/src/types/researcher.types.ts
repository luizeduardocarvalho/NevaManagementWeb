export interface Researcher {
  id: number
  clerk_user_id: string
  email: string
  first_name: string
  last_name: string
  role: string
  status: string
  laboratory_id: number
  phone?: string
  specialization?: string
  department?: string
  createdAt?: string
}

export interface SimpleResearcher {
  id: number
  first_name: string
  last_name: string
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
