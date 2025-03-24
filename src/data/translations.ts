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
  contact: string[]
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

export const translations: TranslationData = {
  about: {
    en: "As a recent graduate in Software Engineering, I have built a strong foundation in both front- and back-end development. I am highly motivated and driven to grow both professionally and personally, pushing my introverted self to become more communicative by gaining experience in Customer Service. I have experience in a wide variety of programming languages and thrive on problem-solving and teamwork.",
    nl: "Als recent afgestudeerde in Software Engineering heb ik een sterke basis opgebouwd in zowel front- als back-end ontwikkeling. Ik ben zeer gemotiveerd en gedreven om zowel professioneel als persoonlijk te groeien, waarbij ik mijn introverte zelf push om communicatiever te worden door ervaring op te doen in klantenservice. Ik heb ervaring met een breed scala aan programmeertalen. Ik ben gedreven om probleemoplossend te werken en me in te zetten in teamsverband."
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
        "Tools: Git, SCRUM, Agile",
        "Other: Salesforce, XML, Frameworks"
      ]]
    ],
    nl: [
      ["Technische Vaardigheden", "", [
        "Talen: JavaScript, TypeScript, Python, Java, C#",
        "Frontend: React, Vue.js, HTML5, CSS3",
        "Backend: Node.js, .NET",
        "Database: SQL, MongoDB",
        "Tools: Git, SCRUM, Agile",
        "Overig: Salesforce, XML, Frameworks"
      ]]
    ]
  },
  experience: {
    en: [
      ["Customer Contact Representative KYC @ NN Bank", "June 2024 - Present", [
        "As a customer contact representative, I support customers along with my colleagues in verifying personal data by providing digital guidance through a technical tool. Mastering the technology used and understanding where customers face technical difficulties is essential. I focus on customer friendliness and accuracy. Additionally, I actively contribute to system improvements by identifying and reporting issues.",
        "- Soft skills: Problem-solving, patience, customer focus, communication",
        "- Hard skills: JavaScript, HTML & CSS, TypeScript, Vue.JS, Git, Salesforce"
      ]],
      ["Software Engineer Intern @ Air Innovations", "October 2023 - April 2024", [
        "As a Software Engineer intern, I worked independently in an Agile environment on a prototype feature of a full-stack application that allows users to explore an aircraft engine in a 3D environment. The application includes interactive functionalities, such as retrieving information about specific engine components.",
        "- Soft skills: Resilience, critical thinking, targeted research, independent work",
        "- Hard skills: JavaScript, HTML & CSS, Three.JS, Vue.JS, Git"
      ]],
      ["Junior Software Engineer @ Air Innovations", "June 2023 - October 2023", [
        "As a Junior Software Engineer, I worked in an Agile environment on maintaining a full-stack web application used to integrate artificial intelligence into aircraft engine maintenance. The front-end was built using JavaScript, HTML & CSS, with a strong focus on user-friendliness for end users. The back-end was developed using Python.",
        "- Soft skills: Critical communication, resilience, critical thinking, SCRUM",
        "- Hard skills: Python, JavaScript, HTML & CSS, Vue.JS, Git"
      ]],
      ["Software Engineer Intern @ Air Innovations", "2022 - 2022", [
        "As a Software Engineer intern, I worked in an Agile environment on a new feature for an existing product that applies artificial intelligence to aircraft engine maintenance. The front-end was developed using JavaScript, HTML & CSS, with a focus on user-friendliness for end users. The back-end was built using Python and GStreamer, and the front-end and back-end were connected via REDIS. For continuous development and version control, I used GIT.",
        "- Soft skills: Problem-solving, creative thinking",
        "- Hard skills: Python, JavaScript, HTML & CSS, Vue.JS, Git"
      ]]
    ],
    nl: [
      ["Klantcontact medewerker KYC @ NN Bank", "Juni 2024 - heden", [
        "Als klantcontact medewerker ondersteun ik samen met mijn collega's klanten bij het identificeren van persoonsgegevens door digitale begeleiding te bieden via een technische tooling waarbij het beheersen van de gehanteerde techniek en het inzicht hebben waar klanten technisch over struikelen van belang is. Dit doe ik met een focus op klantvriendelijkheid en nauwkeurigheid. Daarbij draag ik actief bij aan de verbetering van systemen door issues te signaleren en door te geven.",
        "- Soft skills: Oplossingsgericht, geduld, klantgerichtheid, communicatie",
        "- Hard skills: JavaScript, HTML & CSS, TypeScript, Vue.JS, Git, Salesforce"
      ]],
      ["Software Engineer Stagiair @ Air Innovations", "Oktober 2023 - April 2024", [
        "Als stagiair Software Engineer heb ik zelfstandig in een Agile omgeving gewerkt aan een prototype feature van een full-stack applicatie waarmee gebruikers in een 3D-omgeving een vliegtuigmotor kunnen verkennen. De applicatie bevat interactieve functionaliteiten, zoals het opvragen van informatie over specifieke motoronderdelen.",
        "- Soft skills: Stressbestendig, kritisch denken, gericht research, zelfstandig werken",
        "- Hard skills: JavaScript, HTML & CSS, Three.JS, Vue.JS, Git"
      ]],
      ["Junior Software Engineer @ Air Innovations", "Juni 2023 - Oktober 2023", [
        "Als Junior Software Engineer heb ik in een Agile omgeving gewerkt aan het onderhouden van een full-stack webapplicatie die gebruikt wordt voor het toevoegen van kunstmatige intelligentie aan het onderhouden van vliegtuigmotoren. In de front-end gebruik gemaakt van JavaScript, HTML & CSS, waarbij er aandacht besteed wordt aan de gebruiksvriendelijkheid voor de eindgebruikers. In de back-end gebruik gemaakt van Python.",
        "- Soft skills: Kritisch communiceren, stressbestendig, kritisch denken, SCRUM",
        "- Hard skills: Python, JavaScript, HTML & CSS, Vue.JS, Git"
      ]],
      ["Software Engineer stagiair @ Air Innovations", "2022 - 2022", [
        "Als stagiair Software Engineer heb ik in een Agile omgeving gewerkt aan een nieuwe functie voor een bestaand product dat kunstmatige intelligentie toepast op het onderhoud van vliegtuigmotoren. Voor de front-end is JavaScript, HTML en CSS gebruikt, met focus op gebruiksvriendelijkheid voor de eindgebruikers. De back-end is ontwikkeld in Python en GStreamer, en de front- en back-end zijn gekoppeld met REDIS. Voor continuous development en versiebeheer heb ik gebruik gemaakt van GIT.",
        "- Soft skills: oplossingsgericht denken, creatief denken",
        "- Hard skills: Python, JavaScript, HTML & CSS, Vue.JS, Git"
      ]]
    ]
  },
  education: {
    en: [
      ["HBO-ICT", "The Hague University of Applied Sciences, 2019-2024", [
        "Bachelor's degree in Software Engineering"
      ]],
      ["Languages", "", [
        "Dutch - fluent",
        "English - fluent",
        "Thais - good"
      ]]
    ],
    nl: [
      ["HBO-ICT", "Haagse Hogeschool, 2019-2024", [
        "Bachelor's degree in Software Engineering"
      ]],
      ["Talen", "", [
        "Nederlands - vloeiend",
        "Engels - vloeiend",
        "Thais - goed"
      ]]
    ]
  },
  references: {
    en: [
      ["Fritjoff Büttner", "", [
        "Principal Engineer @ Air Innovations",
        "+49777477047387",
        "fritjoff.buttner@aiir.nl"
      ]],
      ["Gertie de Jong-Sinnige", "", [
        "Manager Identification and Verification KYC @ NN Bank",
        "+31622804750"
      ]]
    ],
    nl: [
      ["Fritjoff Büttner", "", [
        "Principal Engineer @ Air Innovations",
        "+49777477047387",
        "fritjoff.buttner@aiir.nl"
      ]],
      ["Gertie de Jong-Sinnige", "", [
        "Manager Identificatie en Verificatie KYC @ NN Bank",
        "+31622804750"
      ]]
    ]
  },
  projects: {
    en: [
      ["Estranged Manor", "2022", [
        "Created a video game as part of a team in the genre of a 3D horror/thriller platformer for PC. Used Unity and worked in a team of 8 within an Agile environment using SCRUM.",
        "- Soft skills: teamwork, effective communication",
        "- Hard skills: C#, SCRUM"
      ]],
      ["Neighborhood Application", "2020-2021", [
        "Worked in a small team to develop a web application that allows neighborhood residents to communicate and share local experiences. Used .NET for the backend. The frontend was built using Bootstrap, HTML & CSS, with a focus on the website's user-friendliness.",
        "- Soft skills: teamwork, effective communication",
        "- Hard skills: .NET frameworks, Bootstrap"
      ]],
      ["The Challenge", "2019-2020", [
        "Developed a mobile application in Android Studio using Java and XML.",
        "- Soft skills: teamwork, effective communication",
        "- Hard skills: Android Studio, Java, XML"
      ]]
    ],
    nl: [
      ["Estranged Manor", "2022", [
        "In groepsverband een video-game gemaakt in het genre van 3D horror/thriller platformer op PC. Hierbij gebruik gemaakt van Unity, en in een groep van 8 gewerkt in een Agile omgeving met gebruik van SCRUM.",
        "- Soft skills: teamwerk, effectieve communicatie",
        "- Hard skills: C#, SCRUM"
      ]],
      ["Buurt Applicatie", "2020-2021", [
        "In een kleine groep gewerkt met het maken van een webapplicatie, waarbij buurtbewoners met elkaar kunnen communiceren en ervaringen uit de buurt kunnen delen. Gebruik gemaakt van .NET voor de backend. In de frontend is er gebruik gemaakt van Bootstrap, HTML & CSS, waarbij er rekening gehouden is met de gebruiksvriendelijkheid van de website.",
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
