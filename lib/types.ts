export type Poll = {
    id: string
    title: string
    description?: string | null
    options: Option[]
    createdAt: Date
    expiresAt?: Date | null
  }
  
  export type Option = {
    id: string
    text: string
    _count?: {
      votes: number
    }
    pollId: string
  }
  
  export type Vote = {
    id: string
    optionId: string
    createdAt: Date
  }