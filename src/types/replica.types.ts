export interface Replica {
  id: number
  name: string
  sampleId: number
  parentReplicaId?: number // for genealogy tracking when duplicated
  locationId: number
  creationDate: string
  nextTransferDate: string // calculated from creation + sample's subcultureIntervalDays
  notes?: string
  laboratory_id: number
}

export interface DetailedReplica extends Replica {
  sampleName: string
  locationName: string
  parentReplicaName?: string
  subcultureMedium: string // inherited from parent sample
  subcultureIntervalDays: number // inherited from parent sample
  researcherName: string // inherited from parent sample
}

export interface SimpleReplica {
  id: number
  name: string
  sampleId: number
}

export interface ReplicaWithTransferInfo {
  id: number
  name: string
  sampleName: string
  nextTransferDate: string
  locationName: string
  researcherName: string
  daysUntilTransfer: number
}

export interface CreateReplicaRequest {
  name: string
  sampleId: number
  parentReplicaId?: number
  locationId: number
  creationDate: string
  notes?: string
}

export interface EditReplicaRequest {
  id: number
  name: string
  locationId: number
  nextTransferDate: string
  notes?: string
}
