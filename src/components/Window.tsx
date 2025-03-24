import { FC, useState, useRef, useEffect } from 'react'
import { Window as WindowType } from '../types'

/**
 * Window component that provides a draggable and resizable window
 * with a header, content area, and resize handles.
 */
interface WindowProps {
  window: WindowType
  onDragStart: (e: React.DragEvent, windowId: string) => void
  onDrag: (e: React.DragEvent, windowId: string) => void
  onClose: (windowId: string) => void
  onResize?: (windowId: string, width: number, height: number) => void
}

type ResizeDirection = '' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

interface Position {
  x: number;
  y: number;
}

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
      const currentWidth = windowRef.current.offsetWidth;
      const currentHeight = windowRef.current.offsetHeight;
      
      setStartSize({
        width: currentWidth,
        height: currentHeight
      });
      
      windowRef.current.style.cursor = `${direction}-resize`;
    }
    
    document.addEventListener('mousemove', handleResize, { capture: true });
    document.addEventListener('mouseup', handleResizeEnd, { capture: true });
    
    handleResize(e.nativeEvent as unknown as MouseEvent);
  };
  
  const handleResize = (e: MouseEvent): void => {
    if (!resizing) return;
    
    let newWidth = startSize.width;
    let newHeight = startSize.height;
    let newX = startWindowPos.x;
    let newY = startWindowPos.y;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
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
    
    newWidth = Math.max(300, newWidth);
    newHeight = Math.max(200, newHeight);
    
    let adjustedX = window.position.x;
    let adjustedY = window.position.y;
    
    if (resizeDirection.includes('w') && newWidth > 300) {
      adjustedX = newX;
    }
    
    if (resizeDirection.includes('n') && newHeight > 200) {
      adjustedY = newY;
    }
    
    if (windowRef.current) {
      windowRef.current.style.width = `${newWidth}px`;
      windowRef.current.style.height = `${newHeight}px`;
      windowRef.current.style.left = `${adjustedX}px`;
      windowRef.current.style.top = `${adjustedY}px`;
    }
    
    if (onResize) {
      onResize(window.id, newWidth, newHeight);
      
      if (adjustedX !== window.position.x || adjustedY !== window.position.y) {
        notifyPositionChange(adjustedX, adjustedY);
      }
    }
  };
  
  const notifyPositionChange = (x: number, y: number) => {
    if (!onDrag) return;
    
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
    if (windowRef.current) {
      windowRef.current.style.cursor = 'default';
    }
    document.removeEventListener('mousemove', handleResize, { capture: true });
    document.removeEventListener('mouseup', handleResizeEnd, { capture: true });
  };
  
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResize, { capture: true });
      document.removeEventListener('mouseup', handleResizeEnd, { capture: true });
    };
  }, [resizing]);
  
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (resizing) return;
    
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
        if (windowRef.current) {
          const finalX = parseInt(windowRef.current.style.left, 10) || window.position.x;
          const finalY = parseInt(windowRef.current.style.top, 10) || window.position.y;
          
          notifyPositionChange(finalX, finalY);
        }
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };
  
  const handleHeaderTouchStart = (e: React.TouchEvent) => {
    if (resizing) return;
    
    if ((e.target as HTMLElement).closest('.window-header')) {
      const rect = windowRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const touch = e.touches[0];
      const offsetX = touch.clientX - rect.left;
      const offsetY = touch.clientY - rect.top;
      
      const handleTouchMove = (moveEvent: TouchEvent) => {
        moveEvent.preventDefault();
        const touch = moveEvent.touches[0];
        const x = touch.clientX - offsetX;
        const y = touch.clientY - offsetY;
        
        if (windowRef.current) {
          windowRef.current.style.left = `${x}px`;
          windowRef.current.style.top = `${y}px`;
        }
      };
      
      const handleTouchEnd = () => {
        if (windowRef.current) {
          const finalX = parseInt(windowRef.current.style.left, 10) || window.position.x;
          const finalY = parseInt(windowRef.current.style.top, 10) || window.position.y;
          
          notifyPositionChange(finalX, finalY);
        }
        
        document.removeEventListener('touchmove', handleTouchMove as EventListener);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
  };
  
  return (
    <div
      ref={windowRef}
      className="window"
      data-window-id={window.id}
      style={{
        left: `${window.position.x}px`,
        top: `${window.position.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        cursor: resizing ? `${resizeDirection}-resize` : 'default'
      }}
    >
      <div className="window-header" onMouseDown={handleHeaderMouseDown} onTouchStart={handleHeaderTouchStart}>
        <div className="window-title">{window.title}</div>
        <div className="window-controls">
          <div className="window-control" onClick={() => onClose(window.id)} />
        </div>
      </div>
      <div className="window-content">
        {window.content}
      </div>
      
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