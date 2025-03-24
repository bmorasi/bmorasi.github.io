import { useState, useRef, ReactNode } from 'react'
import { Window as WindowType, DesktopIcon as DesktopIconType } from '../types'
import { DesktopIcon } from './DesktopIcon'
import { Window } from './Window'


interface BaseDesktopProps {
  icons: DesktopIconType[]
  windows: WindowType[]
  onIconClick: (iconId: string) => void
  onWindowClose: (windowId: string) => void
  onIconDragStart?: (e: React.DragEvent, iconId: string) => void
  onIconDragEnd?: () => void
  onWindowDragStart?: (e: React.DragEvent, windowId: string) => void
  onWindowDrag?: (e: React.DragEvent, windowId: string) => void
  onWindowResize?: (windowId: string, width: number, height: number) => void
  onIconDragOver?: (e: React.DragEvent) => void
  onIconDrop?: (e: React.DragEvent) => void
  enableDragDrop?: boolean
  className?: string
  children?: ReactNode
}

export const BaseDesktop = ({
  icons,
  windows,
  onIconClick,
  onWindowClose,
  onIconDragStart,
  onIconDragEnd,
  onWindowDragStart,
  onWindowDrag,
  onWindowResize,
  onIconDragOver,
  onIconDrop,
  enableDragDrop = true,
  className = '',
  children
}: BaseDesktopProps) => {
  const [draggedIconId, setDraggedIconId] = useState<string | null>(null)
  const [dropIndicator, setDropIndicator] = useState<{row: number, col: number, isOccupied?: boolean, targetIconId?: string} | null>(null)
  const desktopRef = useRef<HTMLDivElement>(null)
  
  const handleIconDragStart = (e: React.DragEvent, iconId: string) => {
    if (!enableDragDrop) return
    
    setDraggedIconId(iconId)
    setDropIndicator(null)
    e.dataTransfer.setData('text/plain', `icon:${iconId}`)
    
    if (onIconDragStart) {
      onIconDragStart(e, iconId)
    }
  }
  
  const handleWindowDragStart = (e: React.DragEvent, windowId: string) => {
    if (!enableDragDrop) return
    
    const window = windows.find(w => w.id === windowId)
    if (window) {
      e.dataTransfer.setData('text/plain', windowId)
      
      if (onWindowDragStart) {
        onWindowDragStart(e, windowId)
      }
    }
  }
  
  const handleWindowDrag = (e: React.DragEvent, windowId: string) => {
    e.preventDefault()
    
    if (onWindowDrag) {
      onWindowDrag(e, windowId)
    }
  }
  
  const handleIconDragOver = (e: React.DragEvent) => {
    if (!enableDragDrop) return
    e.preventDefault()
    
    if (!draggedIconId || !desktopRef.current) return
    
    if (onIconDragOver) {
      onIconDragOver(e)
      return
    }
    
    const rect = desktopRef.current.getBoundingClientRect()
    const computedStyle = window.getComputedStyle(desktopRef.current)
    
    const gridTemplateColumns = computedStyle.getPropertyValue('grid-template-columns')
    const gridTemplateRows = computedStyle.getPropertyValue('grid-template-rows')
    
    const numColumns = gridTemplateColumns.split(' ').length
    const numRows = gridTemplateRows.split(' ').length
    
    const cellWidth = rect.width / numColumns
    const cellHeight = rect.height / numRows
    
    const relX = e.clientX - rect.left
    const relY = e.clientY - rect.top
    
    const col = Math.floor(relX / cellWidth)
    const row = Math.floor(relY / cellHeight)
    
    // Show drop indicator at valid positions for visual feedback
    if (col >= 0 && col < numColumns && row >= 0 && row < numRows) {
      const targetIcon = icons.find(icon => 
        icon.id !== draggedIconId && 
        icon.gridPosition.row === row && 
        icon.gridPosition.col === col
      )
      setDropIndicator({ 
        row, 
        col,
        isOccupied: !!targetIcon,
        targetIconId: targetIcon?.id
      })
    } else {
      setDropIndicator(null)
    }
  }
  
  const handleIconDrop = (e: React.DragEvent) => {
    if (!enableDragDrop) return
    e.preventDefault()
    
    const data = e.dataTransfer.getData('text/plain')
    
    if (data && !data.startsWith('icon:')) {
      const windowId = data
      const window = windows.find(w => w.id === windowId)
      
      if (window && onWindowDrag) {
        onWindowDrag(e, windowId)
      }
    }
    
    if (onIconDrop) {
      onIconDrop(e)
    }
    
    setDraggedIconId(null)
    setDropIndicator(null)
  }

  const handleIconDragEnd = () => {
    if (!enableDragDrop) return
    
    setDraggedIconId(null)
    setDropIndicator(null)
    
    if (onIconDragEnd) {
      onIconDragEnd()
    }
  }
  
  return (
    <div 
      className={`base-desktop ${className}`}
      ref={desktopRef}
      onDragOver={enableDragDrop ? handleIconDragOver : undefined} 
      onDrop={enableDragDrop ? handleIconDrop : undefined}
      onDragEnd={enableDragDrop ? handleIconDragEnd : undefined}
      style={{ 
        display: 'grid', 
        height: '100%', 
        minHeight: '300px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gridTemplateRows: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '10px',
        position: 'relative'
      }}>
      {children}
      
      {icons.map(icon => (
        <DesktopIcon
          key={icon.id}
          icon={icon}
          onDragStart={handleIconDragStart}
          onClick={onIconClick}
          onDragEnd={handleIconDragEnd}
        />
      ))}
      
      {enableDragDrop && dropIndicator && draggedIconId && (
        <div 
          className={`drop-indicator ${dropIndicator.isOccupied ? 'occupied' : ''}`}
          style={{
            gridRow: dropIndicator.row + 1,
            gridColumn: dropIndicator.col + 1
          }}
          data-target-icon-id={dropIndicator.targetIconId}
        />
      )}

      {windows.map(window => window.isOpen && (
        <Window
          key={window.id}
          window={window}
          onDragStart={handleWindowDragStart}
          onDrag={handleWindowDrag}
          onClose={onWindowClose}
          onResize={onWindowResize}
        />
      ))}
    </div>
  )
}