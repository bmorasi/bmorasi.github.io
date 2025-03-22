import { useState } from 'react'
import { DesktopIcon as DesktopIconType } from '../types'

interface UseIconManagementProps {
  initialIcons: DesktopIconType[]
}

export const useIconManagement = ({ initialIcons }: UseIconManagementProps) => {
  const [icons, setIcons] = useState<DesktopIconType[]>(initialIcons)

  const handleIconDragStart = (e: React.DragEvent, iconId: string) => {
    const icon = icons.find(i => i.id === iconId)
    if (icon) {
      const target = e.target as HTMLElement
      if (!target) {
        e.dataTransfer.setData('text/plain', `icon:${iconId}`)
        return
      }
      
      try {
        const rect = target.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const offsetY = e.clientY - rect.top
        e.dataTransfer.setData('text/plain', `icon:${iconId}`)
        
        setIcons(icons.map(i => {
          if (i.id === iconId) {
            return { ...i, dragOffset: { x: offsetX, y: offsetY } }
          }
          return i
        }))
      } catch (error) {
        console.warn('Error in drag start:', error)
        e.dataTransfer.setData('text/plain', `icon:${iconId}`)
      }
    }
  }

  const handleIconDragEnd = () => {
    // Reset drag state for all icons
    setIcons(icons.map(icon => ({
      ...icon,
      dragOffset: undefined
    })))
  }

  const handleIconDrop = (e: React.DragEvent) => {
    e.preventDefault()
    
    const data = e.dataTransfer.getData('text/plain')
    
    if (data.startsWith('icon:')) {
      const iconId = data.substring(5)
      const draggedIcon = icons.find(i => i.id === iconId)
      if (!draggedIcon) return
      
      // Get the desktop element to calculate grid position
      const desktopElement = e.currentTarget as HTMLElement
      const rect = desktopElement.getBoundingClientRect()
      const computedStyle = window.getComputedStyle(desktopElement)
      
      // Get grid dimensions and properties
      const gridTemplateColumns = computedStyle.getPropertyValue('grid-template-columns')
      const gridTemplateRows = computedStyle.getPropertyValue('grid-template-rows')
      const gridGap = parseFloat(computedStyle.getPropertyValue('gap')) || 0
      const paddingLeft = parseFloat(computedStyle.getPropertyValue('padding-left')) || 0
      const paddingTop = parseFloat(computedStyle.getPropertyValue('padding-top')) || 0
      
      // Parse grid template columns and rows more accurately
      const colSizes = gridTemplateColumns.trim().split(/\s+/)
      const rowSizes = gridTemplateRows.trim().split(/\s+/)
      
      const numColumns = colSizes.length
      const numRows = rowSizes.length
      
      // Calculate cell dimensions accounting for gap
      const totalGapWidth = gridGap * (numColumns - 1)
      const totalGapHeight = gridGap * (numRows - 1)
      
      const cellWidth = (rect.width - totalGapWidth - (paddingLeft * 2)) / numColumns
      const cellHeight = (rect.height - totalGapHeight - (paddingTop * 2)) / numRows
      
      // Calculate the grid position based on drop coordinates, accounting for padding and gaps
      const relX = e.clientX - rect.left - paddingLeft
      const relY = e.clientY - rect.top - paddingTop
      
      // Calculate column and row with gap consideration
      let col = 0
      let accumulatedWidth = 0
      for (let i = 0; i < numColumns; i++) {
        if (relX >= accumulatedWidth && relX < accumulatedWidth + cellWidth) {
          col = i
          break
        }
        accumulatedWidth += cellWidth + gridGap
      }
      
      let row = 0
      let accumulatedHeight = 0
      for (let i = 0; i < numRows; i++) {
        if (relY >= accumulatedHeight && relY < accumulatedHeight + cellHeight) {
          row = i
          break
        }
        accumulatedHeight += cellHeight + gridGap
      }
      
      // Check if the position is valid
      if (col >= 0 && col < numColumns && row >= 0 && row < numRows) {
        // Check if there's an icon at the drop position
        const targetIcon = icons.find(icon => 
          icon.id !== iconId && 
          icon.gridPosition.row === row && 
          icon.gridPosition.col === col
        )
        
        if (targetIcon) {
          // Swap positions with the target icon
          setIcons(icons.map(icon => {
            if (icon.id === iconId) {
              // Move dragged icon to target position
              return { 
                ...icon, 
                gridPosition: { row, col },
                dragOffset: undefined
              }
            } else if (icon.id === targetIcon.id) {
              // Move target icon to dragged icon's original position
              return {
                ...icon,
                gridPosition: { ...draggedIcon.gridPosition }
              }
            }
            return icon
          }))
        } else {
          // No icon at drop position, just move the dragged icon
          setIcons(icons.map(icon => {
            if (icon.id === iconId) {
              return { 
                ...icon, 
                gridPosition: { row, col },
                dragOffset: undefined
              }
            }
            return icon
          }))
        }
      }
    }
  }

  const handleIconClick = (iconId: string, callback?: (iconId: string) => void) => {
    if (callback) {
      callback(iconId)
    }
  }

  return {
    icons,
    setIcons,
    handleIconDragStart,
    handleIconDragEnd,
    handleIconDrop,
    handleIconClick
  }
}