import { useEffect, useState } from 'react'
import '../styles/LoadingScreen.css'
import { Language } from '../types/language'

interface LoadingScreenProps {
  onLoadingComplete: (selectedLanguage?: Language) => void
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [text, setText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [commandComplete, setCommandComplete] = useState(false)
  const [executionOutput, setExecutionOutput] = useState<string[]>([])
  const [showLanguagePrompt, setShowLanguagePrompt] = useState(false)
  const [languageInput, setLanguageInput] = useState('')
  const [languageSelected, setLanguageSelected] = useState(false)
  
  const command = 'npm run portfolio.exe'
  
  useEffect(() => {
    // Type out the command character by character
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < command.length) {
        const char = command[currentIndex]
        setText(prev => prev + char)
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setCommandComplete(true)
        
        // Add terminal-style execution output
        const outputs = [
          'Loading dependencies: React, TypeScript, Vite...',
          'Compiling modules: UI, Projects, Experience, Skills...',
          'Bundling assets and resources...',
          'Starting development server...',
          'Portfolio ready! Compiled successfully in 1.2s',
          'Please select your preferred language / Selecteer uw voorkeurstaal:',
          'Type "EN" for English / Type "NL" voor Nederlands'
        ]
        
        // Display execution outputs with delays
        let outputIndex = 0
        const outputInterval = setInterval(() => {
          if (outputIndex < outputs.length) {
            setExecutionOutput(prev => [...prev, outputs[outputIndex]])
            outputIndex++
            
            // Show language prompt after all outputs are shown
            if (outputIndex === outputs.length) {
              setShowLanguagePrompt(true)
            }
          } else {
            clearInterval(outputInterval)
          }
        }, 400)
        
        return () => clearInterval(outputInterval)
      }
    }, 100)
    
    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    
    return () => {
      clearInterval(typingInterval)
      clearInterval(cursorInterval)
    }
  }, [])
  
  // Handle language input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showLanguagePrompt || languageSelected) return
    
    if (e.key === 'Enter') {
      const normalizedInput = languageInput.trim().toUpperCase()
      if (normalizedInput === 'EN' || normalizedInput === 'NL') {
        setLanguageSelected(true)
        const selectedLanguage: Language = normalizedInput.toLowerCase() as Language
        
        // Add confirmation message
        setExecutionOutput(prev => [
          ...prev, 
          `Language set to ${normalizedInput === 'EN' ? 'English' : 'Dutch'} / Taal ingesteld op ${normalizedInput === 'EN' ? 'Engels' : 'Nederlands'}`
        ])
        
        // Store language preference in localStorage
        localStorage.setItem('preferredLanguage', selectedLanguage)
        
        // Complete loading after confirmation
        setTimeout(() => onLoadingComplete(selectedLanguage), 1000)
      } else {
        // Invalid input
        setExecutionOutput(prev => [
          ...prev, 
          'Invalid selection. Please type "EN" or "NL" / Ongeldige selectie. Typ "EN" of "NL"'
        ])
        setLanguageInput('')
      }
    } else if (e.key === 'Backspace') {
      setLanguageInput(prev => prev.slice(0, -1))
    } else if (e.key.length === 1) {
      // Only allow letters
      const isLetter = /^[a-zA-Z]$/.test(e.key)
      if (isLetter && languageInput.length < 2) {
        setLanguageInput(prev => prev + e.key)
      }
    }
  }
  
  return (
    <div className="loading-screen" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="terminal">
        <div className="terminal-header">
          <div className="terminal-title">Command Prompt</div>
        </div>
        <div className="terminal-content">
          <div className="command-line">
            <span className="prompt">C:\Users\Guest&gt;</span>
            <span className="command">{text}</span>
            {showCursor && !showLanguagePrompt && <span className="cursor">_</span>}
          </div>
          {commandComplete && (
            <div className="execution-output">
              {executionOutput.map((line, index) => (
                <div key={index} className="output-line">{line}</div>
              ))}
              {showLanguagePrompt && !languageSelected && (
                <div className="language-input-line">
                  <span className="prompt">C:\Users\Guest&gt;</span>
                  <span className="command">{languageInput}</span>
                  {showCursor && <span className="cursor">_</span>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}