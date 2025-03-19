import React from 'react'
import { Language } from '../types/language'
import { AboutSection } from './sections/AboutSection'
import { SkillsSection } from './sections/SkillsSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { EducationSection } from './sections/EducationSection'
import { ProjectsSection } from './sections/ProjectsSection'

interface CVContentProps {
  language: Language
  className?: string
}

export const CVContent: React.FC<CVContentProps> = ({ language, className = '' }) => {
  return (
    <div className={`combined-cv ${className}`}>
      <div className="grid-item"><AboutSection language={language} /></div>
      <div className="grid-item"><SkillsSection language={language} /></div>
      <div className="grid-item"><ExperienceSection language={language} /></div>
      <div className="grid-item"><EducationSection language={language} /></div>
      <div className="grid-item"><ProjectsSection language={language} /></div>
    </div>
  )
}