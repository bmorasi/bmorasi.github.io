import { FC, useState, useEffect } from 'react'
import { Window as WindowType, DesktopIcon as DesktopIconType } from '../types'
import { MiniDesktop } from './MiniDesktop'

/**
 * FolderView component that displays a folder's contents
 * using a MiniDesktop component. It allows for viewing and
 * interacting with items within a folder.
 */

/**
 * Represents an item within a folder
 */
interface FolderItem {
  /** Unique identifier for the item */
  id: string
  /** Display title for the item */
  title: string
  /** Content to display when the item is opened */
  content: React.ReactNode
}

/**
 * Props for the FolderView component
 */
interface FolderViewProps {
  /** Window data object */
  window: WindowType
  /** Array of items to display in the folder */
  items: FolderItem[]
  /** Handler for window close events */
  onClose: (windowId: string) => void
  /** Handler for item click events */
  onItemClick: (itemId: string) => void
  /** Whether icon drag and drop is enabled */
  enableIconDrag?: boolean
}

export const FolderView: FC<FolderViewProps> = ({ window, items, onClose, onItemClick, enableIconDrag = false }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [miniIcons, setMiniIcons] = useState<DesktopIconType[]>([])
  const [miniWindows, setMiniWindows] = useState<WindowType[]>([])
  
  // Convert folder items to desktop icons
  useEffect(() => {
    // Calculate grid positions for icons (4 icons per row)
    const icons = items.map((item, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      
      return {
        id: item.id,
        title: item.title,
        type: 'reference' as const,
        position: { x: 20 + (col * 100), y: 20 + (row * 100) },
        gridPosition: { row, col }
      };
    });
    setMiniIcons(icons);
  }, [items])
  
  // Enable drag and drop for icons within the folder view
  const handleIconDragStart = (e: React.DragEvent, iconId: string) => {
    // If icon dragging is disabled, return early
    if (!enableIconDrag) return;
    
    const icon = miniIcons.find(i => i.id === iconId);
    if (icon) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      e.dataTransfer.setData('text/plain', `folder-icon:${iconId}`);
      
      setMiniIcons(miniIcons.map(i => {
        if (i.id === iconId) {
          return { ...i, dragOffset: { x: offsetX, y: offsetY } };
        }
        return i;
      }));
    }
  }
  
  const handleIconDragEnd = () => {
    // If icon dragging is disabled, return early
    if (!enableIconDrag) return;
    
    // Reset drag state for all icons
    setMiniIcons(miniIcons.map(icon => ({
      ...icon,
      dragOffset: undefined
    })));
  }
  
  const handleIconDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    // If icon dragging is disabled, return early
    if (!enableIconDrag) return;
    
    const data = e.dataTransfer.getData('text/plain');
    
    if (data.startsWith('folder-icon:')) {
      const iconId = data.substring(12);
      const draggedIcon = miniIcons.find(icon => icon.id === iconId);
      if (!draggedIcon) return;
      
      // Get the desktop element to calculate grid position
      const folderDesktopElement = e.currentTarget as HTMLElement;
      const rect = folderDesktopElement.getBoundingClientRect();
      // Use globalThis.window to explicitly access the global window object
      const computedStyle = globalThis.window.getComputedStyle(folderDesktopElement);
      
      // Get grid dimensions and properties
      // For folder view, we use a fixed 4-column grid
      const numColumns = 4;
      const gridGap = parseFloat(computedStyle.getPropertyValue('gap')) || 0;
      const paddingLeft = parseFloat(computedStyle.getPropertyValue('padding-left')) || 0;
      const paddingTop = parseFloat(computedStyle.getPropertyValue('padding-top')) || 0;
      
      // Calculate cell dimensions accounting for gap and padding
      const totalGapWidth = gridGap * (numColumns - 1);
      const cellWidth = (rect.width - totalGapWidth - (paddingLeft * 2)) / numColumns;
      const cellHeight = cellWidth; // Using square cells for simplicity
      
      // Calculate the grid position based on drop coordinates, accounting for padding
      const relX = e.clientX - rect.left - paddingLeft;
      const relY = e.clientY - rect.top - paddingTop;
      
      // Calculate column and row with gap consideration
      let col = 0;
      let accumulatedWidth = 0;
      for (let i = 0; i < numColumns; i++) {
        if (relX >= accumulatedWidth && relX < accumulatedWidth + cellWidth) {
          col = i;
          break;
        }
        accumulatedWidth += cellWidth + gridGap;
      }
      
      let row = 0;
      let accumulatedHeight = 0;
      let maxRows = Math.ceil(miniIcons.length / numColumns); // Ensure we have enough rows
      maxRows = Math.max(maxRows, 4); // At least 4 rows for visual consistency
      
      for (let i = 0; i < maxRows; i++) {
        if (relY >= accumulatedHeight && relY < accumulatedHeight + cellHeight) {
          row = i;
          break;
        }
        accumulatedHeight += cellHeight + gridGap;
      }
      
      // Check if the position is valid
      if (col >= 0 && col < numColumns && row >= 0) {
        // Check if there's an icon at the drop position
        const targetIcon = miniIcons.find(icon => 
          icon.id !== iconId && 
          icon.gridPosition.row === row && 
          icon.gridPosition.col === col
        )

        if (targetIcon) {
          // Swap positions with the target icon
          setMiniIcons(miniIcons.map(icon => {
            if (icon.id === iconId) {
              // Move dragged icon to target position
              return { 
                ...icon, 
                gridPosition: { row, col },
                dragOffset: undefined
              };
            } else if (icon.id === targetIcon.id) {
              // Move target icon to dragged icon's original position
              return {
                ...icon,
                gridPosition: { ...draggedIcon.gridPosition }
              };
            }
            return icon;
          }));
        } else {
          // No icon at drop position, just move the dragged icon
          setMiniIcons(miniIcons.map(icon => {
            
            if (icon.id === iconId) {
              return { 
                ...icon, 
                gridPosition: { row, col },
                dragOffset: undefined
              };
            }
            return icon;
          }));
        }
      }
    }
  }
  
  // Handle icon click to pass the event up to the parent component
  const handleIconClick = (iconId: string) => {
    const item = items.find(item => item.id === iconId)
    if (!item) return
    
    setSelectedItem(iconId)
    
    // Instead of creating a window here, pass the event up to the parent
    // This will allow the parent (App.tsx) to create the window at the main desktop level
    onItemClick(iconId)
  }
  
  // Handle window close
  const handleWindowClose = (windowId: string) => {
    setMiniWindows(miniWindows.map(w => {
      if (w.id === windowId) {
        return { ...w, isOpen: false }
      }
      return w
    }))
    
    // Also notify parent component about window close
    onClose(windowId)
  }
  
  // Handle window position update after drag or resize
  const handleWindowPositionUpdate = (windowId: string, x: number, y: number) => {
    setMiniWindows(prevWindows => prevWindows.map(w => {
      if (w.id === windowId) {
        return { ...w, position: { x, y } }
      }
      return w
    }))
  }
  
  return (
    <div className="folder-view">
      <MiniDesktop
        icons={miniIcons}
        windows={miniWindows}
        onIconClick={handleIconClick}
        onIconDragStart={handleIconDragStart}
        onIconDragEnd={handleIconDragEnd}
        onIconDrop={handleIconDrop}
        onWindowClose={handleWindowClose}
        onWindowPositionUpdate={handleWindowPositionUpdate}
        className="folder-mini-desktop"
        enableDragDrop={enableIconDrag}
      />
    </div>
  )
}