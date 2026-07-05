export interface Memory {
  id: string
  content: string
  category: string
  timestamp: string
  entities: string[]
  datasetId: string
  confidence?: number
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  recalledMemories?: RecalledMemory[]
}

export interface RecalledMemory {
  content: string
  confidence: number
}

export interface GraphNode {
  id: string
  label: string
  type: string
  memoryCount: number
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  relationship: string
}

export interface ProfileData {
  totalMemories: number
  name: string
  categoryCounts: Record<string, number>
  topEntities: string[]
  oldestMemoryDate: string
  summary: string
}
