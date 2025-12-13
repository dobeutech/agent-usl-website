import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Question } from '@phosphor-icons/react'

const faqData = {
  jobSeekers: [
    {
      question: "How do I apply for a job?",
      answer: "You can apply directly through our website by filling out the application form in the 'Apply Now' section. Upload your resume, select the positions you're interested in, and provide your contact information. Our team will review your application and contact you within 2-3 business days."
    },
    {
      question: "Is there a fee to use your services?",
      answer: "No, our staffing services are completely FREE for job seekers. We are paid by the employers who hire through us, so you never have to worry about any fees or charges."
    },
    {
      question: "What types of jobs do you offer?",
      answer: "We offer a wide range of positions including janitorial/custodial, human resources, retail and sales, call center and customer service, industrial and manufacturing, administrative, warehouse and logistics, healthcare support, and IT positions. We have both temporary and permanent placement opportunities."
    },
    {
      question: "How long does the hiring process take?",
      answer: "The timeline varies depending on the position and employer requirements. For temporary positions, you could start within a few days. Permanent placements typically take 1-2 weeks. We work to match you with opportunities as quickly as possible."
    },
    {
      question: "Do you offer benefits?",
      answer: "Benefits depend on the specific position and whether it's temporary or permanent placement. Many of our full-time and long-term positions include benefits such as health insurance, paid time off, and retirement plans. Ask your recruiter about benefits for specific opportunities."
    },
    {
      question: "What areas do you serve?",
      answer: "We primarily serve the DMV area including Maryland, Washington D.C., and Northern Virginia. Our main office is located in Riverdale, MD, but we place candidates throughout the greater metropolitan area."
    }
  ],
  employers: [
    {
      question: "How does your staffing process work?",
      answer: "Our process is simple: 1) Contact us with your staffing needs, 2) We'll discuss your requirements and job specifications, 3) We source, screen, and interview candidates, 4) We present qualified candidates for your review, 5) You select the best fit, and we handle the paperwork. We can typically provide qualified candidates within 24-48 hours."
    },
    {
      question: "What industries do you specialize in?",
      answer: "We specialize in janitorial services, human resources, retail and sales, call center operations, industrial and manufacturing, administrative support, warehouse and logistics, and healthcare support. Our 15+ years of experience allows us to understand the unique needs of each industry."
    },
    {
      question: "Do you offer temp-to-perm options?",
      answer: "Yes! Temp-to-perm (or temp-to-hire) is one of our most popular services. It allows you to evaluate a candidate on the job before making a permanent hiring decision. This reduces your risk and ensures a good fit for both parties."
    },
    {
      question: "How do you screen candidates?",
      answer: "Our comprehensive screening process includes resume review, phone and in-person interviews, skills assessments, reference checks, background checks, drug screening (if required), and verification of work eligibility. We ensure every candidate meets your specific requirements."
    },
    {
      question: "What if a placement doesn't work out?",
      answer: "We stand behind our placements. If a candidate doesn't meet your expectations within the guarantee period, we'll work with you to find a replacement at no additional cost. Your satisfaction is our priority."
    },
    {
      question: "How quickly can you fill a position?",
      answer: "For temporary positions, we can often provide qualified candidates within 24-48 hours. For permanent placements requiring specialized skills, the timeline is typically 1-2 weeks. We maintain a large pool of pre-screened candidates ready to work."
    }
  ]
}

export function FAQ() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Question weight="fill" size={16} />
            <span>Got Questions?</span>
          </motion.div>
          <h2 className="font-heading font-bold text-3xl lg:text-5xl text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our staffing services
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Job Seekers FAQ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground">
                For Job Seekers
              </h3>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {faqData.jobSeekers.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`seeker-${index}`}
                  className="border border-border/50 rounded-xl px-4 bg-card/50 backdrop-blur-sm data-[state=open]:bg-card data-[state=open]:shadow-md transition-all"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Employers FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <span className="text-lg">🏢</span>
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground">
                For Employers
              </h3>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {faqData.employers.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`employer-${index}`}
                  className="border border-border/50 rounded-xl px-4 bg-card/50 backdrop-blur-sm data-[state=open]:bg-card data-[state=open]:shadow-md transition-all"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>

        {/* Still have questions CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+13012772141"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              📞 Call (301) 277-2141
            </a>
            <a
              href="mailto:omorilla@uniquestaffingprofessionals.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card hover:bg-secondary transition-colors"
            >
              ✉️ Email Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
