import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MagnifyingGlass, MapPin, Briefcase, Clock, CurrencyDollar } from "@phosphor-icons/react"
import { supabase, Job } from "@/lib/supabase"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export function JobListings() {
  const { t } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [searchTitle, setSearchTitle] = useState("")
  const [searchZip, setSearchZip] = useState("")
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [searchTitle, searchZip, jobs])

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
      setFilteredJobs(data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterJobs = () => {
    let filtered = jobs

    if (searchTitle.trim()) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTitle.toLowerCase())
      )
    }

    if (searchZip.trim()) {
      filtered = filtered.filter(job =>
        job.location_zip.startsWith(searchZip.trim())
      )
    }

    setFilteredJobs(filtered)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterJobs()
  }

  const scrollToApply = () => {
    const element = document.getElementById("apply")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const formatSalary = (job: Job) => {
    if (!job.salary_min && !job.salary_max) return null

    const format = (num: number) => {
      if (job.salary_type === 'hourly') return `$${num}/hr`
      return `$${(num / 1000).toFixed(0)}k`
    }

    if (job.salary_min && job.salary_max) {
      return `${format(job.salary_min)} - ${format(job.salary_max)}`
    }
    return job.salary_min ? `${format(job.salary_min)}+` : `Up to ${format(job.salary_max!)}`
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  return (
    <section id="jobs" className="py-16 lg:py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
            {t('jobs.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('jobs.subtitle')}
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder={t('jobs.searchTitle')}
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative sm:w-40">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder={t('jobs.searchZip')}
                value={searchZip}
                onChange={(e) => setSearchZip(e.target.value)}
                className="pl-10"
                maxLength={5}
              />
            </div>
            <Button type="submit" className="sm:w-auto">
              {t('jobs.search')}
            </Button>
          </div>
        </form>

        {/* Job Listings */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('jobs.loading')}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{t('jobs.noResults')}</p>
            <Button variant="outline" onClick={() => { setSearchTitle(""); setSearchZip(""); }}>
              {t('jobs.clearFilters')}
            </Button>
          </div>
        ) : (
          <motion.div
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {filteredJobs.map((job) => (
              <motion.div key={job.id} variants={cardVariants}>
                <Card className="p-6 h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-heading font-semibold text-xl text-foreground">
                        {job.title}
                      </h3>
                      {job.featured && (
                        <Badge variant="secondary" className="ml-2 flex-shrink-0">
                          {t('jobs.featured')}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin size={16} className="mr-2 flex-shrink-0" />
                        <span>{job.location_city}, {job.location_state} {job.location_zip}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Briefcase size={16} className="mr-2 flex-shrink-0" />
                        <span>{job.category}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock size={16} className="mr-2 flex-shrink-0" />
                        <span className="capitalize">{job.job_type.replace('-', ' ')}</span>
                      </div>
                      {formatSalary(job) && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CurrencyDollar size={16} className="mr-2 flex-shrink-0" />
                          <span>{formatSalary(job)}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {job.description}
                    </p>
                  </div>

                  <Button
                    onClick={scrollToApply}
                    className="w-full mt-auto"
                    variant="outline"
                  >
                    {t('jobs.applyNow')}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
