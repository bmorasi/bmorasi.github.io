import { ReactNode } from 'react'
import { ReferenceItem } from '../types'

interface ReferenceContentProps {
  referenceItem: ReferenceItem
  className?: string
}

export const ReferenceContent = ({ 
  referenceItem, 
  className = '' 
}: ReferenceContentProps): ReactNode => {
  return (
    <div className={`reference-content ${className}`}>
      <h3>{referenceItem.name}</h3>
      {referenceItem.titles.map((title, index) => (
        <p key={index}>{title}</p>
      ))}
      {referenceItem.contact.map((contactInfo, index) => (
        <p key={`contact-${index}`}>{contactInfo}</p>
      ))}
    </div>
  )
}