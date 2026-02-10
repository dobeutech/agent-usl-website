import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react"

export function VideoHero() {
  const [showVideo, setShowVideo] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Only show video once per session
    const hasSeenVideo = sessionStorage.getItem("usp-hero-video-seen")
    if (!hasSeenVideo) {
      setShowVideo(true)
    }
  }, [])

  const dismissVideo = useCallback(() => {
    setShowVideo(false)
    sessionStorage.setItem("usp-hero-video-seen", "true")
  }, [])

  const handleVideoEnd = useCallback(() => {
    dismissVideo()
  }, [dismissVideo])

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  if (!showVideo) return null

  return (
    <AnimatePresence>
      {showVideo && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            src="/hero-video.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            aria-label="Unique Staffing Professionals introduction video"
          />

          {/* Controls overlay */}
          <div className="absolute bottom-8 right-8 flex items-center gap-3 z-10">
            {/* Mute/Unmute */}
            <motion.button
              onClick={toggleMute}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <SpeakerSlash size={18} weight="bold" />
              ) : (
                <SpeakerHigh size={18} weight="bold" />
              )}
              {isMuted ? "Unmute" : "Mute"}
            </motion.button>

            {/* Skip button */}
            <motion.button
              onClick={dismissVideo}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 text-black text-sm font-semibold hover:bg-white transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Skip video introduction"
            >
              Skip
              <X size={16} weight="bold" />
            </motion.button>
          </div>

          {/* Company logo watermark */}
          <div className="absolute top-6 left-6 z-10">
            <img
              src="/logo.svg"
              alt="Unique Staffing Professionals"
              className="h-10 w-auto bg-white/90 rounded-lg p-1.5"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
