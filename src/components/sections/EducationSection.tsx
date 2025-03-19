import React from 'react'
import { translations } from '../../data/translations'
import { Language } from '../../types/language'

interface EducationSectionProps {
  language: Language
  className?: string
}

export const EducationSection: React.FC<EducationSectionProps> = ({ language, className = '' }) => {
  return (
    <section className={`education-section ${className}`}>
      <h2>Education</h2>
      <div className="education-content">
        {translations.education[language].map(([title, date, descriptions], index) => (
          <div key={index} className="education-item">
            <h3>{title}</h3>
            <p className="date">{date}</p>
            <div className="descriptions">
              {descriptions.map((desc, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: desc }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}