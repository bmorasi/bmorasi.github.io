import { FC } from 'react'
import { DesktopIcon as DesktopIconType } from '../types'

/**
 * DesktopIcon component that displays an icon on the desktop
 * with drag and drop functionality.
 */
interface DesktopIconProps {
  /** Icon data object */
  icon: DesktopIconType
  /** Handler for icon drag start events */
  onDragStart: (e: React.DragEvent, iconId: string) => void
  /** Handler for icon click events */
  onClick: (iconId: string) => void
  /** Handler for icon drag end events */
  onDragEnd?: () => void
}

export const DesktopIcon: FC<DesktopIconProps> = ({ icon, onDragStart, onClick, onDragEnd }) => {
  const getIconEmoji = () => {
    switch(icon.type) {
      case 'folder':
        return '📁'
      case 'reference':
        return '👤'
      default:
        return '📄'
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const handleTouchEnd = (endEvent: TouchEvent) => {
      endEvent.preventDefault();
      onClick(icon.id);
      
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
    
    const handleTouchMove = () => {
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      
      const touch = e.touches[0];
      const syntheticEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        dataTransfer: {
          setData: () => {}
        },
        preventDefault: () => {},
        stopPropagation: () => {}
      } as unknown as React.DragEvent<HTMLDivElement>;
      
      onDragStart(syntheticEvent, icon.id);
    };
    
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
  };
  
  return (
    <div
      className="desktop-icon"
      data-type={icon.type || 'file'}
      data-icon-id={icon.id}
      style={{
        gridRow: icon.gridPosition.row + 1,
        gridColumn: icon.gridPosition.col + 1
      }}
      onClick={() => onClick(icon.id)}
      draggable
      onDragStart={(e) => onDragStart(e, icon.id)}
      onDragEnd={onDragEnd}
      onTouchStart={handleTouchStart}
    >
      <div className="desktop-icon-image">
        <span>{getIconEmoji()}</span>
      </div>
      <span>{icon.title}</span>
    </div>
  )
}