import { useState, useEffect } from 'react'
import { Language } from '../types/language'

interface TutorialStep {
  id: number
  title: { en: string; nl: string }
  content: { en: string; nl: string }
  target?: string // CSS selector for the element to highlight
}

interface TutorialOverlayProps {
  language: Language
  onClose: () => void
  isVisible: boolean
}

export const TutorialOverlay = ({ language, onClose, isVisible }: TutorialOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [showTutorial, setShowTutorial] = useState(isVisible)
  
  // Reset to first step when tutorial is opened
  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0)
      setShowTutorial(true)
    } else {
      setShowTutorial(false)
    }
  }, [isVisible])
  
  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: {
        en: "Welcome to my Portfolio!",
        nl: "Welkom bij mijn Portfolio!"
      },
      content: {
        en: "This is an interactive desktop-style portfolio. Let me show you how to navigate around.",
        nl: "Dit is een interactieve desktop-stijl portfolio. Laat me je laten zien hoe je kunt navigeren."
      }
    },
    {
      id: 2,
      title: {
        en: "Desktop Icons",
        nl: "Desktop Iconen"
      },
      content: {
        en: "Click on the desktop icons to open files and folders. You can also drag them around to rearrange them.",
        nl: "Klik op de desktop iconen om bestanden en mappen te openen. Je kunt ze ook verslepen om ze te verplaatsen."
      },
      target: ".desktop-icon"
    },
    {
      id: 3,
      title: {
        en: "Windows",
        nl: "Vensters"
      },
      content: {
        en: "Windows can be dragged by their title bar, resized using the corners, and closed using the button on the top right.",
        nl: "Vensters kunnen worden versleept via de titelbalk, worden aangepast met de hoeken, en worden gesloten met de knop rechtsboven."
      },
      target: ".window"
    },
    {
      id: 4,
      title: {
        en: "Language Toggle",
        nl: "Taal Wisselen"
      },
      content: {
        en: "Click the language button in the top-right corner to switch between English and Dutch.",
        nl: "Klik op de taalknop in de rechterbovenhoek om te schakelen tussen Engels en Nederlands."
      },
      target: ".language-toggle"
    },
    {
      id: 5,
      title: {
        en: "Resume",
        nl: "CV"
      },
      content: {
        en: "Click on the resume.txt icon to view my resume with my skills, experience, and education.",
        nl: "Klik op het resume.txt icoon om mijn CV te bekijken met mijn vaardigheden, ervaring en opleiding."
      },
      target: "[data-icon-id='cv']"
    },
    {
      id: 6,
      title: {
        en: "References",
        nl: "Referenties"
      },
      content: {
        en: "Click on the references folder to view my professional references.",
        nl: "Klik op de referenties map om mijn professionele referenties te bekijken."
      },
      target: "[data-icon-id='references']"
    }
  ]
  
  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Last step, close the tutorial
      handleClose()
    }
  }
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleClose = () => {
    setShowTutorial(false)
    // Call the parent's onClose callback
    onClose()
  }
  
  const currentStepData = tutorialSteps[currentStep]
  
  // Highlight target element if specified
  useEffect(() => {
    // Only attempt to highlight if we have a target
    if (currentStepData?.target) {
      const targetElement = document.querySelector(currentStepData.target)
      if (targetElement) {
        // Add highlight class
        targetElement.classList.add('tutorial-highlight')
        
        // Clean up function to remove highlight when step changes or component unmounts
        return () => {
          targetElement.classList.remove('tutorial-highlight')
        }
      }
    }
    // Always return a cleanup function, even if empty
    return () => {}
  }, [currentStep, currentStepData?.target])
  
  // Additional effect to remove all highlights when tutorial is closed
  useEffect(() => {
    // Only add cleanup function when tutorial is visible
    if (showTutorial) {
      // Return cleanup function that will run when showTutorial becomes false
      return () => {
        // Remove all tutorial highlights from the document
        document.querySelectorAll('.tutorial-highlight').forEach(element => {
          element.classList.remove('tutorial-highlight')
        })
      }
    }
  }, [showTutorial])
  
  // If tutorial is not visible, don't render anything
  if (!showTutorial) return null
  
  return (
    <div className="tutorial-overlay">
      <div className="tutorial-modal">
        <div className="tutorial-header">
          <h2>{currentStepData.title[language]}</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        <div className="tutorial-content">
          <p>{currentStepData.content[language]}</p>
        </div>
        <div className="tutorial-footer">
          <div className="step-indicator">
            {tutorialSteps.map((step, index) => (
              <div 
                key={step.id} 
                className={`step-dot ${index === currentStep ? 'active' : ''}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>
          <div className="tutorial-buttons">
            {currentStep > 0 && (
              <button className="prev-button" onClick={handlePrevStep}>
                {language === 'en' ? 'Previous' : 'Vorige'}
              </button>
            )}
            <button className="next-button" onClick={handleNextStep}>
              {currentStep < tutorialSteps.length - 1 
                ? (language === 'en' ? 'Next' : 'Volgende')
                : (language === 'en' ? 'Finish' : 'Afronden')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}