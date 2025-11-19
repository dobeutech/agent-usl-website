import type { Language } from '@/types/i18n'

export interface Translations {
  nav: {
    home: string
    services: string
    industries: string
    about: string
    contact: string
    apply: string
  }
  hero: {
    title: string
    subtitle: string
    ctaEmployers: string
    ctaJobSeekers: string
  }
  services: {
    title: string
    subtitle: string
    temporary: {
      title: string
      description: string
    }
    permanent: {
      title: string
      description: string
    }
    contractToHire: {
      title: string
      description: string
    }
  }
  industries: {
    title: string
    subtitle: string
    healthcare: string
    manufacturing: string
    logistics: string
    hospitality: string
    retail: string
    technology: string
    administrative: string
    finance: string
  }
  whyChooseUs: {
    title: string
    subtitle: string
    expertise: {
      title: string
      description: string
    }
    network: {
      title: string
      description: string
    }
    support: {
      title: string
      description: string
    }
    compliance: {
      title: string
      description: string
    }
  }
  applyForm: {
    title: string
    subtitle: string
    firstName: string
    lastName: string
    email: string
    phone: string
    position: string
    experience: string
    resume: string
    coverLetter: string
    submit: string
    submitting: string
    success: string
    error: string
    firstNameRequired: string
    lastNameRequired: string
    emailRequired: string
    emailInvalid: string
    phoneRequired: string
    phoneInvalid: string
    positionRequired: string
    experienceRequired: string
    resumeRequired: string
    resumeSize: string
    resumeType: string
  }
  testimonials: {
    title: string
    subtitle: string
  }
  contact: {
    title: string
    subtitle: string
    name: string
    email: string
    phone: string
    message: string
    submit: string
    submitting: string
    success: string
    error: string
    nameRequired: string
    emailRequired: string
    emailInvalid: string
    messageRequired: string
    address: string
    hours: string
    hoursValue: string
  }
  footer: {
    tagline: string
    quickLinks: string
    services: string
    contactUs: string
    followUs: string
    rights: string
  }
  theme: {
    toggle: string
    light: string
    dark: string
    system: string
  }
  language: {
    select: string
    english: string
    spanish: string
    french: string
  }
  accessibility: {
    skipToContent: string
    openMenu: string
    closeMenu: string
    languageChanged: string
    themeChanged: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      industries: 'Industries',
      about: 'About',
      contact: 'Contact',
      apply: 'Apply Now',
    },
    hero: {
      title: 'Connecting Talent with Opportunity',
      subtitle: 'Professional staffing solutions for businesses and job seekers across Maryland and the DC metro area',
      ctaEmployers: 'Find Talent',
      ctaJobSeekers: 'Find Jobs',
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive staffing solutions tailored to your needs',
      temporary: {
        title: 'Temporary Staffing',
        description: 'Flexible workforce solutions for short-term projects, seasonal demands, and temporary coverage needs',
      },
      permanent: {
        title: 'Permanent Placement',
        description: 'Find the perfect long-term fit for your organization with our comprehensive recruitment services',
      },
      contractToHire: {
        title: 'Contract-to-Hire',
        description: 'Evaluate candidates on the job before making a permanent hiring decision',
      },
    },
    industries: {
      title: 'Industries We Serve',
      subtitle: 'Specialized staffing expertise across multiple sectors',
      healthcare: 'Healthcare',
      manufacturing: 'Manufacturing',
      logistics: 'Logistics',
      hospitality: 'Hospitality',
      retail: 'Retail',
      technology: 'Technology',
      administrative: 'Administrative',
      finance: 'Finance',
    },
    whyChooseUs: {
      title: 'Why Choose Us',
      subtitle: 'Your trusted partner in staffing excellence',
      expertise: {
        title: 'Industry Expertise',
        description: 'Years of experience connecting qualified candidates with leading employers across diverse industries',
      },
      network: {
        title: 'Extensive Network',
        description: 'Access to a vast pool of pre-screened, qualified candidates ready to meet your staffing needs',
      },
      support: {
        title: 'Dedicated Support',
        description: 'Personalized service from our experienced team throughout the entire hiring process',
      },
      compliance: {
        title: 'Compliance Focused',
        description: 'Full adherence to employment laws and regulations, ensuring peace of mind for your business',
      },
    },
    applyForm: {
      title: 'Apply for a Position',
      subtitle: 'Take the first step toward your next career opportunity',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone Number',
      position: 'Position of Interest',
      experience: 'Years of Experience',
      resume: 'Resume',
      coverLetter: 'Cover Letter (Optional)',
      submit: 'Submit Application',
      submitting: 'Submitting...',
      success: 'Application submitted successfully! We will contact you soon.',
      error: 'Failed to submit application. Please try again.',
      firstNameRequired: 'First name is required',
      lastNameRequired: 'Last name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Invalid email address',
      phoneRequired: 'Phone number is required',
      phoneInvalid: 'Invalid phone number',
      positionRequired: 'Position is required',
      experienceRequired: 'Experience is required',
      resumeRequired: 'Resume is required',
      resumeSize: 'File size must be less than 5MB',
      resumeType: 'Only PDF, DOC, and DOCX files are allowed',
    },
    testimonials: {
      title: 'What Our Clients Say',
      subtitle: 'Trusted by businesses and job seekers throughout the region',
    },
    contact: {
      title: 'Get in Touch',
      subtitle: 'Let us help you find the perfect staffing solution',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      submit: 'Send Message',
      submitting: 'Sending...',
      success: 'Message sent successfully! We will get back to you soon.',
      error: 'Failed to send message. Please try again.',
      nameRequired: 'Name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Invalid email address',
      messageRequired: 'Message is required',
      address: 'Address',
      hours: 'Business Hours',
      hoursValue: 'Monday - Friday: 8:00 AM - 5:00 PM',
    },
    footer: {
      tagline: 'Connecting talent with opportunity since 2010',
      quickLinks: 'Quick Links',
      services: 'Services',
      contactUs: 'Contact Us',
      followUs: 'Follow Us',
      rights: 'All rights reserved.',
    },
    theme: {
      toggle: 'Toggle theme',
      light: 'Light mode',
      dark: 'Dark mode',
      system: 'System theme',
    },
    language: {
      select: 'Select language',
      english: 'English',
      spanish: 'Spanish',
      french: 'French',
    },
    accessibility: {
      skipToContent: 'Skip to main content',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
      languageChanged: 'Language changed to',
      themeChanged: 'Theme changed to',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      services: 'Servicios',
      industries: 'Industrias',
      about: 'Acerca de',
      contact: 'Contacto',
      apply: 'Aplicar Ahora',
    },
    hero: {
      title: 'Conectando Talento con Oportunidades',
      subtitle: 'Soluciones profesionales de personal para empresas y buscadores de empleo en Maryland y el área metropolitana de DC',
      ctaEmployers: 'Encontrar Talento',
      ctaJobSeekers: 'Encontrar Empleos',
    },
    services: {
      title: 'Nuestros Servicios',
      subtitle: 'Soluciones integrales de personal adaptadas a sus necesidades',
      temporary: {
        title: 'Personal Temporal',
        description: 'Soluciones flexibles de fuerza laboral para proyectos a corto plazo, demandas estacionales y necesidades de cobertura temporal',
      },
      permanent: {
        title: 'Colocación Permanente',
        description: 'Encuentre el ajuste perfecto a largo plazo para su organización con nuestros servicios integrales de reclutamiento',
      },
      contractToHire: {
        title: 'Contrato a Contratación',
        description: 'Evalúe candidatos en el trabajo antes de tomar una decisión de contratación permanente',
      },
    },
    industries: {
      title: 'Industrias que Atendemos',
      subtitle: 'Experiencia especializada en personal en múltiples sectores',
      healthcare: 'Salud',
      manufacturing: 'Manufactura',
      logistics: 'Logística',
      hospitality: 'Hospitalidad',
      retail: 'Minorista',
      technology: 'Tecnología',
      administrative: 'Administrativo',
      finance: 'Finanzas',
    },
    whyChooseUs: {
      title: 'Por Qué Elegirnos',
      subtitle: 'Su socio de confianza en excelencia de personal',
      expertise: {
        title: 'Experiencia en la Industria',
        description: 'Años de experiencia conectando candidatos calificados con empleadores líderes en diversas industrias',
      },
      network: {
        title: 'Red Extensa',
        description: 'Acceso a un vasto grupo de candidatos pre-evaluados y calificados listos para satisfacer sus necesidades de personal',
      },
      support: {
        title: 'Apoyo Dedicado',
        description: 'Servicio personalizado de nuestro equipo experimentado durante todo el proceso de contratación',
      },
      compliance: {
        title: 'Enfocado en el Cumplimiento',
        description: 'Cumplimiento total de las leyes y regulaciones laborales, garantizando tranquilidad para su negocio',
      },
    },
    applyForm: {
      title: 'Solicitar un Puesto',
      subtitle: 'Dé el primer paso hacia su próxima oportunidad profesional',
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo Electrónico',
      phone: 'Número de Teléfono',
      position: 'Puesto de Interés',
      experience: 'Años de Experiencia',
      resume: 'Currículum',
      coverLetter: 'Carta de Presentación (Opcional)',
      submit: 'Enviar Solicitud',
      submitting: 'Enviando...',
      success: '¡Solicitud enviada con éxito! Nos pondremos en contacto pronto.',
      error: 'Error al enviar la solicitud. Por favor, inténtelo de nuevo.',
      firstNameRequired: 'El nombre es obligatorio',
      lastNameRequired: 'El apellido es obligatorio',
      emailRequired: 'El correo electrónico es obligatorio',
      emailInvalid: 'Dirección de correo electrónico inválida',
      phoneRequired: 'El número de teléfono es obligatorio',
      phoneInvalid: 'Número de teléfono inválido',
      positionRequired: 'El puesto es obligatorio',
      experienceRequired: 'La experiencia es obligatoria',
      resumeRequired: 'El currículum es obligatorio',
      resumeSize: 'El tamaño del archivo debe ser menor a 5MB',
      resumeType: 'Solo se permiten archivos PDF, DOC y DOCX',
    },
    testimonials: {
      title: 'Lo Que Dicen Nuestros Clientes',
      subtitle: 'Confiado por empresas y buscadores de empleo en toda la región',
    },
    contact: {
      title: 'Póngase en Contacto',
      subtitle: 'Permítanos ayudarle a encontrar la solución de personal perfecta',
      name: 'Nombre',
      email: 'Correo Electrónico',
      phone: 'Teléfono',
      message: 'Mensaje',
      submit: 'Enviar Mensaje',
      submitting: 'Enviando...',
      success: '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.',
      error: 'Error al enviar el mensaje. Por favor, inténtelo de nuevo.',
      nameRequired: 'El nombre es obligatorio',
      emailRequired: 'El correo electrónico es obligatorio',
      emailInvalid: 'Dirección de correo electrónico inválida',
      messageRequired: 'El mensaje es obligatorio',
      address: 'Dirección',
      hours: 'Horario de Atención',
      hoursValue: 'Lunes - Viernes: 8:00 AM - 5:00 PM',
    },
    footer: {
      tagline: 'Conectando talento con oportunidades desde 2010',
      quickLinks: 'Enlaces Rápidos',
      services: 'Servicios',
      contactUs: 'Contáctenos',
      followUs: 'Síguenos',
      rights: 'Todos los derechos reservados.',
    },
    theme: {
      toggle: 'Cambiar tema',
      light: 'Modo claro',
      dark: 'Modo oscuro',
      system: 'Tema del sistema',
    },
    language: {
      select: 'Seleccionar idioma',
      english: 'Inglés',
      spanish: 'Español',
      french: 'Francés',
    },
    accessibility: {
      skipToContent: 'Saltar al contenido principal',
      openMenu: 'Abrir menú de navegación',
      closeMenu: 'Cerrar menú de navegación',
      languageChanged: 'Idioma cambiado a',
      themeChanged: 'Tema cambiado a',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      services: 'Services',
      industries: 'Industries',
      about: 'À Propos',
      contact: 'Contact',
      apply: 'Postuler',
    },
    hero: {
      title: 'Connecter les Talents avec les Opportunités',
      subtitle: 'Solutions professionnelles de recrutement pour les entreprises et les chercheurs d\'emploi dans le Maryland et la région métropolitaine de DC',
      ctaEmployers: 'Trouver des Talents',
      ctaJobSeekers: 'Trouver des Emplois',
    },
    services: {
      title: 'Nos Services',
      subtitle: 'Solutions de recrutement complètes adaptées à vos besoins',
      temporary: {
        title: 'Personnel Temporaire',
        description: 'Solutions flexibles de main-d\'œuvre pour les projets à court terme, les demandes saisonnières et les besoins de couverture temporaire',
      },
      permanent: {
        title: 'Placement Permanent',
        description: 'Trouvez l\'adéquation parfaite à long terme pour votre organisation avec nos services de recrutement complets',
      },
      contractToHire: {
        title: 'Contrat à Embauche',
        description: 'Évaluez les candidats sur le terrain avant de prendre une décision d\'embauche permanente',
      },
    },
    industries: {
      title: 'Industries que Nous Servons',
      subtitle: 'Expertise spécialisée en recrutement dans plusieurs secteurs',
      healthcare: 'Santé',
      manufacturing: 'Fabrication',
      logistics: 'Logistique',
      hospitality: 'Hôtellerie',
      retail: 'Commerce de Détail',
      technology: 'Technologie',
      administrative: 'Administratif',
      finance: 'Finance',
    },
    whyChooseUs: {
      title: 'Pourquoi Nous Choisir',
      subtitle: 'Votre partenaire de confiance pour l\'excellence en recrutement',
      expertise: {
        title: 'Expertise Industrielle',
        description: 'Des années d\'expérience à connecter des candidats qualifiés avec des employeurs de premier plan dans diverses industries',
      },
      network: {
        title: 'Réseau Étendu',
        description: 'Accès à un vaste bassin de candidats pré-sélectionnés et qualifiés prêts à répondre à vos besoins en personnel',
      },
      support: {
        title: 'Support Dédié',
        description: 'Service personnalisé de notre équipe expérimentée tout au long du processus de recrutement',
      },
      compliance: {
        title: 'Axé sur la Conformité',
        description: 'Respect total des lois et réglementations du travail, garantissant la tranquillité d\'esprit pour votre entreprise',
      },
    },
    applyForm: {
      title: 'Postuler pour un Poste',
      subtitle: 'Faites le premier pas vers votre prochaine opportunité de carrière',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      phone: 'Numéro de Téléphone',
      position: 'Poste d\'Intérêt',
      experience: 'Années d\'Expérience',
      resume: 'CV',
      coverLetter: 'Lettre de Motivation (Optionnel)',
      submit: 'Soumettre la Candidature',
      submitting: 'Envoi en cours...',
      success: 'Candidature soumise avec succès ! Nous vous contacterons bientôt.',
      error: 'Échec de l\'envoi de la candidature. Veuillez réessayer.',
      firstNameRequired: 'Le prénom est obligatoire',
      lastNameRequired: 'Le nom est obligatoire',
      emailRequired: 'L\'email est obligatoire',
      emailInvalid: 'Adresse email invalide',
      phoneRequired: 'Le numéro de téléphone est obligatoire',
      phoneInvalid: 'Numéro de téléphone invalide',
      positionRequired: 'Le poste est obligatoire',
      experienceRequired: 'L\'expérience est obligatoire',
      resumeRequired: 'Le CV est obligatoire',
      resumeSize: 'La taille du fichier doit être inférieure à 5 Mo',
      resumeType: 'Seuls les fichiers PDF, DOC et DOCX sont autorisés',
    },
    testimonials: {
      title: 'Ce Que Disent Nos Clients',
      subtitle: 'Fait confiance par les entreprises et les chercheurs d\'emploi dans toute la région',
    },
    contact: {
      title: 'Contactez-nous',
      subtitle: 'Laissez-nous vous aider à trouver la solution de recrutement parfaite',
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      message: 'Message',
      submit: 'Envoyer le Message',
      submitting: 'Envoi en cours...',
      success: 'Message envoyé avec succès ! Nous vous recontacterons bientôt.',
      error: 'Échec de l\'envoi du message. Veuillez réessayer.',
      nameRequired: 'Le nom est obligatoire',
      emailRequired: 'L\'email est obligatoire',
      emailInvalid: 'Adresse email invalide',
      messageRequired: 'Le message est obligatoire',
      address: 'Adresse',
      hours: 'Heures d\'Ouverture',
      hoursValue: 'Lundi - Vendredi : 8h00 - 17h00',
    },
    footer: {
      tagline: 'Connecter les talents avec les opportunités depuis 2010',
      quickLinks: 'Liens Rapides',
      services: 'Services',
      contactUs: 'Contactez-nous',
      followUs: 'Suivez-nous',
      rights: 'Tous droits réservés.',
    },
    theme: {
      toggle: 'Changer le thème',
      light: 'Mode clair',
      dark: 'Mode sombre',
      system: 'Thème du système',
    },
    language: {
      select: 'Sélectionner la langue',
      english: 'Anglais',
      spanish: 'Espagnol',
      french: 'Français',
    },
    accessibility: {
      skipToContent: 'Passer au contenu principal',
      openMenu: 'Ouvrir le menu de navigation',
      closeMenu: 'Fermer le menu de navigation',
      languageChanged: 'Langue changée en',
      themeChanged: 'Thème changé en',
    },
  },
}

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.')
  let value: unknown = translations[language]

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      console.warn(`Translation key not found: ${key} for language: ${language}`)
      return key
    }
  }

  return typeof value === 'string' ? value : key
}
