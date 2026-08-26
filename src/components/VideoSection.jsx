function VideoSection() {
  return (
    <section className="relative flex min-h-78 items-center justify-center overflow-hidden bg-secondary md:min-h-115 lg:min-h-screen">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="https://automationsystems.co.in/wp-content/uploads/2026/08/homepage-vided_4.mp4"
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
