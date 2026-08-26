import Reveal from '../components/Reveal'
import heroBackground from '../assets/blogs/cctv-surveillance-systems-for-commercial-security/hero-bg.jpg'
import section1Image from '../assets/blogs/cctv-surveillance-systems-for-commercial-security/section-1.webp'
import section2Image from '../assets/blogs/cctv-surveillance-systems-for-commercial-security/section-2.webp'
import section3Image from '../assets/blogs/cctv-surveillance-systems-for-commercial-security/section-3.webp'

const whatCctvDoesPoints = [
  {
    label: 'Fewer losses from theft and vandalism.',
    text: 'Visible cameras make criminals move on to easier targets instead of testing your defenses.',
  },
  {
    label: 'Safer workplaces.',
    text: 'You catch safety hazards, accidents, and rule-breaking before they turn into lawsuits or worse.',
  },
  {
    label: 'Proof when you need it.',
    text: 'Disputes, insurance claims, and HR issues get resolved faster and more fairly with clear footage on hand.',
  },
  {
    label: 'Eyes on your business, anywhere.',
    text: 'Check your store or office from your phone, whether you’re across town or across the country.',
  },
]

const rightSystemPoints = [
  {
    label: 'Picture quality.',
    text: 'Blurry footage helps no one when you actually need to identify a face or a license plate.',
  },
  {
    label: 'Night vision.',
    text: 'Most incidents happen after hours, so weak low-light performance leaves you exposed exactly when you need coverage most.',
  },
  {
    label: 'Storage.',
    text: 'Cloud backup keeps your footage safe even if someone damages or steals the camera itself.',
  },
  {
    label: 'Room to expand.',
    text: 'Start small, then add more cameras as your business grows, without replacing the whole system later.',
  },
  {
    label: 'Smart alerts.',
    text: 'Get notified only when something actually needs your attention, instead of sorting through hours of nothing.',
  },
]

function ImageSection({ image, title, children, reverse = false }) {
  return (
    <section className="mx-auto max-w-300 px-5 py-5">
      <div className={`flex flex-col items-center gap-8 md:gap-7.5 lg:flex-row ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        <Reveal className="w-full lg:w-1/2">
          <img src={image} alt={title} className="w-full rounded-2xl object-cover" />
        </Reveal>
        <Reveal delay={100} className="w-full pt-2.5 lg:w-1/2">
          <h2 className="text-[28px] font-semibold leading-[1.23] tracking-[-0.015em] text-secondary md:text-[32px]">
            {title}
          </h2>
          <div className="mt-4 space-y-4 text-[18px] leading-[1.6] text-text md:text-[20px]">{children}</div>
        </Reveal>
      </div>
    </section>
  )
}

function TextSection({ title, children }) {
  return (
    <section className="mx-auto max-w-300 px-5 py-5">
      <Reveal>
        <h2 className="text-[28px] font-semibold leading-[1.23] tracking-[-0.015em] text-secondary md:text-[32px]">
          {title}
        </h2>
        <div className="mt-4 space-y-4 text-[18px] leading-[1.6] text-text md:text-[20px]">{children}</div>
      </Reveal>
    </section>
  )
}

function SingleBlog() {
  return (
    <main className="bg-white">
      <section
        className="relative flex min-h-100 items-start bg-cover bg-center px-5 pt-48 sm:px-10 md:min-h-125 md:px-8 md:pt-60 xl:px-60 xl:pt-52"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 28, 69, 0.3), rgba(18, 28, 69, 0.3)), url(${heroBackground})`,
        }}
      >
        <div className="mx-auto w-full max-w-350">
          <div className="mb-4 flex items-center gap-3 text-base font-medium text-white md:text-xl">
            <a href="/" className="transition hover:text-primary">
              Home
            </a>
          </div>
          <Reveal
            as="h1"
            className="-ml-1 max-w-260 font-heading text-[32px] font-semibold leading-tight text-white sm:text-[40px] md:text-[52px] xl:text-[60px] xl:leading-tight"
          >
            Why CCTV Surveillance Systems Are Essential for Commercial Security
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-300 px-5 pt-16 pb-5">
        <Reveal>
          <p className="text-[18px] leading-[1.6] text-text md:text-[20px]">
            Businesses today face theft, vandalism, unauthorized access, employee safety concerns, and
            operational risks often all at once. A single unlocked back door or one blind spot in a
            parking lot can turn into a costly incident overnight. CCTV is no longer just a recording
            device sitting in the corner of a store. It has become a preventive security system that
            stops problems before they start, protecting people and property around the clock.
          </p>
        </Reveal>
      </section>

      <ImageSection image={section1Image} title="Security Threats Don't Wait, So Why Should You?">
        <p>
          A thief doesn’t call ahead, and a break-in doesn’t send a warning email. Trouble usually
          shows up when you least expect it, often outside business hours when no one is around to
          stop it. That’s why more business owners now install a security camera system for home and
          office use, long before anything actually goes wrong. Waiting until after an incident to
          think about security almost always costs more than acting early.
        </p>
        <p>
          Cameras don’t just capture what happened after the fact. They change behavior in real time,
          right at the moment someone is deciding whether to act. Someone thinking about stealing from
          your store thinks twice when they spot a lens pointed straight at them. That’s the real power
          of surveillance: it prevents problems instead of simply documenting them after the damage is
          done.
        </p>
      </ImageSection>

      <TextSection title="What CCTV Actually Does for Your Business">
        <p>
          Good cameras protect more than your cash register or your inventory. They protect your
          people, your property, and your reputation, all at the same time. A well-placed system
          covers entry points, storage areas, and high-traffic zones so nothing important goes
          unnoticed. Here’s what a solid setup actually gives you:
        </p>
        <ul className="list-disc space-y-3 pl-5">
          {whatCctvDoesPoints.map((point) => (
            <li key={point.label}>
              <strong className="font-bold text-secondary">{point.label}</strong> {point.text}
            </li>
          ))}
        </ul>
      </TextSection>

      <ImageSection image={section2Image} title="Office Surveillance Isn't Just About Catching Bad Actors" reverse>
        <p>
          Office surveillance cameras do double duty in ways many business owners don’t expect at
          first. Yes, they stop unauthorized access to server rooms, storage areas, and other
          sensitive spaces where a break-in would really hurt. But they also protect your employees
          just as much as they protect your equipment. If someone gets hurt on the job, or a conflict
          breaks out between staff, footage tells the real story instead of leaving everyone guessing.
        </p>
        <p>
          Many offices now link their cameras with door access systems, combining two layers of
          security into one simple setup. One dashboard shows you who entered, when they entered, and
          what happened next, all in a single view. It’s a small change that makes daily security
          management far less of a headache, especially for teams managing multiple entry points or
          shift changes.
        </p>
      </ImageSection>

      <TextSection title="Picking the Right System Actually Matters">
        <p>
          Not every camera on the market does the job well, and the difference often only becomes
          obvious after something goes wrong. Before you buy, it helps to check a few basics that
          separate a reliable system from a disappointing one:
        </p>
        <ul className="list-disc space-y-3 pl-5">
          {rightSystemPoints.map((point) => (
            <li key={point.label}>
              <strong className="font-bold text-secondary">{point.label}</strong> {point.text}
            </li>
          ))}
        </ul>
        <p>
          This is exactly where working with the right cctv camera company makes all the difference
          between a system that actually protects you and one that just looks good on paper. A rushed
          installation with cheap equipment almost always leaves blind spots, and blind spots are
          exactly where problems tend to happen.
        </p>
      </TextSection>

      <ImageSection image={section3Image} title="Finding the Best Fit for Your Business">
        <p>
          Every business is different, so the best security cameras for business aren’t the same for
          a warehouse and a retail shop, even though both need strong protection. A warehouse
          typically needs wide-area coverage and strong night vision to watch large, often dark spaces
          overnight. A retail store, on the other hand, usually needs sharp facial detail near checkout
          counters and entrances where most theft actually happens.
        </p>
        <p>
          Matching the system to your actual risks, rather than just buying the biggest package on the
          price list, saves money and gives you far better protection where it counts. A thoughtful
          setup built around your specific business will always outperform an expensive system that
          wasn’t designed with your risks in mind.
        </p>
      </ImageSection>

      <section className="mx-auto max-w-300 px-5 py-5 pb-20">
        <Reveal>
          <h2 className="text-[28px] font-semibold leading-[1.23] tracking-[-0.015em] text-secondary md:text-[32px]">
            The Bottom Line
          </h2>
          <div className="mt-4 space-y-4 text-[18px] leading-[1.6] text-text md:text-[20px]">
            <p>
              CCTV does more than watch your business from a corner of the ceiling. It stops trouble
              before it starts, protects your team on a daily basis, and gives you clear answers
              exactly when you need them most. Whether you run a single office or manage several
              locations across a city, the right cameras make your business genuinely safer and your
              day-to-day operations noticeably easier to manage.
            </p>
            <p>
              Ready to secure your business the right way? Visit ASSIPL and get a security setup built
              around your actual needs, not a generic package sold to everyone else.
            </p>
          </div>
        </Reveal>
      </section>
    </main>
  )
}

export default SingleBlog
