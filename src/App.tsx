import './App.css'
import { useEffect, useState } from 'react'
import { Window as WindowType, DesktopIcon as DesktopIconType, ReferenceItem } from './types'
import { FolderView } from './components/FolderView'
import { Desktop } from './components/Desktop'
import { useWindowManagement } from './hooks/useWindowManagement'
import { useIconManagement } from './hooks/useIconManagement'
import { Language } from './types/language'
import { CVContent } from './components/CVContent'
import { ReferenceContent } from './components/ReferenceContent'
import { createReferenceItems } from './utils/referenceUtils'
import { LoadingScreen } from './components/LoadingScreen'
import { TutorialOverlay } from './components/TutorialOverlay'
import './styles/TutorialOverlay.css'
import './styles/mobile.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState<Language>('nl')
  const [showTutorial, setShowTutorial] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Check if this is the first visit and show tutorial automatically
  useEffect(() => {
    // Only check after loading is complete
    if (!isLoading) {
      const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
      if (!hasSeenTutorial) {
        // Show tutorial on first visit
        setShowTutorial(true)
      }
    }
  }, [isLoading])
  
  // Create a toggleLanguage function
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'nl' : 'en'))
  }

  // Initialize icons with useIconManagement hook
  const initialIcons: Array<DesktopIconType> = [
    { id: 'cv', title: 'resume.txt', type: 'file', position: { x: 20, y: 20 }, gridPosition: { row: 0, col: 0 } },
    { id: 'references', title: language === 'en' ? 'references' : 'referenties', type: 'folder', position: { x: 20, y: 150 }, gridPosition: { row: 1, col: 0 } }
  ]
  
  // Reference items for folder view
  const [referenceItems, setReferenceItems] = useState<ReferenceItem[]>([])
  
  // Use the icon management hook to handle drag and drop
  const { 
    icons, 
    setIcons,
    handleIconDragStart, 
    handleIconDragEnd, 
    handleIconDrop,
  } = useIconManagement({ initialIcons })
  
  // Update reference items when language changes
  useEffect(() => {
    setReferenceItems(createReferenceItems(language))
  }, [language])
  
  // Update icons when language changes
  useEffect(() => {
    const updatedIcons = icons.map(icon => {
      if (icon.id === 'references') {
        return {
          ...icon,
          title: language === 'en' ? 'references' : 'referenties'
        }
      }
      return icon
    })
    
    if (JSON.stringify(icons) !== JSON.stringify(updatedIcons)) {
      // Only update if there's an actual change
      setIcons(updatedIcons)
    }
  }, [language, icons])

  // Initialize windows with useWindowManagement hook
  const initialWindows: WindowType[] = [
    {
      id: 'cv',
      title: 'resume.txt',
      content: <CVContent language={language} />,
      position: { x: 50, y: 50 },
      isOpen: false
    },
    {
      id: 'references',
      title: language === 'en' ? 'references' : 'referenties',
      content: (
        <FolderView
          window={{
            content: null,
            id: 'references',
            title: language === 'en' ? 'references' : 'referenties',
            position: { x: 100, y: 100 },
            isOpen: false
          }}
          items={referenceItems.map(item => ({
            id: item.id,
            title: item.name,
            content: <ReferenceContent referenceItem={item} />
          }))}
          onClose={(windowId) => toggleWindow(windowId)}
          onItemClick={(itemId: string) => handleReferenceItemClick(itemId)}
        />
      ),
      position: { x: 100, y: 100 },
      isOpen: false
    }
  ]
  
  const { 
    windows, 
    setWindows,
    toggleWindow, 
    handleWindowDragStart, 
    handleWindowDrag, 
    handleWindowResize,
    createWindow
  } = useWindowManagement({ initialWindows })
  
  // Update windows when language changes
  useEffect(() => {
    setWindows(prevWindows => prevWindows.map(window => {
      if (window.id === 'references') {
        return {
          ...window,
          title: language === 'en' ? 'references' : 'referenties',
          content: (
            <FolderView
              window={{
                content: null,
                id: 'references',
                title: language === 'en' ? 'references' : 'referenties',
                position: window.position,
                isOpen: window.isOpen
              }}
              items={referenceItems.map(item => ({
                id: item.id,
                title: item.name,
                content: <ReferenceContent referenceItem={item} />
              }))}
              onClose={(windowId) => toggleWindow(windowId)}
              onItemClick={(itemId: string) => handleReferenceItemClick(itemId)}
            />
          )
        }
      } else if (window.id === 'cv') {
        // Update CV window with new language prop
        return {
          ...window,
          content: <CVContent language={language} />
        }
      }
      return window
    }))
  }, [language, referenceItems])
  
  const handleReferenceItemClick = (itemId: string) => {
    // Find the reference item by ID
    const referenceItem = referenceItems.find(item => item.id === itemId)
    if (!referenceItem) return
    
    // Check if a window for this reference already exists
    const existingWindowIndex = windows.findIndex(w => w.id.startsWith(`window-${itemId}-`))
    
    if (existingWindowIndex >= 0) {
      // Toggle existing window
      toggleWindow(windows[existingWindowIndex].id)
    } else {
      // Generate a unique window ID with timestamp and random string to ensure uniqueness
      // This prevents duplicate keys when the same reference is opened multiple times
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 8)
      const windowId = `window-${itemId}-${timestamp}-${randomStr}`
      
      // Create a new window for the reference item using our custom hook
      createWindow({
        id: windowId,
        title: referenceItem.name,
        content: <ReferenceContent referenceItem={referenceItem} />,
        position: { x: 150, y: 150 },
        isOpen: true
      })
    }
  }
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="app-container">
      {isLoading ? (
        <LoadingScreen onLoadingComplete={(selectedLanguage) => {
          setIsLoading(false)
          // Update language if user selected one
          if (selectedLanguage) {
            setLanguage(selectedLanguage)
          } else {
            // Check if there's a stored preference
            const storedLanguage = localStorage.getItem('preferredLanguage') as Language
            if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'nl')) {
              setLanguage(storedLanguage)
            }
          }
        }} />
      ) : (
        <>      
          <div className="top-buttons">
            <button className="language-toggle" onClick={toggleLanguage}>
              {language === 'en' ? 'EN' : 'NL'}
            </button>
            <button className="help-button" onClick={() => setShowTutorial(true)}>
              ?
            </button>
          </div>
          
          <Desktop
            icons={icons}
            windows={windows}
            onIconDragStart={handleIconDragStart}
            onIconClick={toggleWindow}
            onIconDragEnd={handleIconDragEnd}
            onWindowDragStart={handleWindowDragStart}
            onWindowDrag={handleWindowDrag}
            onWindowClose={toggleWindow}
            onWindowResize={handleWindowResize}
            onIconDrop={handleIconDrop}
          />
          
          <TutorialOverlay 
            language={language} 
            onClose={() => {
              setShowTutorial(false)
              // Save that user has seen the tutorial
              localStorage.setItem('hasSeenTutorial', 'true')
            }} 
            isVisible={showTutorial} 
          />
        </>
      )}
    </div>
  )
}

export default App
