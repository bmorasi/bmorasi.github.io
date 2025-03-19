import { useState } from 'react'
import { Window as WindowType } from '../types'

interface UseWindowManagementProps {
  initialWindows: WindowType[]
}

export const useWindowManagement = ({ initialWindows }: UseWindowManagementProps) => {
  const [windows, setWindows] = useState<WindowType[]>(initialWindows)

  const toggleWindow = (windowId: string) => {
    setWindows(windows.map(window => {
      if (window.id === windowId) {
        return { ...window, isOpen: !window.isOpen }
      }
      return window
    }))
  }

  const updateWindowContent = (windowId: string, content: React.ReactNode) => {
    setWindows(prevWindows => prevWindows.map(window => {
      if (window.id === windowId) {
        return {
          ...window,
          content
        }
      }
      return window
    }))
  }

  const handleWindowDragStart = (e: React.DragEvent, windowId: string) => {
    const window = windows.find(w => w.id === windowId)
    if (window) {
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top
      e.dataTransfer.setData('text/plain', windowId)
      setWindows(windows.map(w => {
        if (w.id === windowId) {
          return { ...w, dragOffset: { x: offsetX, y: offsetY } }
        }
        return w
      }))
    }
  }

  const handleWindowDrag = (e: React.DragEvent, windowId: string) => {
    e.preventDefault()
    
    const window = windows.find(w => w.id === windowId)
    if (!window) return
    
    // Calculate new position
    const x = e.clientX
    const y = e.clientY
    
    // Update window position in state
    setWindows(windows.map(w => {
      if (w.id === windowId) {
        return { ...w, position: { x, y } }
      }
      return w
    }))
  }

  const handleWindowDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const windowId = e.dataTransfer.getData('text/plain')
    const window = windows.find(w => w.id === windowId)
    if (!window || !window.dragOffset) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - window.dragOffset.x
    const y = e.clientY - rect.top - window.dragOffset.y

    setWindows(windows.map(w => {
      if (w.id === windowId) {
        return { ...w, position: { x, y }, dragOffset: undefined }
      }
      return w
    }))
  }

  const handleWindowResize = (windowId: string, width: number, height: number) => {
    setWindows(prevWindows => prevWindows.map(w => {
      if (w.id === windowId) {
        // Preserve the window's position while updating dimensions
        return { 
          ...w, 
          width, 
          height,
          // Ensure position is maintained by creating a new object
          position: { ...w.position }
        }
      }
      return w
    }))
  }

  const createWindow = (window: Omit<WindowType, 'isOpen'> & { isOpen?: boolean }) => {
    const newWindow = {
      ...window,
      isOpen: window.isOpen !== undefined ? window.isOpen : true
    }
    
    setWindows(prevWindows => [...prevWindows, newWindow as WindowType])
    return newWindow
  }

  return {
    windows,
    setWindows,
    toggleWindow,
    updateWindowContent,
    handleWindowDragStart,
    handleWindowDrag,
    handleWindowDrop,
    handleWindowResize,
    createWindow
  }
}