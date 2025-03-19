import { Language } from '../types/language'

export type ContentTuple = [string, string, string[]]

export interface ExperienceItem {
  title: string
  date: string
  descriptions: string[]
}

export interface ReferenceItem {
  id?: string
  name: string
  titles: string[]
  contact: string
}

export interface TranslationData {
  about: Record<Language, string>
  location: Record<Language, string>
  skills: Record<Language, ContentTuple[]>
  experience: Record<Language, ContentTuple[]>
  education: Record<Language, ContentTuple[]>
  references: Record<Language, ContentTuple[]>
  projects: Record<Language, ContentTuple[]>
}

// Translation data
export const translations: TranslationData = {
  about: {
    en: "As a recent graduate in Software Engineering, I have built a strong foundation in both front- and back-end development. I am highly motivated and driven to grow both professionally and personally, pushing my introverted self to become more communicative by gaining experience in Customer Service. I have experience in a wide variety of programming languages and thrive on problem-solving and teamwork.",
    nl: "Als recent afgestudeerde in Software Engineering heb ik een sterke basis opgebouwd in zowel front- als back-end ontwikkeling. Ik ben zeer gemotiveerd en gedreven om zowel professioneel als persoonlijk te groeien, waarbij ik mijn introverte zelf push om communicatiever te worden door ervaring op te doen in klantenservice. Ik heb ervaring met een breed scala aan programmeertalen en floreer in probleemoplossing en teamwerk."
  },
  location: {
    en: "The Hague",
    nl: "'s Gravenhage"
  },
  skills: {
    en: [
      ["Technical Skills", "", [
        "Languages: JavaScript, TypeScript, Python, Java, C#",
        "Frontend: React, Vue.js, HTML5, CSS3",
        "Backend: Node.js, .NET",
        "Database: SQL, MongoDB",
        "Tools: Git, SCRUM, Agile"
      ]]
    ],
    nl: [
      ["Technische Vaardigheden", "", [
        "Talen: JavaScript, TypeScript, Python, Java, C#",
        "Frontend: React, Vue.js, HTML5, CSS3",
        "Backend: Node.js, .NET",
        "Database: SQL, MongoDB",
        "Tools: Git, SCRUM, Agile"
      ]]
    ]
  },
  experience: {
    en: [
      ["Customer Contact Employee @ KYC", "January 2024 - present", [
        "As a customer contact employee, I work with my colleagues to maintain customers in identifying personal data through digital guidance.",
        "- Soft skills: Solution-oriented, patience, customer focus, communication",
        "- Hard skills: JavaScript, HTML & CSS, TypeScript, Vue.JS, Git"
      ]],
      ["Software Engineer Intern @ Air Innovations", "October 2023 - April 2024", [
        "As a Software Engineer intern, I independently worked in an Agile environment on an interactive feature of a full-stack application where users can explore a flight simulator in a 3D environment.",
        "- Soft skills: Stress resistant, critical thinking, focused research, independent work",
        "- Hard skills: JavaScript, HTML & CSS, Three.JS, Vue.JS, Git"
      ]],
      ["Junior Software Engineer @ Air Innovations", "June 2023 - October 2023", [
        "As a Junior Software Engineer, I worked in an Agile environment on maintaining a full-stack web application used for navigating aircraft and associated components.",
        "- Soft skills: Critical communication, stress resistant, critical thinking, SCRUM",
        "- Hard skills: Python, JavaScript, HTML & CSS, Vue.JS, Git"
      ]],
      ["Software Engineer Intern @ Air Innovations", "2022 - 2022", [
        "As a Software Engineer intern, I worked on a full-stack application for a technical product that uses artificial intelligence for aircraft engine maintenance.",
        "- Soft skills: solution-oriented thinking, creative thinking",
        "- Hard skills: Python, JavaScript, HTML & CSS, Vue.JS, Git"
      ]]
    ],
    nl: [
      ["Klantcontract medewerker @ KYC", "januari 2024 - heden", [
        "Als klantcontact medewerker onderhoud ik samen met mijn collega's klanten bij het identificeren van persoonsgegevens door digitale begeleiding.",
        "- Soft skills: Oplossingsgericht, geduld, klantgerichtheid, communicatie",
        "- Hard skills: JavaScript, HTML & CSS, TypeScript, Vue.JS, Git"
      ]],
      ["Software Engineer stagiair @ Air Innovations", "oktober 2023 - april 2024", [
        "Als stagair Software Engineer heb ik zelfstandig in een Agile omgeving gewerkt aan een interactieve feature van een full-stack applicatie waarmee gebruikers in een 3D-omgeving een vliegsimuator kunnen verkennen.",
        "- Soft skills: Stressbestendig, kritisch denken, gericht research, zelfstandig werken",
        "- Hard skills: JavaScript, HTML & CSS, Three.JS, Vue.JS, Git"
      ]],
      ["Junior Software Engineer @ Air Innovations", "juni 2023 - oktober 2023", [
        "Als Junior Software Engineer heb ik in een Agile omgeving gewerkt aan het onderhouden van een full-stack webapplicatie dat gebruikt werd voor het navigeren van luchtvaartuigen en bijhorende onderdelen.",
        "- Soft skills: Kritisch communiceren, stressbestendig, kritisch denken, SCRUM",
        "- Hard skills: Python, JavaScript, HTML & CSS, Vue.JS, Git"
      ]],
      ["Software Engineer stagiaire @ Air Innovations", "2022 - 2022", [
        "Als stagiair Software Engineer heb ik aan een full-stack applicatie gewerkt aan een applicatie voor een technisch product dat kunstmatige intelligentie gebruikt om het onderhoud van vliegtuigmotoren.",
        "- Soft skills: oplossingsgericht denken, creatief denken",
        "- Hard skills: Python, JavaScript, HTML & CSS, Vue.JS, Git"
      ]]
    ]
  },
  education: {
    en: [
      ["HBO-ICT", "The Hague University of Applied Sciences, 2019-2024", [
        "Focus on Software Engineering and Development"
      ]],
      ["Languages", "", [
        "Dutch - native",
        "English - fluent",
        "Tamil - good"
      ]]
    ],
    nl: [
      ["HBO-ICT", "Haagse Hogeschool, 2019-2024", [
        "Focus op Software Engineering en Development"
      ]],
      ["Talen", "", [
        "Nederlands - moedertaal",
        "Engels - vloeiend",
        "Tamil - goed"
      ]]
    ]
  },
  references: {
    en: [
      ["Fritjoff Büttner", "", [
        "Principal Engineer @ Air Innovations",
        "+49777477047387 / fritjoff.buttner@aiir.nl"
      ]],
      ["Gertie de Jong-Sinnighe", "", [
        "Manager Identificatie en Verificatie",
        "KYC @ ING Bank",
        "+31622804750"
      ]]
    ],
    nl: [
      ["Fritjoff Büttner", "", [
        "Principal Engineer @ Air Innovations",
        "+49777477047387 / fritjoff.buttner@aiir.nl"
      ]],
      ["Gertie de Jong-Sinnighe", "", [
        "Manager Identificatie en Verificatie",
        "KYC @ ING Bank",
        "+31622804750"
      ]]
    ]
  },
  projects: {
    en: [
      ["Estanged Manor", "2022", [
        "A videogame in Unity in the theme of 3D Thriller/Puzzle on PC.",
        "- Soft skills: teamwork, effective communication",
        "- Hard skills: C#, SCRUM"
      ]],
      ["Neighborhood App", "2020-2021", [
        "Worked in a small team to create a web application where neighborhood residents can communicate with each other and organize events. Used .NET for both backend and frontend to retrieve data.",
        "- Soft skills: teamwork, effective communication",
        "- Hard skills: .NET frameworks, Bootstrap"
      ]],
      ["The Challenge", "2019-2020", [
        "Created a mobile application in Android Studio using Java and XML.",
        "- Soft skills: teamwork, effective communication",
        "- Hard skills: Android Studio, Java, XML"
      ]]
    ],
    nl: [
      ["Estanged Manor", "2022", [
        "Een programmeerspel met een 3D horror/thriller platform op PC. Hierbij is gebruik gemaakt van Unity en veel C# SCRUM.",
        "- Soft skills: teamwerk, effectieve communicatie",
        "- Hard skills: C#, SCRUM"
      ]],
      ["Buurt Applicatie", "2020-2021", [
        "In een kleine groep gewerkt aan het maken van een webapplicatie, waarbij buurtbewoners met elkaar kunnen communiceren en evenementen kunnen organiseren. Hierbij is gebruik gemaakt van .NET voor de backend en frontend om data op te halen.",
        "- Soft skills: teamwerk, effectieve communicatie",
        "- Hard skills: .NET frameworks, Bootstrap"
      ]],
      ["De Challenge", "2019-2020", [
        "Een mobiele applicatie in Android Studio gerealiseerd met gebruik van Java en XML.",
        "- Soft skills: teamwerk, effectieve communicatie",
        "- Hard skills: Android Studio, Java, XML"
      ]]
    ]
  }
}