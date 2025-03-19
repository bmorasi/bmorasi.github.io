import React from 'react'
import { translations } from '../../data/translations'
import { Language } from '../../types/language'

interface ProjectsSectionProps {
  language: Language
  className?: string
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ language, className = '' }) => {
  return (
    <section className={`projects-section ${className}`}>
      <h2>Projects</h2>
      <div className="projects-content">
        {translations.projects[language].map(([title, date, descriptions], index) => (
          <div key={index} className="project-item">
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