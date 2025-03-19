import { ReactNode } from 'react'
import { Window as WindowType, DesktopIcon as DesktopIconType } from '../types'
import { BaseDesktop } from './BaseDesktop'

/**
 * MiniDesktop component provides a simplified desktop environment
 * that can be embedded within other components, such as folder views.
 * It has a reduced feature set compared to the full Desktop component.
 */

/**
 * Props for the MiniDesktop component
 */
interface MiniDesktopProps {
  /** Array of desktop icons to display */
  icons: DesktopIconType[]
  /** Array of windows to display */
  windows: WindowType[]
  /** Handler for icon click events */
  onIconClick: (iconId: string) => void
  /** Handler for icon drag start events */
  onIconDragStart?: (e: React.DragEvent, iconId: string) => void
  /** Handler for icon drag end events */
  onIconDragEnd?: () => void
  /** Handler for icon drop events */
  onIconDrop?: (e: React.DragEvent) => void
  /** Handler for window close events */
  onWindowClose: (windowId: string) => void
  /** Handler for window position update events */
  onWindowPositionUpdate?: (windowId: string, x: number, y: number) => void
  /** Whether drag and drop is enabled */
  enableDragDrop?: boolean
  /** Additional CSS class name */
  className?: string
  /** Child elements */
  children?: ReactNode
}

export const MiniDesktop = ({
  icons,
  windows,
  onIconClick,
  onIconDragStart,
  onIconDragEnd,
  onIconDrop,
  onWindowClose,
  onWindowPositionUpdate,
  enableDragDrop = true,
  className = '',
  children
}: MiniDesktopProps) => {
  // Handle icon drag start
  const handleIconDragStart = (e: React.DragEvent, iconId: string) => {
    if (onIconDragStart) {
      onIconDragStart(e, iconId);
    } else {
      e.dataTransfer.setData('text/plain', `icon:${iconId}`);
    }
  };
  
  // Handle icon drag end
  const handleIconDragEnd = () => {
    if (onIconDragEnd) {
      onIconDragEnd();
    }
  };
  
  // Handle window drag start
  const handleWindowDragStart = (e: React.DragEvent, windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    if (!window) return;
    
    e.dataTransfer.setData('text/plain', windowId);
  };
  
  // Handle window drag
  const handleWindowDrag = (e: React.DragEvent, windowId: string) => {
    e.preventDefault();
    
    // Update window position if handler is provided
    if (onWindowPositionUpdate) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onWindowPositionUpdate(windowId, x, y);
    }
  };
  
  return (
    <div className={`mini-desktop-container ${className}`} style={{ height: '100%', minHeight: '300px' }}>
      <BaseDesktop
        icons={icons}
        windows={windows}
        onIconClick={onIconClick}
        onIconDragStart={handleIconDragStart}
        onIconDragEnd={handleIconDragEnd}
        onIconDrop={onIconDrop}
        onWindowDragStart={handleWindowDragStart}
        onWindowDrag={handleWindowDrag}
        onWindowClose={onWindowClose}
        onWindowResize={onWindowPositionUpdate ? 
          (windowId) => {
            // Find the window to get its current position
            const window = windows.find(w => w.id === windowId);
            if (window) {
              // Update both dimensions and maintain position
              // We need to pass the current position to ensure it's maintained
              onWindowPositionUpdate(windowId, window.position.x, window.position.y);
            }
          } : 
          undefined}
        enableDragDrop={enableDragDrop}
        className="mini-desktop-content"
      >
        {children}
      </BaseDesktop>
    </div>
  )
}