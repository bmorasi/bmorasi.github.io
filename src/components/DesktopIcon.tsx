import { FC } from 'react'
import { DesktopIcon as DesktopIconType } from '../types'

/**
 * DesktopIcon component that displays an icon on the desktop
 * with drag and drop functionality.
 */

/**
 * Props for the DesktopIcon component
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
  // Determine icon emoji based on type
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

  return (
    <div
      className="desktop-icon"
      data-type={icon.type || 'file'}
      style={{
        gridRow: icon.gridPosition.row + 1,
        gridColumn: icon.gridPosition.col + 1
      }}
      onClick={() => onClick(icon.id)}
      draggable
      onDragStart={(e) => onDragStart(e, icon.id)}
      onDragEnd={onDragEnd}
    >
      <div className="desktop-icon-image">
        <span>{getIconEmoji()}</span>
      </div>
      <span>{icon.title}</span>
    </div>
  )
}