export interface Window {
  id: string
  title: string
  content: React.ReactNode
  position: { x: number; y: number }
  width?: number
  height?: number
  isOpen: boolean
  dragOffset?: { x: number; y: number }
}

export interface DesktopIcon {
  id: string
  title: string
  type?: 'file' | 'folder' | 'reference'
  position: { x: number; y: number }
  gridPosition: { row: number; col: number }
  dragOffset?: { x: number; y: number }
}

export interface ReferenceItem {
  id: string
  name: string
  titles: string[]
  contact: string
  content?: React.ReactNode
}