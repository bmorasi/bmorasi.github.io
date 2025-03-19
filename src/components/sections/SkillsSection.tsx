import React from 'react'
import { translations } from '../../data/translations'
import { Language } from '../../types/language'

interface SkillsSectionProps {
  language: Language
  className?: string
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ language, className = '' }) => {
  return (
    <section className={`skills-section ${className}`}>
      <h2>Skills</h2>
      <div className="skills-content">
        {translations.skills[language].map(([title, _, items], index) => (
          <div key={index} className="skill-category">
            <h3>{title}</h3>
            <ul>
              {items.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}