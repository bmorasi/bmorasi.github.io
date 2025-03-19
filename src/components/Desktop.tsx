import { ReactNode } from 'react'
import { Window as WindowType, DesktopIcon as DesktopIconType } from '../types'
import { BaseDesktop } from './BaseDesktop'

/**
 * Desktop component that provides a full-featured desktop environment
 * with windows and icons. This component is a wrapper around BaseDesktop
 * that provides specific desktop functionality.
 */

interface DesktopProps {
  icons: DesktopIconType[]
  windows: WindowType[]
  onIconDragStart: (e: React.DragEvent, iconId: string) => void
  onIconClick: (iconId: string) => void
  onIconDragEnd: () => void
  onWindowDragStart: (e: React.DragEvent, windowId: string) => void
  onWindowDrag: (e: React.DragEvent, windowId: string) => void
  onWindowClose: (windowId: string) => void
  onWindowResize?: (windowId: string, width: number, height: number) => void
  onIconDragOver?: (e: React.DragEvent) => void
  onIconDrop?: (e: React.DragEvent) => void
  children?: ReactNode
  className?: string
}

export const Desktop = ({
  icons,
  windows,
  onIconDragStart,
  onIconClick,
  onIconDragEnd,
  onWindowDragStart,
  onWindowDrag,
  onWindowClose,
  onWindowResize,
  onIconDragOver,
  onIconDrop,
  children,
  className = ''
}: DesktopProps) => {
  return (
    <BaseDesktop
      icons={icons}
      windows={windows}
      onIconClick={onIconClick}
      onIconDragStart={onIconDragStart}
      onIconDragEnd={onIconDragEnd}
      onWindowDragStart={onWindowDragStart}
      onWindowDrag={onWindowDrag}
      onWindowClose={onWindowClose}
      onWindowResize={onWindowResize}
      onIconDragOver={onIconDragOver}
      onIconDrop={onIconDrop}
      enableDragDrop={true}
      className={`desktop ${className}`}
    >
      {children}
    </BaseDesktop>
  )
}