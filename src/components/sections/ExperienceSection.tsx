import React from 'react'
import { translations } from '../../data/translations'
import { Language } from '../../types/language'

interface ExperienceSectionProps {
  language: Language
  className?: string
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ language, className = '' }) => {
  return (
    <section className={`experience-section ${className}`}>
      <h2>Experience</h2>
      <div className="experience-content">
        {translations.experience[language].map(([title, date, descriptions], index) => (
          <div key={index} className="experience-item">
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