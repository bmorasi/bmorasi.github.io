import { useEffect, useState, useRef } from 'react'
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
  
  // Reference to the input element for focusing
  const inputRef = useRef<HTMLInputElement>(null)
  
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
  
  // Focus the input field when language prompt appears
  useEffect(() => {
    if (showLanguagePrompt && !languageSelected && inputRef.current) {
      // Small delay to ensure the input is rendered
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [showLanguagePrompt, languageSelected])
  
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
          normalizedInput === 'EN' ? 'Language set to English' : 'Taal ingesteld op Nederlands'
        ])
        
        localStorage.setItem('preferredLanguage', selectedLanguage)
        
        setTimeout(() => onLoadingComplete(selectedLanguage), 1000)
      } else {
        setExecutionOutput(prev => [
          ...prev, 
          'Invalid selection. Please type "EN" or "NL" / Ongeldige selectie. Typ "EN" of "NL"'
        ])
        setLanguageInput('')
      }
    } else if (e.key === 'Backspace') {
      setLanguageInput(prev => prev.slice(0, -1))
    } else if (e.key.length === 1) {
      if (/^[a-zA-Z]$/.test(e.key)) {
        setLanguageInput(prev => (prev + e.key).slice(-2))
      }
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!showLanguagePrompt || languageSelected) return
    
    if (e.nativeEvent instanceof InputEvent && e.nativeEvent.inputType === 'insertText' && e.nativeEvent.data && /^[a-zA-Z]$/.test(e.nativeEvent.data)) {
      return;
    }
    
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z]/g, '').slice(-2)
    setLanguageInput(sanitizedValue)
  }
  
  // Focus input field when tapped on terminal (for mobile)
  const handleTerminalTap = () => {
    if (showLanguagePrompt && !languageSelected && inputRef.current) {
      inputRef.current.focus()
    }
  }
  
  return (
    <div className="loading-screen" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="terminal" onClick={handleTerminalTap}>
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
                  <input
                    ref={inputRef}
                    type="text"
                    value={languageInput}
                    onChange={handleInputChange}
                    className="hidden-input"
                    autoCapitalize="characters"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    maxLength={2}
                    aria-label="Language selection"
                    inputMode="text"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}