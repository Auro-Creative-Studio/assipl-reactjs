import { getMediaUrl } from '../lib/homeApi'

const defaultVideoUrl = 'https://automationsystems.co.in/wp-content/uploads/2026/08/homepage-vided_4.mp4'

function VideoSection({ data }) {
  const videoUrl = data?.video_url ? getMediaUrl(data.video_url) : defaultVideoUrl

  return (
    <section className="relative flex min-h-78 items-center justify-center overflow-hidden bg-secondary md:min-h-115 lg:min-h-screen">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-secondary/20" />
    </section>
  )
}

export default VideoSection
