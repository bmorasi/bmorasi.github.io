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
  
  useEffect(() => {
    if (!isLoading) {
      const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
      if (!hasSeenTutorial) {
        setShowTutorial(true)
      }
    }
  }, [isLoading])
  
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'nl' : 'en'))
  }

  const initialIcons: Array<DesktopIconType> = [
    { id: 'cv', title: 'resume.txt', type: 'file', position: { x: 20, y: 20 }, gridPosition: { row: 0, col: 0 } },
    { id: 'references', title: language === 'en' ? 'references' : 'referenties', type: 'folder', position: { x: 20, y: 150 }, gridPosition: { row: 1, col: 0 } }
  ]
  
  const [referenceItems, setReferenceItems] = useState<ReferenceItem[]>([])
  const { 
    icons, 
    setIcons,
    handleIconDragStart, 
    handleIconDragEnd, 
    handleIconDrop,
  } = useIconManagement({ initialIcons })
  
  useEffect(() => {
    setReferenceItems(createReferenceItems(language))
  }, [language])
  
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
      setIcons(updatedIcons)
    }
  }, [language, icons])

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
        return {
          ...window,
          content: <CVContent language={language} />
        }
      }
      return window
    }))
  }, [language, referenceItems])
  
  const handleReferenceItemClick = (itemId: string) => {
    const referenceItem = referenceItems.find(item => item.id === itemId)
    if (!referenceItem) return
    
    const existingWindowIndex = windows.findIndex(w => w.id.startsWith(`window-${itemId}-`))
    
    if (existingWindowIndex >= 0) {
      toggleWindow(windows[existingWindowIndex].id)
    } else {
      // Generate a unique window ID with timestamp and random string to ensure uniqueness
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 8)
      const windowId = `window-${itemId}-${timestamp}-${randomStr}`
      createWindow({
        id: windowId,
        title: referenceItem.name,
        content: <ReferenceContent referenceItem={referenceItem} />,
        position: { x: 150, y: 150 },
        isOpen: true
      })
    }
  }

  return (
    <div className="app-container">
      {isLoading ? (
        <LoadingScreen onLoadingComplete={(selectedLanguage) => {
          setIsLoading(false)
          if (selectedLanguage) {
            setLanguage(selectedLanguage)
          } else {
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
