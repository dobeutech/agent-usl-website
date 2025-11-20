import type { Language } from '@/types/i18n'

export interface Translations {
  nav: {
    home: string
    services: string
    industries: string
    about: string
    contact: string
    apply: string
    privacy: string
    terms: string
  }
  hero: {
    title: string
    subtitle: string
    ctaEmployers: string
    ctaJobSeekers: string
    yearsExperience: string
    companiesServed: string
    placementsMade: string
    clientSatisfaction: string
  }
  services: {
    title: string
    subtitle: string
    janitorial: {
      title: string
      description: string
    }
    humanResources: {
      title: string
      description: string
    }
    retailSales: {
      title: string
      description: string
    }
    callCenter: {
      title: string
      description: string
    }
    industrial: {
      title: string
      description: string
    }
  }
  industries: {
    title: string
    subtitle: string
    servingRegions: string
    janitorial: string
    humanResources: string
    retailSales: string
    callCenter: string
    industrial: string
    janitorialDesc: string
    humanResourcesDesc: string
    retailSalesDesc: string
    callCenterDesc: string
    industrialDesc: string
  }
  whyChooseUs: {
    title: string
    subtitle: string
    description1: string
    description2: string
    keyFeatures: string
    coreValues: string
    empowerment: {
      title: string
      description: string
    }
    communityImpact: {
      title: string
      description: string
    }
    integrity: {
      title: string
      description: string
    }
    inclusivity: {
      title: string
      description: string
    }
    innovation: {
      title: string
      description: string
    }
    collaboration: {
      title: string
      description: string
    }
    resilience: {
      title: string
      description: string
    }
    serviceExcellence: {
      title: string
      description: string
    }
    portal247: {
      title: string
      description: string
    }
    transportation: {
      title: string
      description: string
    }
    safetyTraining: {
      title: string
      description: string
    }
    performanceBonuses: {
      title: string
      description: string
    }
  }
  applyForm: {
    title: string
    subtitle: string
    personalInfo: string
    professionalInfo: string
    additionalQuestions: string
    fullName: string
    email: string
    emailConfirm: string
    phone: string
    position: string
    positionsLabel: string
    selectAllApply: string
    experience: string
    resume: string
    coverLetter: string
    additionalDocs: string
    additionalDocsOptional: string
    documentType: string
    addDocument: string
    jobPostingUrl: string
    jobPostingUrlOptional: string
    linkedinProfile: string
    linkedinProfileOptional: string
    portfolioSite: string
    portfolioSiteOptional: string
    submit: string
    submitting: string
    success: string
    error: string
    uploadResume: string
    changeResume: string
    acceptedFormats: string
    privacyNotice: string
    newsletter: string
    smsNotifications: string
    newsletterLabel: string
    smsLabel: string
    selectPosition: string
    selectExperience: string
    lessThan1Year: string
    years1to2: string
    years3to5: string
    years6to10: string
    years10plus: string
  }
  cookieConsent: {
    title: string
    description: string
    acceptAll: string
    rejectAll: string
    customize: string
    savePreferences: string
    back: string
    essential: string
    essentialDesc: string
    analytics: string
    analyticsDesc: string
    marketing: string
    marketingDesc: string
    ccpaNotice: string
    learnMore: string
    privacyPolicy: string
  }
  testimonials: {
    title: string
    subtitle: string
    quote1: string
    author1: string
    role1: string
    company1: string
    quote2: string
    author2: string
    role2: string
    company2: string
    quote3: string
    author3: string
    role3: string
    company3: string
  }
  contact: {
    title: string
    subtitle: string
    fullName: string
    email: string
    phone: string
    companyName: string
    message: string
    submit: string
    submitting: string
    success: string
    error: string
    phoneLabel: string
    textLabel: string
    faxLabel: string
    emailLabel: string
    officeAddress: string
    phoneHours: string
    textDescription: string
    faxDescription: string
    emailDescription: string
    messagePlaceholder: string
  }
  footer: {
    tagline: string
    quickLinks: string
    services: string
    contactUs: string
    followUs: string
    rights: string
    privacy: string
    terms: string
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
  cookieConsent: {
    title: string
    description: string
    acceptAll: string
    rejectAll: string
    customize: string
    save: string
    necessary: string
    necessaryDesc: string
    functional: string
    functionalDesc: string
    analytics: string
    analyticsDesc: string
    marketing: string
    marketingDesc: string
    learnMore: string
    doNotSell: string
    hideDetails: string
  }
  jobs: {
    title: string
    subtitle: string
    searchTitle: string
    searchZip: string
    search: string
    loading: string
    noResults: string
    clearFilters: string
    featured: string
    applyNow: string
  }
  talentModal: {
    title: string
    subtitle: string
    description: string
    joinNow: string
    dismiss: string
    closingSoon: string
  }
  privacy: {
    title: string
    lastUpdated: string
    introduction: string
    dataCollection: {
      title: string
      content: string
    }
    cookieTracking: {
      title: string
      content: string
    }
    thirdPartySharing: {
      title: string
      content: string
    }
    dataRetention: {
      title: string
      content: string
    }
    yourRights: {
      title: string
      content: string
    }
    optOut: {
      title: string
      content: string
    }
    emailCommunications: {
      title: string
      content: string
    }
    smsCommunications: {
      title: string
      content: string
    }
    contactUs: {
      title: string
      content: string
    }
  }
  terms: {
    title: string
    lastUpdated: string
    acceptance: {
      title: string
      content: string
    }
    services: {
      title: string
      content: string
    }
    userResponsibilities: {
      title: string
      content: string
    }
    dataUsage: {
      title: string
      content: string
    }
    intellectualProperty: {
      title: string
      content: string
    }
    limitationOfLiability: {
      title: string
      content: string
    }
    modifications: {
      title: string
      content: string
    }
    governingLaw: {
      title: string
      content: string
    }
    contactUs: {
      title: string
      content: string
    }
  }
  unsubscribe: {
    title: string
    subtitle: string
    description: string
    newsletter: string
    jobNotifications: string
    smsNotifications: string
    unsubscribeButton: string
    unsubscribing: string
    successTitle: string
    successMessage: string
    resubscribe: string
    error: string
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
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    hero: {
      title: 'Where Opportunity Starts!',
      subtitle: 'Your Trusted Partner for Employment Opportunities. Serving Washington D.C., Maryland, Virginia, Illinois, Ohio, and New Jersey.',
      ctaEmployers: 'Find Talent',
      ctaJobSeekers: 'Find Jobs',
      yearsExperience: 'Years Experience',
      companiesServed: 'Companies Served',
      placementsMade: 'Placements Made',
      clientSatisfaction: 'Client Satisfaction',
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive staffing solutions tailored to your needs',
      janitorial: {
        title: 'Janitorial',
        description: 'Professional cleaning and facility maintenance services to keep your workspace spotless and welcoming.',
      },
      humanResources: {
        title: 'Human Resources',
        description: 'Comprehensive staffing and recruitment solutions to build your ideal workforce.',
      },
      retailSales: {
        title: 'Retail & Sales',
        description: 'Customer-facing retail positions and sales roles to drive your business growth.',
      },
      callCenter: {
        title: 'Call Center & Customer Service',
        description: 'Support representatives and customer service specialists to enhance client satisfaction.',
      },
      industrial: {
        title: 'Industrial & Manufacturing',
        description: 'Production workers, warehouse staff, and manufacturing positions for operational excellence.',
      },
    },
    industries: {
      title: 'Where We Serve',
      subtitle: 'Professional staffing solutions across five key industries',
      servingRegions: 'Serving Washington D.C., Maryland, Virginia, Illinois, Ohio, and New Jersey',
      janitorial: 'Janitorial',
      humanResources: 'Human Resources',
      retailSales: 'Retail & Sales',
      callCenter: 'Call Center',
      industrial: 'Industrial',
      janitorialDesc: 'Professional cleaning and maintenance',
      humanResourcesDesc: 'Staffing and recruitment solutions',
      retailSalesDesc: 'Customer-facing positions',
      callCenterDesc: 'Customer service specialists',
      industrialDesc: 'Manufacturing and warehouse',
    },
    whyChooseUs: {
      title: 'Why Choose Unique Staffing Professionals Inc.?',
      subtitle: 'Your trusted partner in staffing excellence',
      description1: 'Led by CEO Otniel Morilla, we are committed to expanding access to meaningful employment through innovative staffing solutions and local partnerships.',
      description2: 'Our community-focused approach combines comprehensive employment solutions with dedicated support services including transportation assistance, safety training programs, and performance incentives. We believe in empowering individuals and building bridges between talent and opportunity.',
      keyFeatures: 'Key Features',
      coreValues: 'Our Core Values',
      empowerment: {
        title: 'Empowerment',
        description: 'Equipping individuals with opportunities to thrive and succeed.',
      },
      communityImpact: {
        title: 'Community Impact',
        description: 'Making a positive difference in the communities we serve.',
      },
      integrity: {
        title: 'Integrity',
        description: 'Upholding honesty and ethical standards in all we do.',
      },
      inclusivity: {
        title: 'Inclusivity',
        description: 'Embracing diversity and creating opportunities for all.',
      },
      innovation: {
        title: 'Innovation',
        description: 'Continuously improving our staffing solutions and services.',
      },
      collaboration: {
        title: 'Collaboration',
        description: 'Building strong partnerships with clients and candidates.',
      },
      resilience: {
        title: 'Resilience',
        description: 'Adapting and overcoming challenges to deliver results.',
      },
      serviceExcellence: {
        title: 'Service Excellence',
        description: 'Committed to delivering outstanding service quality.',
      },
      portal247: {
        title: '24/7 Application Portal',
        description: 'Apply anytime, anywhere through our convenient online system.',
      },
      transportation: {
        title: 'Transportation Services',
        description: 'We help ensure reliable transportation for our workforce.',
      },
      safetyTraining: {
        title: 'Safety Training',
        description: 'Comprehensive training programs to keep everyone safe.',
      },
      performanceBonuses: {
        title: 'Performance Bonuses',
        description: 'Rewarding excellence and dedication in the workplace.',
      },
    },
    applyForm: {
      title: 'Join Our Talent Network',
      subtitle: 'Submit your application and let us match you with the perfect opportunity',
      personalInfo: 'Personal Information',
      professionalInfo: 'Professional Information',
      additionalQuestions: 'Additional Questions',
      fullName: 'Full Name',
      email: 'Email Address',
      emailConfirm: 'Confirm Email',
      phone: 'Phone Number',
      position: 'Position/Field of Interest',
      positionsLabel: 'Positions/Fields of Interest',
      selectAllApply: '(Select all that apply)',
      experience: 'Years of Experience',
      resume: 'Resume/CV',
      coverLetter: 'Cover Letter',
      additionalDocs: 'Additional Documents',
      additionalDocsOptional: 'Additional Documents (Optional)',
      documentType: 'Document Type',
      addDocument: 'Add Another Document',
      jobPostingUrl: 'Job Posting URL',
      jobPostingUrlOptional: 'Job Posting URL (Optional)',
      linkedinProfile: 'LinkedIn Profile',
      linkedinProfileOptional: 'LinkedIn Profile (Optional)',
      portfolioSite: 'Portfolio or Career Site',
      portfolioSiteOptional: 'Portfolio or Career Site (Optional)',
      submit: 'Submit Application',
      submitting: 'Submitting Application...',
      success: 'Application submitted successfully! We will contact you soon.',
      error: 'Failed to submit application. Please try again.',
      uploadResume: 'Upload Resume',
      changeResume: 'Change Resume',
      acceptedFormats: 'Accepted formats: PDF, DOC, DOCX (Max 5MB)',
      privacyNotice: 'By submitting this form, you agree to our privacy policy and terms of service.',
      newsletter: 'Sign up for our newsletter',
      smsNotifications: 'Receive SMS notifications for relevant job opportunities',
      newsletterLabel: 'Yes, send me newsletters with job opportunities and company updates',
      smsLabel: 'Yes, I consent to receive SMS notifications about relevant job openings',
      selectPosition: 'Select a position',
      selectExperience: 'Select years of experience',
      lessThan1Year: 'Less than 1 year',
      years1to2: '1-2 years',
      years3to5: '3-5 years',
      years6to10: '6-10 years',
      years10plus: '10+ years',
    },
    cookieConsent: {
      title: 'We Value Your Privacy',
      description: 'We use cookies to enhance your browsing experience, analyze site traffic, and provide personalized content. You can customize your preferences below.',
      acceptAll: 'Accept All Cookies',
      rejectAll: 'Reject All',
      customize: 'Customize Preferences',
      savePreferences: 'Save My Preferences',
      back: 'Back',
      essential: 'Essential Cookies',
      essentialDesc: 'These cookies are necessary for the website to function and cannot be disabled. They enable core functionality such as security, network management, and accessibility.',
      analytics: 'Analytics Cookies',
      analyticsDesc: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This includes tracking IP address, location, device type, browser information, time on page, scroll depth, and referral sources.',
      marketing: 'Marketing Cookies',
      marketingDesc: 'These cookies are used to track your activity across websites to deliver personalized advertisements and measure campaign effectiveness. This includes tracking UTM parameters, device fingerprinting, and user behavior patterns.',
      ccpaNotice: 'California Residents: You have the right to opt-out of the sale of your personal information. Click "Reject All" to exercise this right. For more information, contact us at omorilla@uniquestaffingprofessionals.com',
      learnMore: 'Learn more in our',
      privacyPolicy: 'Privacy Policy',
    },
    testimonials: {
      title: 'What Our Clients Say',
      subtitle: 'Trusted by businesses and job seekers throughout the region',
      quote1: 'Unique Staffing Professionals transformed our hiring process. They consistently deliver high-quality candidates who are not only skilled but also align perfectly with our company culture.',
      author1: 'Sarah Martinez',
      role1: 'HR Director',
      company1: 'TechVision Solutions',
      quote2: 'Working with this team has been a game-changer for our seasonal staffing needs. Their responsiveness and understanding of our industry is unmatched.',
      author2: 'Michael Chen',
      role2: 'Operations Manager',
      company2: 'Logistics Dynamics Inc.',
      quote3: 'The executive search services exceeded our expectations. They found us a VP of Sales who has transformed our entire revenue strategy. Truly exceptional work.',
      author3: 'Jennifer Foster',
      role3: 'CEO',
      company3: 'Growth Capital Partners',
    },
    contact: {
      title: 'Get in Touch',
      subtitle: 'Ready to find your next great hire or explore career opportunities? Let\'s talk.',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      companyName: 'Company Name',
      message: 'Message',
      submit: 'Send Message',
      submitting: 'Sending...',
      success: 'Message sent successfully! We will get back to you soon.',
      error: 'Failed to send message. Please try again.',
      phoneLabel: 'Phone',
      textLabel: 'Text for Work',
      faxLabel: 'Fax',
      emailLabel: 'Email',
      officeAddress: 'Office Address',
      phoneHours: 'Mon-Fri 8am-6pm',
      textDescription: 'Quick response via text',
      faxDescription: 'Document submissions',
      emailDescription: 'We\'ll respond within 24 hours',
      messagePlaceholder: 'Tell us about your staffing needs or career goals...',
    },
    footer: {
      tagline: 'Expand access to meaningful employment across the globe by delivering innovative staffing solutions, cultivating local partnerships, and empowering individuals.',
      quickLinks: 'Quick Links',
      services: 'Services',
      contactUs: 'Contact Us',
      followUs: 'Follow Us',
      rights: 'All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
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
    cookieConsent: {
      title: 'We Value Your Privacy',
      description: 'We use cookies and similar technologies to enhance your experience, analyze site traffic, and provide personalized content. You can customize your preferences below.',
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      customize: 'Customize',
      save: 'Save Preferences',
      necessary: 'Necessary Cookies',
      necessaryDesc: 'Essential for website functionality. These cannot be disabled.',
      functional: 'Functional Cookies',
      functionalDesc: 'Enable enhanced functionality and personalization.',
      analytics: 'Analytics Cookies',
      analyticsDesc: 'Help us understand how visitors interact with our website.',
      marketing: 'Marketing Cookies',
      marketingDesc: 'Used to track visitors and display relevant advertisements.',
      learnMore: 'Learn more in our Privacy Policy',
      doNotSell: 'Do Not Sell My Personal Information',
      hideDetails: 'Hide Details',
    },
    jobs: {
      title: 'Current Job Openings',
      subtitle: 'Find your next career opportunity with top employers in your area',
      searchTitle: 'Job title or category',
      searchZip: 'ZIP code',
      search: 'Search',
      loading: 'Loading jobs...',
      noResults: 'No jobs found matching your criteria',
      clearFilters: 'Clear Filters',
      featured: 'Featured',
      applyNow: 'Apply Now',
    },
    talentModal: {
      title: 'Join Our Talent Network',
      subtitle: 'Connect with top employers today',
      description: 'Get matched with opportunities that align with your skills and career goals. Our team is ready to help you take the next step in your professional journey.',
      joinNow: 'Join Now',
      dismiss: 'Maybe Later',
      closingSoon: 'This message will close automatically in',
    },
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated',
      introduction: 'Unique Staffing Professionals Inc. ("Company," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.',
      dataCollection: {
        title: 'Information We Collect',
        content: 'We collect information that you provide directly to us, including but not limited to: personal identification information (name, email address, phone number, mailing address), professional information (resume, work history, skills, references), demographic information, and any other information you choose to provide. We also automatically collect certain information about your device when you visit our website, including IP address, browser type, operating system, referring URLs, pages viewed, time spent on pages, links clicked, and other browsing behavior. We may also collect information from your internet service provider and third-party data providers to enhance our understanding of your interests and provide better service.',
      },
      cookieTracking: {
        title: 'Cookies and Tracking Technologies',
        content: 'We use cookies, web beacons, and similar tracking technologies to collect information about your browsing activities. This includes tracking which websites you visited before arriving at our site, your navigation path through our website, time spent on each page, scroll depth, mouse movements and click patterns, form interactions and completions, and your geographic location based on IP address. We may use third-party analytics services to help us understand website usage and user behavior. These technologies help us improve our website functionality, personalize your experience, and analyze trends.',
      },
      thirdPartySharing: {
        title: 'Third-Party Data Sharing and Resale',
        content: 'We may share, sell, or otherwise transfer your information to third parties for various business purposes, including but not limited to: staffing and recruitment partners, client companies seeking candidates, marketing and advertising partners, data analytics providers, background check services, and other service providers who assist us in our business operations. By using our services, you consent to the collection, use, and transfer of your information as described in this policy. We may aggregate and anonymize your data for sale to third parties for market research, business intelligence, and other commercial purposes.',
      },
      dataRetention: {
        title: 'Data Retention',
        content: 'We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Even after you request deletion of your information, we may retain certain data for legal compliance, dispute resolution, and enforcement of our agreements.',
      },
      yourRights: {
        title: 'Your Rights and Choices',
        content: 'Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your personal data, the right to restrict or object to processing, the right to data portability, and the right to withdraw consent. To exercise these rights, please contact us using the information provided below.',
      },
      optOut: {
        title: 'Opt-Out and Unsubscribe',
        content: 'You may opt out of receiving marketing communications from us at any time by clicking the unsubscribe link in our emails, visiting our unsubscribe page, or contacting us directly at omorilla@uniquestaffingprofessionals.com. Please note that even if you opt out of marketing communications, we may still send you transactional or administrative messages.',
      },
      emailCommunications: {
        title: 'Email Communications',
        content: 'By providing your email address, you consent to receive emails from us regarding job opportunities, company updates, newsletters, and marketing materials. You can unsubscribe from our email list at any time by clicking the unsubscribe link at the bottom of any email or by contacting us at omorilla@uniquestaffingprofessionals.com with the subject line "Email Unsubscribe."',
      },
      smsCommunications: {
        title: 'SMS/Text Message Communications',
        content: 'If you opt in to receive SMS notifications, you consent to receive text messages from us about relevant job opportunities, application updates, and other service-related information. Message and data rates may apply. You can opt out of SMS communications at any time by replying STOP to any text message or by contacting us at omorilla@uniquestaffingprofessionals.com with the subject line "SMS Opt-Out." Please note that opting out of SMS communications may affect our ability to provide you with timely job updates.',
      },
      contactUs: {
        title: 'Contact Us',
        content: 'If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at: omorilla@uniquestaffingprofessionals.com. We will respond to your inquiry within a reasonable timeframe.',
      },
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'Last Updated',
      acceptance: {
        title: 'Acceptance of Terms',
        content: 'By accessing or using the services provided by Unique Staffing Professionals Inc., you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
      },
      services: {
        title: 'Our Services',
        content: 'Unique Staffing Professionals Inc. provides staffing and employment services, including but not limited to candidate placement, temporary staffing, permanent placement, and contract-to-hire solutions. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without notice.',
      },
      userResponsibilities: {
        title: 'User Responsibilities',
        content: 'You agree to provide accurate, current, and complete information when using our services. You are responsible for maintaining the confidentiality of any account credentials and for all activities that occur under your account. You agree not to misuse our services, violate any laws, infringe on intellectual property rights, or engage in any fraudulent or harmful activities.',
      },
      dataUsage: {
        title: 'Data Collection and Usage',
        content: 'By using our services, you consent to our collection, use, and sharing of your information as described in our Privacy Policy. This includes the right to share your information with third parties, including client companies, business partners, and data purchasers. We may use your data for marketing purposes, business analytics, and resale to third parties for commercial purposes.',
      },
      intellectualProperty: {
        title: 'Intellectual Property',
        content: 'All content on our website, including text, graphics, logos, images, and software, is the property of Unique Staffing Professionals Inc. or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.',
      },
      limitationOfLiability: {
        title: 'Limitation of Liability',
        content: 'To the fullest extent permitted by law, Unique Staffing Professionals Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities. Our total liability shall not exceed the amount you paid us, if any, in the six months preceding the claim.',
      },
      modifications: {
        title: 'Modifications to Terms',
        content: 'We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after changes are posted constitutes acceptance of the modified terms.',
      },
      governingLaw: {
        title: 'Governing Law',
        content: 'These Terms of Service shall be governed by and construed in accordance with the laws of the State of Maryland, without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved in the courts of Maryland.',
      },
      contactUs: {
        title: 'Contact Information',
        content: 'For questions about these Terms of Service, please contact us at: omorilla@uniquestaffingprofessionals.com',
      },
    },
    unsubscribe: {
      title: 'Manage Your Communication Preferences',
      subtitle: 'Update your subscription settings',
      description: 'Choose which communications you\'d like to receive from us. You can unsubscribe from any or all of our communications below.',
      newsletter: 'Newsletter and Company Updates',
      jobNotifications: 'Job Opportunity Notifications',
      smsNotifications: 'SMS/Text Message Notifications',
      unsubscribeButton: 'Update Preferences',
      unsubscribing: 'Updating...',
      successTitle: 'Preferences Updated',
      successMessage: 'Your communication preferences have been updated successfully. You can change these settings at any time.',
      resubscribe: 'Want to hear from us again? You can resubscribe anytime.',
      error: 'Failed to update preferences. Please try again or contact us at omorilla@uniquestaffingprofessionals.com',
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
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
    },
    hero: {
      title: '¡Donde Comienza la Oportunidad!',
      subtitle: 'Su Socio de Confianza para Oportunidades de Empleo. Sirviendo a Washington D.C., Maryland, Virginia, Illinois, Ohio y Nueva Jersey.',
      ctaEmployers: 'Encontrar Talento',
      ctaJobSeekers: 'Encontrar Empleos',
      yearsExperience: 'Años de Experiencia',
      companiesServed: 'Empresas Atendidas',
      placementsMade: 'Colocaciones Realizadas',
      clientSatisfaction: 'Satisfacción del Cliente',
    },
    services: {
      title: 'Nuestros Servicios',
      subtitle: 'Soluciones integrales de personal adaptadas a sus necesidades',
      janitorial: {
        title: 'Servicios de Limpieza',
        description: 'Servicios profesionales de limpieza y mantenimiento de instalaciones para mantener su espacio de trabajo impecable y acogedor.',
      },
      humanResources: {
        title: 'Recursos Humanos',
        description: 'Soluciones integrales de personal y reclutamiento para construir su fuerza laboral ideal.',
      },
      retailSales: {
        title: 'Ventas al Por Menor',
        description: 'Posiciones de venta al por menor y roles de ventas para impulsar el crecimiento de su negocio.',
      },
      callCenter: {
        title: 'Centro de Llamadas y Servicio al Cliente',
        description: 'Representantes de soporte y especialistas en servicio al cliente para mejorar la satisfacción del cliente.',
      },
      industrial: {
        title: 'Industrial y Manufactura',
        description: 'Trabajadores de producción, personal de almacén y posiciones de manufactura para la excelencia operativa.',
      },
    },
    industries: {
      title: 'Dónde Servimos',
      subtitle: 'Soluciones profesionales de personal en cinco industrias clave',
      servingRegions: 'Sirviendo a Washington D.C., Maryland, Virginia, Illinois, Ohio y Nueva Jersey',
      janitorial: 'Servicios de Limpieza',
      humanResources: 'Recursos Humanos',
      retailSales: 'Ventas al Por Menor',
      callCenter: 'Centro de Llamadas',
      industrial: 'Industrial',
      janitorialDesc: 'Limpieza y mantenimiento profesional',
      humanResourcesDesc: 'Soluciones de personal y reclutamiento',
      retailSalesDesc: 'Posiciones de cara al cliente',
      callCenterDesc: 'Especialistas en servicio al cliente',
      industrialDesc: 'Manufactura y almacén',
    },
    whyChooseUs: {
      title: '¿Por Qué Elegir Unique Staffing Professionals Inc.?',
      subtitle: 'Su socio de confianza en excelencia de personal',
      description1: 'Dirigidos por el CEO Otniel Morilla, estamos comprometidos a expandir el acceso a empleos significativos a través de soluciones innovadoras de personal y asociaciones locales.',
      description2: 'Nuestro enfoque centrado en la comunidad combina soluciones integrales de empleo con servicios de apoyo dedicados que incluyen asistencia de transporte, programas de capacitación en seguridad e incentivos de rendimiento. Creemos en empoderar a las personas y construir puentes entre el talento y la oportunidad.',
      keyFeatures: 'Características Clave',
      coreValues: 'Nuestros Valores Fundamentales',
      empowerment: {
        title: 'Empoderamiento',
        description: 'Equipando a las personas con oportunidades para prosperar y tener éxito.',
      },
      communityImpact: {
        title: 'Impacto Comunitario',
        description: 'Haciendo una diferencia positiva en las comunidades que servimos.',
      },
      integrity: {
        title: 'Integridad',
        description: 'Manteniendo la honestidad y los estándares éticos en todo lo que hacemos.',
      },
      inclusivity: {
        title: 'Inclusividad',
        description: 'Abrazando la diversidad y creando oportunidades para todos.',
      },
      innovation: {
        title: 'Innovación',
        description: 'Mejorando continuamente nuestras soluciones y servicios de personal.',
      },
      collaboration: {
        title: 'Colaboración',
        description: 'Construyendo asociaciones sólidas con clientes y candidatos.',
      },
      resilience: {
        title: 'Resiliencia',
        description: 'Adaptándose y superando desafíos para entregar resultados.',
      },
      serviceExcellence: {
        title: 'Excelencia en el Servicio',
        description: 'Comprometidos a entregar calidad de servicio excepcional.',
      },
      portal247: {
        title: 'Portal de Solicitud 24/7',
        description: 'Aplique en cualquier momento, en cualquier lugar a través de nuestro conveniente sistema en línea.',
      },
      transportation: {
        title: 'Servicios de Transporte',
        description: 'Ayudamos a garantizar transporte confiable para nuestra fuerza laboral.',
      },
      safetyTraining: {
        title: 'Capacitación en Seguridad',
        description: 'Programas de capacitación integrales para mantener a todos seguros.',
      },
      performanceBonuses: {
        title: 'Bonos de Rendimiento',
        description: 'Recompensando la excelencia y dedicación en el lugar de trabajo.',
      },
    },
    applyForm: {
      title: 'Únase a Nuestra Red de Talento',
      subtitle: 'Envíe su solicitud y permítanos conectarlo con la oportunidad perfecta',
      personalInfo: 'Información Personal',
      professionalInfo: 'Información Profesional',
      additionalQuestions: 'Preguntas Adicionales',
      fullName: 'Nombre Completo',
      email: 'Correo Electrónico',
      emailConfirm: 'Confirmar Correo Electrónico',
      phone: 'Número de Teléfono',
      position: 'Puesto/Campo de Interés',
      positionsLabel: 'Puestos/Campos de Interés',
      selectAllApply: '(Seleccione todos los que correspondan)',
      experience: 'Años de Experiencia',
      resume: 'Currículum',
      coverLetter: 'Carta de Presentación',
      additionalDocs: 'Documentos Adicionales',
      additionalDocsOptional: 'Documentos Adicionales (Opcional)',
      documentType: 'Tipo de Documento',
      addDocument: 'Agregar Otro Documento',
      jobPostingUrl: 'URL de Oferta de Trabajo',
      jobPostingUrlOptional: 'URL de Oferta de Trabajo (Opcional)',
      linkedinProfile: 'Perfil de LinkedIn',
      linkedinProfileOptional: 'Perfil de LinkedIn (Opcional)',
      portfolioSite: 'Portafolio o Sitio Profesional',
      portfolioSiteOptional: 'Portafolio o Sitio Profesional (Opcional)',
      submit: 'Enviar Solicitud',
      submitting: 'Enviando Solicitud...',
      success: '¡Solicitud enviada con éxito! Nos pondremos en contacto pronto.',
      error: 'Error al enviar la solicitud. Por favor, inténtelo de nuevo.',
      uploadResume: 'Subir Currículum',
      changeResume: 'Cambiar Currículum',
      acceptedFormats: 'Formatos aceptados: PDF, DOC, DOCX (Máx 5MB)',
      privacyNotice: 'Al enviar este formulario, acepta nuestra política de privacidad y términos de servicio.',
      newsletter: 'Suscribirse al boletín informativo',
      smsNotifications: 'Recibir notificaciones por SMS sobre oportunidades laborales relevantes',
      newsletterLabel: 'Sí, envíenme boletines con oportunidades laborales y actualizaciones de la empresa',
      smsLabel: 'Sí, consiento recibir notificaciones por SMS sobre oportunidades laborales relevantes',
      selectPosition: 'Seleccione un puesto',
      selectExperience: 'Seleccione años de experiencia',
      lessThan1Year: 'Menos de 1 año',
      years1to2: '1-2 años',
      years3to5: '3-5 años',
      years6to10: '6-10 años',
      years10plus: '10+ años',
    },
    testimonials: {
      title: 'Lo Que Dicen Nuestros Clientes',
      subtitle: 'Confiado por empresas y buscadores de empleo en toda la región',
      quote1: 'Unique Staffing Professionals transformó nuestro proceso de contratación. Constantemente entregan candidatos de alta calidad que no solo son hábiles sino que también se alinean perfectamente con nuestra cultura empresarial.',
      author1: 'Sarah Martínez',
      role1: 'Directora de RRHH',
      company1: 'TechVision Solutions',
      quote2: 'Trabajar con este equipo ha sido un cambio radical para nuestras necesidades de personal estacional. Su capacidad de respuesta y comprensión de nuestra industria es inigualable.',
      author2: 'Michael Chen',
      role2: 'Gerente de Operaciones',
      company2: 'Logistics Dynamics Inc.',
      quote3: 'Los servicios de búsqueda ejecutiva superaron nuestras expectativas. Nos encontraron un VP de Ventas que ha transformado toda nuestra estrategia de ingresos. Trabajo verdaderamente excepcional.',
      author3: 'Jennifer Foster',
      role3: 'CEO',
      company3: 'Growth Capital Partners',
    },
    contact: {
      title: 'Póngase en Contacto',
      subtitle: '¿Listo para encontrar su próxima gran contratación o explorar oportunidades profesionales? Hablemos.',
      fullName: 'Nombre Completo',
      email: 'Correo Electrónico',
      phone: 'Número de Teléfono',
      companyName: 'Nombre de la Empresa',
      message: 'Mensaje',
      submit: 'Enviar Mensaje',
      submitting: 'Enviando...',
      success: '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.',
      error: 'Error al enviar el mensaje. Por favor, inténtelo de nuevo.',
      phoneLabel: 'Teléfono',
      textLabel: 'Texto para Trabajo',
      faxLabel: 'Fax',
      emailLabel: 'Correo Electrónico',
      officeAddress: 'Dirección de la Oficina',
      phoneHours: 'Lun-Vie 8am-6pm',
      textDescription: 'Respuesta rápida por texto',
      faxDescription: 'Envío de documentos',
      emailDescription: 'Responderemos en 24 horas',
      messagePlaceholder: 'Cuéntenos sobre sus necesidades de personal u objetivos profesionales...',
    },
    footer: {
      tagline: 'Expandir el acceso a empleos significativos en todo el mundo mediante la entrega de soluciones innovadoras de personal, el cultivo de asociaciones locales y el empoderamiento de las personas.',
      quickLinks: 'Enlaces Rápidos',
      services: 'Servicios',
      contactUs: 'Contáctenos',
      followUs: 'Síguenos',
      rights: 'Todos los derechos reservados.',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
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
    cookieConsent: {
      title: 'Valoramos Su Privacidad',
      description: 'Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el tráfico del sitio y proporcionar contenido personalizado. Puede personalizar sus preferencias a continuación.',
      acceptAll: 'Aceptar Todas',
      rejectAll: 'Rechazar Todas',
      customize: 'Personalizar',
      save: 'Guardar Preferencias',
      necessary: 'Cookies Necesarias',
      necessaryDesc: 'Esenciales para la funcionalidad del sitio web. No se pueden desactivar.',
      functional: 'Cookies Funcionales',
      functionalDesc: 'Habilitan funcionalidades mejoradas y personalización.',
      analytics: 'Cookies de Análisis',
      analyticsDesc: 'Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web.',
      marketing: 'Cookies de Marketing',
      marketingDesc: 'Utilizadas para rastrear visitantes y mostrar anuncios relevantes.',
      learnMore: 'Más información en nuestra Política de Privacidad',
      doNotSell: 'No Vender Mi Información Personal',
      hideDetails: 'Ocultar Detalles',
    },
    jobs: {
      title: 'Ofertas de Empleo Actuales',
      subtitle: 'Encuentre su próxima oportunidad profesional con los mejores empleadores de su área',
      searchTitle: 'Título o categoría',
      searchZip: 'Código postal',
      search: 'Buscar',
      loading: 'Cargando empleos...',
      noResults: 'No se encontraron empleos que coincidan con sus criterios',
      clearFilters: 'Limpiar Filtros',
      featured: 'Destacado',
      applyNow: 'Aplicar Ahora',
    },
    talentModal: {
      title: 'Únase a Nuestra Red de Talento',
      subtitle: 'Conéctese con los mejores empleadores hoy',
      description: 'Sea emparejado con oportunidades que se alineen con sus habilidades y objetivos profesionales. Nuestro equipo está listo para ayudarlo a dar el siguiente paso en su trayectoria profesional.',
      joinNow: 'Únase Ahora',
      dismiss: 'Tal Vez Más Tarde',
      closingSoon: 'Este mensaje se cerrará automáticamente en',
    },
    privacy: {
      title: 'Política de Privacidad',
      lastUpdated: 'Última Actualización',
      introduction: 'Unique Staffing Professionals Inc. ("Compañía", "nosotros" o "nuestro") está comprometida con la protección de su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando visita nuestro sitio web o utiliza nuestros servicios.',
      dataCollection: {
        title: 'Información Que Recopilamos',
        content: 'Recopilamos información que usted nos proporciona directamente, incluyendo pero no limitado a: información de identificación personal (nombre, dirección de correo electrónico, número de teléfono, dirección postal), información profesional (currículum, historial laboral, habilidades, referencias), información demográfica y cualquier otra información que elija proporcionar. También recopilamos automáticamente cierta información sobre su dispositivo cuando visita nuestro sitio web, incluyendo dirección IP, tipo de navegador, sistema operativo, URLs de referencia, páginas vistas, tiempo en páginas, enlaces clickeados y otro comportamiento de navegación. También podemos recopilar información de su proveedor de servicios de Internet y proveedores de datos de terceros para mejorar nuestra comprensión de sus intereses y proporcionar un mejor servicio.',
      },
      cookieTracking: {
        title: 'Cookies y Tecnologías de Seguimiento',
        content: 'Utilizamos cookies, web beacons y tecnologías de seguimiento similares para recopilar información sobre sus actividades de navegación. Esto incluye rastrear qué sitios web visitó antes de llegar a nuestro sitio, su ruta de navegación a través de nuestro sitio web, tiempo dedicado a cada página, profundidad de desplazamiento, movimientos del mouse y patrones de clics, interacciones y completaciones de formularios, y su ubicación geográfica basada en la dirección IP. Podemos usar servicios de análisis de terceros para ayudarnos a comprender el uso del sitio web y el comportamiento del usuario. Estas tecnologías nos ayudan a mejorar la funcionalidad de nuestro sitio web, personalizar su experiencia y analizar tendencias.',
      },
      thirdPartySharing: {
        title: 'Intercambio y Reventa de Datos a Terceros',
        content: 'Podemos compartir, vender o transferir su información a terceros para diversos propósitos comerciales, incluyendo pero no limitado a: socios de personal y reclutamiento, empresas clientes que buscan candidatos, socios de marketing y publicidad, proveedores de análisis de datos, servicios de verificación de antecedentes y otros proveedores de servicios que nos ayudan en nuestras operaciones comerciales. Al usar nuestros servicios, usted consiente la recopilación, uso y transferencia de su información como se describe en esta política. Podemos agregar y anonimizar sus datos para la venta a terceros con fines de investigación de mercado, inteligencia empresarial y otros propósitos comerciales.',
      },
      dataRetention: {
        title: 'Retención de Datos',
        content: 'Retenemos su información personal durante el tiempo necesario para cumplir con los propósitos descritos en esta Política de Privacidad, a menos que la ley requiera o permita un período de retención más largo. Incluso después de que solicite la eliminación de su información, podemos retener ciertos datos para cumplimiento legal, resolución de disputas y aplicación de nuestros acuerdos.',
      },
      yourRights: {
        title: 'Sus Derechos y Opciones',
        content: 'Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, incluyendo el derecho de acceder, corregir o eliminar sus datos personales, el derecho de restringir u oponerse al procesamiento, el derecho a la portabilidad de datos y el derecho de retirar el consentimiento. Para ejercer estos derechos, contáctenos utilizando la información proporcionada a continuación.',
      },
      optOut: {
        title: 'Optar por no Participar y Darse de Baja',
        content: 'Puede optar por no recibir comunicaciones de marketing de nosotros en cualquier momento haciendo clic en el enlace de darse de baja en nuestros correos electrónicos, visitando nuestra página de cancelación de suscripción o contactándonos directamente en omorilla@uniquestaffingprofessionals.com. Tenga en cuenta que incluso si opta por no recibir comunicaciones de marketing, aún podemos enviarle mensajes transaccionales o administrativos.',
      },
      emailCommunications: {
        title: 'Comunicaciones por Correo Electrónico',
        content: 'Al proporcionar su dirección de correo electrónico, usted consiente recibir correos electrónicos de nosotros con respecto a oportunidades laborales, actualizaciones de la empresa, boletines informativos y materiales de marketing. Puede darse de baja de nuestra lista de correo electrónico en cualquier momento haciendo clic en el enlace de darse de baja en la parte inferior de cualquier correo electrónico o contactándonos en omorilla@uniquestaffingprofessionals.com con el asunto "Cancelar Suscripción de Correo Electrónico".',
      },
      smsCommunications: {
        title: 'Comunicaciones por SMS/Mensaje de Texto',
        content: 'Si opta por recibir notificaciones por SMS, usted consiente recibir mensajes de texto de nosotros sobre oportunidades laborales relevantes, actualizaciones de solicitudes y otra información relacionada con el servicio. Pueden aplicarse tarifas de mensajes y datos. Puede optar por no recibir comunicaciones por SMS en cualquier momento respondiendo STOP a cualquier mensaje de texto o contactándonos en omorilla@uniquestaffingprofessionals.com con el asunto "Optar por no Participar en SMS". Tenga en cuenta que optar por no recibir comunicaciones por SMS puede afectar nuestra capacidad de proporcionarle actualizaciones laborales oportunas.',
      },
      contactUs: {
        title: 'Contáctenos',
        content: 'Si tiene preguntas, inquietudes o solicitudes con respecto a esta Política de Privacidad o nuestras prácticas de datos, contáctenos en: omorilla@uniquestaffingprofessionals.com. Responderemos a su consulta dentro de un plazo razonable.',
      },
    },
    terms: {
      title: 'Términos de Servicio',
      lastUpdated: 'Última Actualización',
      acceptance: {
        title: 'Aceptación de Términos',
        content: 'Al acceder o usar los servicios proporcionados por Unique Staffing Professionals Inc., usted acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo con estos términos, no use nuestros servicios.',
      },
      services: {
        title: 'Nuestros Servicios',
        content: 'Unique Staffing Professionals Inc. proporciona servicios de personal y empleo, incluyendo pero no limitado a colocación de candidatos, personal temporal, colocación permanente y soluciones de contrato a contratación. Nos reservamos el derecho de modificar, suspender o descontinuar cualquier aspecto de nuestros servicios en cualquier momento sin previo aviso.',
      },
      userResponsibilities: {
        title: 'Responsabilidades del Usuario',
        content: 'Usted acepta proporcionar información precisa, actual y completa al usar nuestros servicios. Es responsable de mantener la confidencialidad de cualquier credencial de cuenta y de todas las actividades que ocurran bajo su cuenta. Acepta no hacer mal uso de nuestros servicios, violar ninguna ley, infringir derechos de propiedad intelectual o participar en actividades fraudulentas o dañinas.',
      },
      dataUsage: {
        title: 'Recopilación y Uso de Datos',
        content: 'Al usar nuestros servicios, usted consiente nuestra recopilación, uso e intercambio de su información como se describe en nuestra Política de Privacidad. Esto incluye el derecho de compartir su información con terceros, incluyendo empresas clientes, socios comerciales y compradores de datos. Podemos usar sus datos para fines de marketing, análisis empresarial y reventa a terceros con fines comerciales.',
      },
      intellectualProperty: {
        title: 'Propiedad Intelectual',
        content: 'Todo el contenido de nuestro sitio web, incluyendo texto, gráficos, logotipos, imágenes y software, es propiedad de Unique Staffing Professionals Inc. o sus licenciantes y está protegido por las leyes de propiedad intelectual. No puede reproducir, distribuir, modificar o crear obras derivadas sin nuestro permiso expreso por escrito.',
      },
      limitationOfLiability: {
        title: 'Limitación de Responsabilidad',
        content: 'En la mayor medida permitida por la ley, Unique Staffing Professionals Inc. no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo, incluyendo pero no limitado a pérdida de ganancias, datos u oportunidades comerciales. Nuestra responsabilidad total no excederá la cantidad que nos pagó, si la hay, en los seis meses anteriores al reclamo.',
      },
      modifications: {
        title: 'Modificaciones a los Términos',
        content: 'Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento. Los cambios serán efectivos inmediatamente después de publicarse en nuestro sitio web. Su uso continuado de nuestros servicios después de que se publiquen los cambios constituye la aceptación de los términos modificados.',
      },
      governingLaw: {
        title: 'Ley Aplicable',
        content: 'Estos Términos de Servicio se regirán e interpretarán de acuerdo con las leyes del Estado de Maryland, sin tener en cuenta sus disposiciones sobre conflictos de leyes. Cualquier disputa que surja de estos términos se resolverá en los tribunales de Maryland.',
      },
      contactUs: {
        title: 'Información de Contacto',
        content: 'Para preguntas sobre estos Términos de Servicio, contáctenos en: omorilla@uniquestaffingprofessionals.com',
      },
    },
    unsubscribe: {
      title: 'Administre Sus Preferencias de Comunicación',
      subtitle: 'Actualice su configuración de suscripción',
      description: 'Elija qué comunicaciones le gustaría recibir de nosotros. Puede darse de baja de cualquiera o todas nuestras comunicaciones a continuación.',
      newsletter: 'Boletín y Actualizaciones de la Empresa',
      jobNotifications: 'Notificaciones de Oportunidades Laborales',
      smsNotifications: 'Notificaciones por SMS/Mensaje de Texto',
      unsubscribeButton: 'Actualizar Preferencias',
      unsubscribing: 'Actualizando...',
      successTitle: 'Preferencias Actualizadas',
      successMessage: 'Sus preferencias de comunicación se han actualizado con éxito. Puede cambiar esta configuración en cualquier momento.',
      resubscribe: '¿Quiere saber de nosotros nuevamente? Puede volver a suscribirse en cualquier momento.',
      error: 'Error al actualizar las preferencias. Inténtelo de nuevo o contáctenos en omorilla@uniquestaffingprofessionals.com',
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
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions d\'Utilisation',
    },
    hero: {
      title: 'Là Où L\'Opportunité Commence!',
      subtitle: 'Votre Partenaire de Confiance pour les Opportunités d\'Emploi. Au service de Washington D.C., Maryland, Virginie, Illinois, Ohio et New Jersey.',
      ctaEmployers: 'Trouver des Talents',
      ctaJobSeekers: 'Trouver des Emplois',
      yearsExperience: 'Années d\'Expérience',
      companiesServed: 'Entreprises Servies',
      placementsMade: 'Placements Effectués',
      clientSatisfaction: 'Satisfaction Client',
    },
    services: {
      title: 'Nos Services',
      subtitle: 'Solutions de recrutement complètes adaptées à vos besoins',
      janitorial: {
        title: 'Services de Nettoyage',
        description: 'Services professionnels de nettoyage et d\'entretien des installations pour garder votre espace de travail impeccable et accueillant.',
      },
      humanResources: {
        title: 'Ressources Humaines',
        description: 'Solutions complètes de personnel et de recrutement pour construire votre main-d\'œuvre idéale.',
      },
      retailSales: {
        title: 'Commerce de Détail et Ventes',
        description: 'Postes en contact avec la clientèle et rôles de vente pour stimuler la croissance de votre entreprise.',
      },
      callCenter: {
        title: 'Centre d\'Appels et Service Client',
        description: 'Représentants du support et spécialistes du service client pour améliorer la satisfaction des clients.',
      },
      industrial: {
        title: 'Industriel et Fabrication',
        description: 'Travailleurs de production, personnel d\'entrepôt et postes de fabrication pour l\'excellence opérationnelle.',
      },
    },
    industries: {
      title: 'Où Nous Servons',
      subtitle: 'Solutions professionnelles de personnel dans cinq industries clés',
      servingRegions: 'Au Service de Washington D.C., Maryland, Virginie, Illinois, Ohio et New Jersey',
      janitorial: 'Services de Nettoyage',
      humanResources: 'Ressources Humaines',
      retailSales: 'Commerce de Détail',
      callCenter: 'Centre d\'Appels',
      industrial: 'Industriel',
      janitorialDesc: 'Nettoyage et entretien professionnels',
      humanResourcesDesc: 'Solutions de personnel et recrutement',
      retailSalesDesc: 'Postes en contact avec la clientèle',
      callCenterDesc: 'Spécialistes du service client',
      industrialDesc: 'Fabrication et entrepôt',
    },
    whyChooseUs: {
      title: 'Pourquoi Choisir Unique Staffing Professionals Inc.?',
      subtitle: 'Votre partenaire de confiance pour l\'excellence en recrutement',
      description1: 'Dirigés par le PDG Otniel Morilla, nous nous engageons à élargir l\'accès à un emploi significatif grâce à des solutions de personnel innovantes et des partenariats locaux.',
      description2: 'Notre approche axée sur la communauté combine des solutions d\'emploi complètes avec des services de soutien dédiés, notamment l\'assistance au transport, des programmes de formation à la sécurité et des incitations à la performance. Nous croyons en l\'autonomisation des individus et en la construction de ponts entre le talent et l\'opportunité.',
      keyFeatures: 'Caractéristiques Clés',
      coreValues: 'Nos Valeurs Fondamentales',
      empowerment: {
        title: 'Autonomisation',
        description: 'Équiper les individus d\'opportunités pour prospérer et réussir.',
      },
      communityImpact: {
        title: 'Impact Communautaire',
        description: 'Faire une différence positive dans les communautés que nous servons.',
      },
      integrity: {
        title: 'Intégrité',
        description: 'Respecter l\'honnêteté et les normes éthiques dans tout ce que nous faisons.',
      },
      inclusivity: {
        title: 'Inclusivité',
        description: 'Embrasser la diversité et créer des opportunités pour tous.',
      },
      innovation: {
        title: 'Innovation',
        description: 'Améliorer continuellement nos solutions et services de personnel.',
      },
      collaboration: {
        title: 'Collaboration',
        description: 'Construire des partenariats solides avec les clients et les candidats.',
      },
      resilience: {
        title: 'Résilience',
        description: 'S\'adapter et surmonter les défis pour fournir des résultats.',
      },
      serviceExcellence: {
        title: 'Excellence du Service',
        description: 'Engagés à fournir une qualité de service exceptionnelle.',
      },
      portal247: {
        title: 'Portail de Candidature 24/7',
        description: 'Postulez à tout moment, n\'importe où via notre système en ligne pratique.',
      },
      transportation: {
        title: 'Services de Transport',
        description: 'Nous aidons à assurer un transport fiable pour notre main-d\'œuvre.',
      },
      safetyTraining: {
        title: 'Formation à la Sécurité',
        description: 'Programmes de formation complets pour assurer la sécurité de tous.',
      },
      performanceBonuses: {
        title: 'Bonus de Performance',
        description: 'Récompenser l\'excellence et le dévouement sur le lieu de travail.',
      },
    },
    applyForm: {
      title: 'Rejoignez Notre Réseau de Talents',
      subtitle: 'Soumettez votre candidature et laissez-nous vous connecter avec l\'opportunité parfaite',
      personalInfo: 'Informations Personnelles',
      professionalInfo: 'Informations Professionnelles',
      additionalQuestions: 'Questions Supplémentaires',
      fullName: 'Nom Complet',
      email: 'Adresse Email',
      emailConfirm: 'Confirmer l\'Adresse Email',
      phone: 'Numéro de Téléphone',
      position: 'Poste/Domaine d\'Intérêt',
      positionsLabel: 'Postes/Domaines d\'Intérêt',
      selectAllApply: '(Sélectionnez toutes les options applicables)',
      experience: 'Années d\'Expérience',
      resume: 'CV',
      coverLetter: 'Lettre de Motivation',
      additionalDocs: 'Documents Supplémentaires',
      additionalDocsOptional: 'Documents Supplémentaires (Optionnel)',
      documentType: 'Type de Document',
      addDocument: 'Ajouter un Autre Document',
      jobPostingUrl: 'URL de l\'Offre d\'Emploi',
      jobPostingUrlOptional: 'URL de l\'Offre d\'Emploi (Optionnel)',
      linkedinProfile: 'Profil LinkedIn',
      linkedinProfileOptional: 'Profil LinkedIn (Optionnel)',
      portfolioSite: 'Portfolio ou Site Professionnel',
      portfolioSiteOptional: 'Portfolio ou Site Professionnel (Optionnel)',
      submit: 'Soumettre la Candidature',
      submitting: 'Envoi de la Candidature...',
      success: 'Candidature soumise avec succès ! Nous vous contacterons bientôt.',
      error: 'Échec de l\'envoi de la candidature. Veuillez réessayer.',
      uploadResume: 'Télécharger le CV',
      changeResume: 'Changer le CV',
      acceptedFormats: 'Formats acceptés : PDF, DOC, DOCX (Max 5 Mo)',
      privacyNotice: 'En soumettant ce formulaire, vous acceptez notre politique de confidentialité et nos conditions d\'utilisation.',
      newsletter: 'S\'inscrire à notre newsletter',
      smsNotifications: 'Recevoir des notifications SMS sur les opportunités d\'emploi pertinentes',
      newsletterLabel: 'Oui, envoyez-moi des newsletters avec des opportunités d\'emploi et des mises à jour de l\'entreprise',
      smsLabel: 'Oui, je consens à recevoir des notifications SMS sur les opportunités d\'emploi pertinentes',
      selectPosition: 'Sélectionner un poste',
      selectExperience: 'Sélectionner les années d\'expérience',
      lessThan1Year: 'Moins de 1 an',
      years1to2: '1-2 ans',
      years3to5: '3-5 ans',
      years6to10: '6-10 ans',
      years10plus: '10+ ans',
    },
    testimonials: {
      title: 'Ce Que Disent Nos Clients',
      subtitle: 'Fait confiance par les entreprises et les chercheurs d\'emploi dans toute la région',
      quote1: 'Unique Staffing Professionals a transformé notre processus de recrutement. Ils fournissent constamment des candidats de haute qualité qui sont non seulement compétents mais s\'alignent également parfaitement avec notre culture d\'entreprise.',
      author1: 'Sarah Martinez',
      role1: 'Directrice RH',
      company1: 'TechVision Solutions',
      quote2: 'Travailler avec cette équipe a été un changement de jeu pour nos besoins de personnel saisonnier. Leur réactivité et leur compréhension de notre industrie sont inégalées.',
      author2: 'Michael Chen',
      role2: 'Directeur des Opérations',
      company2: 'Logistics Dynamics Inc.',
      quote3: 'Les services de recherche de cadres ont dépassé nos attentes. Ils nous ont trouvé un VP des Ventes qui a transformé toute notre stratégie de revenus. Travail vraiment exceptionnel.',
      author3: 'Jennifer Foster',
      role3: 'PDG',
      company3: 'Growth Capital Partners',
    },
    contact: {
      title: 'Contactez-nous',
      subtitle: 'Prêt à trouver votre prochain excellent recrutement ou à explorer des opportunités de carrière ? Parlons-en.',
      fullName: 'Nom Complet',
      email: 'Adresse Email',
      phone: 'Numéro de Téléphone',
      companyName: 'Nom de l\'Entreprise',
      message: 'Message',
      submit: 'Envoyer le Message',
      submitting: 'Envoi en cours...',
      success: 'Message envoyé avec succès ! Nous vous recontacterons bientôt.',
      error: 'Échec de l\'envoi du message. Veuillez réessayer.',
      phoneLabel: 'Téléphone',
      textLabel: 'Texte pour le Travail',
      faxLabel: 'Fax',
      emailLabel: 'Email',
      officeAddress: 'Adresse du Bureau',
      phoneHours: 'Lun-Ven 8h-18h',
      textDescription: 'Réponse rapide par texte',
      faxDescription: 'Envoi de documents',
      emailDescription: 'Nous répondrons dans les 24 heures',
      messagePlaceholder: 'Parlez-nous de vos besoins en personnel ou de vos objectifs de carrière...',
    },
    footer: {
      tagline: 'Élargir l\'accès à un emploi significatif dans le monde entier en proposant des solutions de recrutement innovantes, en cultivant des partenariats locaux et en autonomisant les individus.',
      quickLinks: 'Liens Rapides',
      services: 'Services',
      contactUs: 'Contactez-nous',
      followUs: 'Suivez-nous',
      rights: 'Tous droits réservés.',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions d\'Utilisation',
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
    cookieConsent: {
      title: 'Nous Valorisons Votre Vie Privée',
      description: 'Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, analyser le trafic du site et fournir du contenu personnalisé. Vous pouvez personnaliser vos préférences ci-dessous.',
      acceptAll: 'Tout Accepter',
      rejectAll: 'Tout Rejeter',
      customize: 'Personnaliser',
      save: 'Enregistrer les Préférences',
      necessary: 'Cookies Nécessaires',
      necessaryDesc: 'Essentiels pour la fonctionnalité du site web. Ne peuvent pas être désactivés.',
      functional: 'Cookies Fonctionnels',
      functionalDesc: 'Activent des fonctionnalités améliorées et la personnalisation.',
      analytics: 'Cookies Analytiques',
      analyticsDesc: 'Nous aident à comprendre comment les visiteurs interagissent avec notre site web.',
      marketing: 'Cookies Marketing',
      marketingDesc: 'Utilisés pour suivre les visiteurs et afficher des publicités pertinentes.',
      learnMore: 'En savoir plus dans notre Politique de Confidentialité',
      doNotSell: 'Ne Pas Vendre Mes Informations Personnelles',
      hideDetails: 'Masquer les Détails',
    },
    jobs: {
      title: 'Offres d\'Emploi Actuelles',
      subtitle: 'Trouvez votre prochaine opportunité de carrière auprès des meilleurs employeurs de votre région',
      searchTitle: 'Titre ou catégorie',
      searchZip: 'Code postal',
      search: 'Rechercher',
      loading: 'Chargement des emplois...',
      noResults: 'Aucun emploi trouvé correspondant à vos critères',
      clearFilters: 'Effacer les Filtres',
      featured: 'En Vedette',
      applyNow: 'Postuler Maintenant',
    },
    talentModal: {
      title: 'Rejoignez Notre Réseau de Talents',
      subtitle: 'Connectez-vous avec les meilleurs employeurs aujourd\'hui',
      description: 'Soyez jumelé avec des opportunités qui correspondent à vos compétences et objectifs de carrière. Notre équipe est prête à vous aider à franchir la prochaine étape de votre parcours professionnel.',
      joinNow: 'Rejoindre Maintenant',
      dismiss: 'Peut-être Plus Tard',
      closingSoon: 'Ce message se fermera automatiquement dans',
    },
    privacy: {
      title: 'Politique de Confidentialité',
      lastUpdated: 'Dernière Mise à Jour',
      introduction: 'Unique Staffing Professionals Inc. ("Société", "nous" ou "notre") s\'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site web ou utilisez nos services.',
      dataCollection: {
        title: 'Informations Que Nous Collectons',
        content: 'Nous collectons les informations que vous nous fournissez directement, y compris mais sans s\'y limiter : des informations d\'identification personnelle (nom, adresse e-mail, numéro de téléphone, adresse postale), des informations professionnelles (CV, historique de travail, compétences, références), des informations démographiques et toute autre information que vous choisissez de fournir. Nous collectons également automatiquement certaines informations sur votre appareil lorsque vous visitez notre site web, y compris l\'adresse IP, le type de navigateur, le système d\'exploitation, les URLs de référence, les pages consultées, le temps passé sur les pages, les liens cliqués et d\'autres comportements de navigation. Nous pouvons également collecter des informations auprès de votre fournisseur de services Internet et des fournisseurs de données tiers pour améliorer notre compréhension de vos intérêts et fournir un meilleur service.',
      },
      cookieTracking: {
        title: 'Cookies et Technologies de Suivi',
        content: 'Nous utilisons des cookies, des balises web et des technologies de suivi similaires pour collecter des informations sur vos activités de navigation. Cela comprend le suivi des sites web que vous avez visités avant d\'arriver sur notre site, votre chemin de navigation sur notre site web, le temps passé sur chaque page, la profondeur de défilement, les mouvements de souris et les modèles de clics, les interactions et les complétions de formulaires, et votre localisation géographique basée sur l\'adresse IP. Nous pouvons utiliser des services d\'analyse tiers pour nous aider à comprendre l\'utilisation du site web et le comportement des utilisateurs. Ces technologies nous aident à améliorer la fonctionnalité de notre site web, à personnaliser votre expérience et à analyser les tendances.',
      },
      thirdPartySharing: {
        title: 'Partage et Revente de Données à des Tiers',
        content: 'Nous pouvons partager, vendre ou transférer vos informations à des tiers à diverses fins commerciales, y compris mais sans s\'y limiter : des partenaires de personnel et de recrutement, des entreprises clientes à la recherche de candidats, des partenaires de marketing et de publicité, des fournisseurs d\'analyse de données, des services de vérification des antécédents et d\'autres fournisseurs de services qui nous aident dans nos opérations commerciales. En utilisant nos services, vous consentez à la collecte, à l\'utilisation et au transfert de vos informations comme décrit dans cette politique. Nous pouvons agréger et anonymiser vos données pour les vendre à des tiers à des fins d\'études de marché, d\'intelligence d\'affaires et d\'autres objectifs commerciaux.',
      },
      dataRetention: {
        title: 'Conservation des Données',
        content: 'Nous conservons vos informations personnelles aussi longtemps que nécessaire pour atteindre les objectifs décrits dans cette Politique de Confidentialité, à moins qu\'une période de conservation plus longue ne soit requise ou autorisée par la loi. Même après que vous demandiez la suppression de vos informations, nous pouvons conserver certaines données pour la conformité légale, la résolution de litiges et l\'application de nos accords.',
      },
      yourRights: {
        title: 'Vos Droits et Choix',
        content: 'Selon votre emplacement, vous pouvez avoir certains droits concernant vos informations personnelles, y compris le droit d\'accéder, de corriger ou de supprimer vos données personnelles, le droit de restreindre ou de s\'opposer au traitement, le droit à la portabilité des données et le droit de retirer le consentement. Pour exercer ces droits, veuillez nous contacter en utilisant les informations fournies ci-dessous.',
      },
      optOut: {
        title: 'Désabonnement et Désinscription',
        content: 'Vous pouvez vous désabonner de la réception de communications marketing de notre part à tout moment en cliquant sur le lien de désabonnement dans nos e-mails, en visitant notre page de désinscription ou en nous contactant directement à omorilla@uniquestaffingprofessionals.com. Veuillez noter que même si vous vous désabonnez des communications marketing, nous pouvons toujours vous envoyer des messages transactionnels ou administratifs.',
      },
      emailCommunications: {
        title: 'Communications par Email',
        content: 'En fournissant votre adresse e-mail, vous consentez à recevoir des e-mails de notre part concernant les opportunités d\'emploi, les mises à jour de l\'entreprise, les newsletters et les documents marketing. Vous pouvez vous désabonner de notre liste de diffusion à tout moment en cliquant sur le lien de désabonnement au bas de n\'importe quel e-mail ou en nous contactant à omorilla@uniquestaffingprofessionals.com avec l\'objet "Désinscription Email".',
      },
      smsCommunications: {
        title: 'Communications par SMS/Message Texte',
        content: 'Si vous optez pour recevoir des notifications par SMS, vous consentez à recevoir des messages texte de notre part concernant les opportunités d\'emploi pertinentes, les mises à jour de candidature et d\'autres informations liées au service. Des frais de message et de données peuvent s\'appliquer. Vous pouvez vous désabonner des communications par SMS à tout moment en répondant STOP à n\'importe quel message texte ou en nous contactant à omorilla@uniquestaffingprofessionals.com avec l\'objet "Désinscription SMS". Veuillez noter que le désabonnement des communications par SMS peut affecter notre capacité à vous fournir des mises à jour d\'emploi en temps opportun.',
      },
      contactUs: {
        title: 'Contactez-Nous',
        content: 'Si vous avez des questions, des préoccupations ou des demandes concernant cette Politique de Confidentialité ou nos pratiques en matière de données, veuillez nous contacter à : omorilla@uniquestaffingprofessionals.com. Nous répondrons à votre demande dans un délai raisonnable.',
      },
    },
    terms: {
      title: 'Conditions d\'Utilisation',
      lastUpdated: 'Dernière Mise à Jour',
      acceptance: {
        title: 'Acceptation des Conditions',
        content: 'En accédant ou en utilisant les services fournis par Unique Staffing Professionals Inc., vous acceptez d\'être lié par ces Conditions d\'Utilisation. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser nos services.',
      },
      services: {
        title: 'Nos Services',
        content: 'Unique Staffing Professionals Inc. fournit des services de personnel et d\'emploi, y compris mais sans s\'y limiter le placement de candidats, le personnel temporaire, le placement permanent et les solutions de contrat à embauche. Nous nous réservons le droit de modifier, suspendre ou interrompre tout aspect de nos services à tout moment sans préavis.',
      },
      userResponsibilities: {
        title: 'Responsabilités de l\'Utilisateur',
        content: 'Vous acceptez de fournir des informations exactes, actuelles et complètes lors de l\'utilisation de nos services. Vous êtes responsable du maintien de la confidentialité de toutes les informations d\'identification de compte et de toutes les activités qui se produisent sous votre compte. Vous acceptez de ne pas abuser de nos services, violer les lois, enfreindre les droits de propriété intellectuelle ou vous engager dans des activités frauduleuses ou nuisibles.',
      },
      dataUsage: {
        title: 'Collecte et Utilisation des Données',
        content: 'En utilisant nos services, vous consentez à notre collecte, utilisation et partage de vos informations comme décrit dans notre Politique de Confidentialité. Cela inclut le droit de partager vos informations avec des tiers, y compris des entreprises clientes, des partenaires commerciaux et des acheteurs de données. Nous pouvons utiliser vos données à des fins de marketing, d\'analyse commerciale et de revente à des tiers à des fins commerciales.',
      },
      intellectualProperty: {
        title: 'Propriété Intellectuelle',
        content: 'Tout le contenu de notre site web, y compris le texte, les graphiques, les logos, les images et les logiciels, est la propriété de Unique Staffing Professionals Inc. ou de ses concédants de licence et est protégé par les lois sur la propriété intellectuelle. Vous ne pouvez pas reproduire, distribuer, modifier ou créer des œuvres dérivées sans notre autorisation écrite expresse.',
      },
      limitationOfLiability: {
        title: 'Limitation de Responsabilité',
        content: 'Dans toute la mesure permise par la loi, Unique Staffing Professionals Inc. ne sera pas responsable de tout dommage indirect, accessoire, spécial, consécutif ou punitif, y compris mais sans s\'y limiter la perte de profits, de données ou d\'opportunités commerciales. Notre responsabilité totale ne dépassera pas le montant que vous nous avez payé, le cas échéant, au cours des six mois précédant la réclamation.',
      },
      modifications: {
        title: 'Modifications des Conditions',
        content: 'Nous nous réservons le droit de modifier ces Conditions d\'Utilisation à tout moment. Les modifications entreront en vigueur immédiatement après leur publication sur notre site web. Votre utilisation continue de nos services après la publication des modifications constitue une acceptation des conditions modifiées.',
      },
      governingLaw: {
        title: 'Loi Applicable',
        content: 'Ces Conditions d\'Utilisation seront régies et interprétées conformément aux lois de l\'État du Maryland, sans égard à ses dispositions en matière de conflits de lois. Tout litige découlant de ces conditions sera résolu devant les tribunaux du Maryland.',
      },
      contactUs: {
        title: 'Informations de Contact',
        content: 'Pour des questions sur ces Conditions d\'Utilisation, veuillez nous contacter à : omorilla@uniquestaffingprofessionals.com',
      },
    },
    unsubscribe: {
      title: 'Gérez Vos Préférences de Communication',
      subtitle: 'Mettez à jour vos paramètres d\'abonnement',
      description: 'Choisissez les communications que vous souhaitez recevoir de notre part. Vous pouvez vous désabonner de toutes ou de certaines de nos communications ci-dessous.',
      newsletter: 'Newsletter et Mises à Jour de l\'Entreprise',
      jobNotifications: 'Notifications d\'Opportunités d\'Emploi',
      smsNotifications: 'Notifications par SMS/Message Texte',
      unsubscribeButton: 'Mettre à Jour les Préférences',
      unsubscribing: 'Mise à jour...',
      successTitle: 'Préférences Mises à Jour',
      successMessage: 'Vos préférences de communication ont été mises à jour avec succès. Vous pouvez modifier ces paramètres à tout moment.',
      resubscribe: 'Vous voulez à nouveau avoir de nos nouvelles ? Vous pouvez vous réabonner à tout moment.',
      error: 'Échec de la mise à jour des préférences. Veuillez réessayer ou contactez-nous à omorilla@uniquestaffingprofessionals.com',
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
