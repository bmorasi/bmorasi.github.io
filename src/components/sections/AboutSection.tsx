import React from 'react'
import { translations } from '../../data/translations'
import { Language } from '../../types/language'

interface AboutSectionProps {
  language: Language
  className?: string
}

export const AboutSection: React.FC<AboutSectionProps> = ({ language, className = '' }) => {
  return (
    <header className={`header ${className}`}>
      <h1 className="typing-effect">Phuphirat Morasi</h1>
      <p>Software Engineer</p>
      <p>📧 phuphirat.morasi@gmail.com | 📱 +31-617601881 | 🌐 linkedin.com/in/phuphirat-morasi</p>
      <p>📍 {translations.location[language]}</p>
      <div className="profile-section">
        <p>{translations.about[language]}</p>
      </div>
    </header>
  )
}