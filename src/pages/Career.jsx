import Reveal from '../components/Reveal'
import { useSeoMeta } from '../hooks/useSeoMeta'

function Career() {
  useSeoMeta({
    title: 'Careers | ASSIPL',
    description: 'Join the ASSIPL team. Open positions and application details will be listed here soon.',
  })

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <Reveal as="section" className="max-w-3xl">
        <h1 className="text-4xl font-bold text-secondary">Career</h1>
        <p className="mt-5 text-body text-text">
          Join our team. Open positions and application details will be listed here soon.
        </p>
      </Reveal>
    </main>
  )
}

export default Career
