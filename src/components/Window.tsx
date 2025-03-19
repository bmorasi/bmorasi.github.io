import { FC, useState, useRef, useEffect } from 'react'
import { Window as WindowType } from '../types'

/**
 * Window component that provides a draggable and resizable window
 * with a header, content area, and resize handles.
 */

/**
 * Props for the Window component
 */
interface WindowProps {
  /** Window data object */
  window: WindowType
  /** Handler for window drag start events */
  onDragStart: (e: React.DragEvent, windowId: string) => void
  /** Handler for window drag events */
  onDrag: (e: React.DragEvent, windowId: string) => void
  /** Handler for window close events */
  onClose: (windowId: string) => void
  /** Handler for window resize events */
  onResize?: (windowId: string, width: number, height: number) => void
}

// Type for resize directions
type ResizeDirection = '' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

// Type for position coordinates
interface Position {
  x: number;
  y: number;
}

// Type for size dimensions
interface Size {
  width: number;
  height: number;
}

export const Window: FC<WindowProps> = ({ window, onDrag, onClose, onResize }) => {
  const [resizing, setResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>('');
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState<Size>({ width: 0, height: 0 });
  const [startWindowPos, setStartWindowPos] = useState<Position>({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  
  // Set initial width and height based on window dimensions or defaults
  const width = window.width || 800;
  const height = window.height || 600;
  
  const handleResizeStart = (e: React.MouseEvent, direction: ResizeDirection) => {
    e.preventDefault();
    e.stopPropagation();
    
    setResizing(true);
    setResizeDirection(direction);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartWindowPos({ x: window.position.x, y: window.position.y });
    
    if (windowRef.current) {
      setStartSize({
        width: windowRef.current.offsetWidth,
        height: windowRef.current.offsetHeight
      });
    }
    
    // Add event listeners for resize
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  };
  
  const handleResize = (e: MouseEvent): void => {
    if (!resizing) return;
    
    let newWidth = startSize.width;
    let newHeight = startSize.height;
    let newX = startWindowPos.x;
    let newY = startWindowPos.y;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    // Handle different resize directions
    if (resizeDirection.includes('e')) newWidth = startSize.width + deltaX;
    if (resizeDirection.includes('s')) newHeight = startSize.height + deltaY;
    if (resizeDirection.includes('w')) {
      newWidth = startSize.width - deltaX;
      newX = startWindowPos.x + deltaX;
    }
    if (resizeDirection.includes('n')) {
      newHeight = startSize.height - deltaY;
      newY = startWindowPos.y + deltaY;
    }
    
    // Apply minimum size constraints
    newWidth = Math.max(300, newWidth);
    newHeight = Math.max(200, newHeight);
    
    // Calculate position adjustments
    const adjustedX = resizeDirection.includes('w') ? newX : window.position.x;
    const adjustedY = resizeDirection.includes('n') ? newY : window.position.y;
    
    // Update window dimensions and position
    if (windowRef.current) {
      windowRef.current.style.width = `${newWidth}px`;
      windowRef.current.style.height = `${newHeight}px`;
      windowRef.current.style.left = `${adjustedX}px`;
      windowRef.current.style.top = `${adjustedY}px`;
    }
    
    // Call the onResize callback if provided
    if (onResize) {
      onResize(window.id, newWidth, newHeight);
      
      // If position has changed, update the parent component
      if (adjustedX !== window.position.x || adjustedY !== window.position.y) {
        notifyPositionChange(adjustedX, adjustedY);
      }
    }
  };
  
  const notifyPositionChange = (x: number, y: number) => {
    if (!onDrag) return;
    
    // Create a synthetic event object
    const syntheticEvent = {
      clientX: x,
      clientY: y,
      preventDefault: () => {},
      stopPropagation: () => {}
    } as unknown as React.DragEvent<Element>;
    
    onDrag(syntheticEvent, window.id);
  };
  
  const handleResizeEnd = () => {
    setResizing(false);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  };
  
  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [resizing]);
  
  // Handle window dragging via the header
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (resizing) return;
    
    // Only allow dragging from the header
    if ((e.target as HTMLElement).closest('.window-header')) {
      const rect = windowRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        const x = moveEvent.clientX - offsetX;
        const y = moveEvent.clientY - offsetY;
        
        if (windowRef.current) {
          windowRef.current.style.left = `${x}px`;
          windowRef.current.style.top = `${y}px`;
        }
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };
  
  return (
    <div
      ref={windowRef}
      className="window"
      style={{
        left: `${window.position.x}px`,
        top: `${window.position.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        cursor: resizing ? `${resizeDirection}-resize` : 'default'
      }}
    >
      <div className="window-header" onMouseDown={handleHeaderMouseDown}>
        <div className="window-title">{window.title}</div>
        <div className="window-controls">
          <div className="window-control" onClick={() => onClose(window.id)} />
        </div>
      </div>
      <div className="window-content">
        {window.content}
      </div>
      
      {/* Resize handles */}
      <div className="resize-handle resize-handle-e" onMouseDown={(e) => handleResizeStart(e, 'e')}></div>
      <div className="resize-handle resize-handle-s" onMouseDown={(e) => handleResizeStart(e, 's')}></div>
      <div className="resize-handle resize-handle-se" onMouseDown={(e) => handleResizeStart(e, 'se')}></div>
      <div className="resize-handle resize-handle-sw" onMouseDown={(e) => handleResizeStart(e, 'sw')}></div>
      <div className="resize-handle resize-handle-ne" onMouseDown={(e) => handleResizeStart(e, 'ne')}></div>
      <div className="resize-handle resize-handle-nw" onMouseDown={(e) => handleResizeStart(e, 'nw')}></div>
      <div className="resize-handle resize-handle-n" onMouseDown={(e) => handleResizeStart(e, 'n')}></div>
      <div className="resize-handle resize-handle-w" onMouseDown={(e) => handleResizeStart(e, 'w')}></div>
    </div>
  )
}