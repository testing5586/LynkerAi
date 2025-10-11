export type Notebook = {
  id: string
  name: string
  description?: string
  archived?: boolean
  created?: string
  updated?: string
}

export type Note = {
  id: string
  title?: string
  content?: string
  created?: string
  updated?: string
}

export type Source = {
  id: string
  title?: string
  full_text?: string
  created?: string
  updated?: string
}

