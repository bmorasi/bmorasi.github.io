import { ReferenceItem } from '../types'
import { translations } from '../data/translations'
import { Language } from '../types/language'

// Map to store stable IDs for references across language changes
const referenceIdMap = new Map<string, string>()

/**
 * Creates reference items from translations data for the specified language
 */
export const createReferenceItems = (lang: Language): ReferenceItem[] => {
  return translations.references[lang].map(([name, _, titles], index) => {
    // Extract the last item as contact information
    const contactInfo = titles.slice(-1)
    const positionTitles = titles.slice(0, -1)
    
    // Create a stable key for this reference that doesn't change with language
    // Using index as the stable identifier since the order of references should be consistent
    const stableKey = `reference-${index}`
    
    // Check if we already have an ID for this reference
    let uniqueId = referenceIdMap.get(stableKey)
    if (!uniqueId) {
      // If not, generate a new unique ID that will remain stable
      uniqueId = `ref-${name.toLowerCase().replace(/\s+/g, '-')}-${index}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
      referenceIdMap.set(stableKey, uniqueId)
    }
    
    return {
      id: uniqueId,
      name: name,
      titles: positionTitles,
      contact: contactInfo
    }
  })
}