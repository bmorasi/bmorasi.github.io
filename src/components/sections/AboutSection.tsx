import React from 'react'
import { useEffect, useState } from 'react'
import { translations } from '../../data/translations'
import { Language } from '../../types/language'

interface AboutSectionProps {
  language: Language
  className?: string
}


interface TypewriterProps {
  text: string,
  speed: any;
}

const TypewriterEffect: React.FC<TypewriterProps> = ({ text, speed }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
      const interval = setInterval(() => {

          if (index < text.length) {
              setDisplayedText((prev) => prev + text[index]);
              setIndex(index + 1);
          } else {
              clearInterval(interval);
          }
      }, speed);

      return () => clearInterval(interval);
  }, [index, text, speed]);

  return <span className="typewriter-text"><h1>{displayedText}</h1></span>;
};

export const AboutSection: React.FC<AboutSectionProps> = ({ language, className = '' }) => {
  return (
    <header className={`header ${className}`}>
      <TypewriterEffect text="Phuphirat Morasi" speed={100}/>
      <p>Software Engineer</p>
      <p>📧 phuphirat.morasi@gmail.com | 📱 +31-617601881 | 🌐 linkedin.com/in/phuphirat-morasi</p>
      <p>📍 {translations.location[language]}</p>
      <div className="profile-section">
        <p>{translations.about[language]}</p>
      </div>
    </header>
  )
}