export interface User {
  id: string
  name: string
  email: string
  password: string
  profile?: any
}

export interface Contact {
  id: string
  userId: string
  name: string
  phone: string
  email: string
}

export interface Location {
  id: string
  userId: string
  latitude: number
  longitude: number
  timestamp: Date
}

export interface Place {
  id: string
  contactId: string
  name: string
  latitude: number
  longitude: number
}
