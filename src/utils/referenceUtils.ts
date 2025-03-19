import { ReferenceItem } from '../types'
import { translations } from '../data/translations'
import { Language } from '../types/language'

/**
 * Creates reference items from translations data for the specified language
 */
export const createReferenceItems = (lang: Language): ReferenceItem[] => {
  return translations.references[lang].map(([name, _, titles]) => {
    const contactInfo = titles[titles.length - 1]
    const positionTitles = titles.slice(0, -1)
    
    return {
      id: `ref-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name: name,
      titles: positionTitles,
      contact: contactInfo
    }
  })
}