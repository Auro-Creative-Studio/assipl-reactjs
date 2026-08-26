import heroBg from '../assets/terms.webp'
import LegalSection from '../components/LegalSection'

const sections = [
  {
    title: 'Information We Collect',
    blocks: [
      { type: 'p', text: 'We may collect personal information that you voluntarily provide, including:' },
      {
        type: 'ul',
        items: [
          'Name',
          'Company name',
          'Email address',
          'Phone number',
          'Message or enquiry details',
          'Information submitted through contact forms',
          'Any other information you choose to provide',
        ],
      },
      { type: 'p', text: 'We also automatically collect certain technical information, including:' },
      {
        type: 'ul',
        items: [
          'IP address',
          'Browser type',
          'Device type',
          'Operating system',
          'Pages visited',
          'Time spent on the website',
          'Referring website',
          'Cookie and analytics data',
        ],
      },
    ],
  },
  {
    title: 'How We Use Your Information',
    blocks: [
      { type: 'p', text: 'We may use the information collected to:' },
      {
        type: 'ul',
        items: [
          'Respond to enquiries and service requests',
          'Contact you regarding our products or services',
          'Prepare quotations, proposals, or consultations',
          'Improve website performance and user experience',
          'Maintain website security',
          'Prevent spam, misuse, or fraudulent activity',
          'Analyse website traffic and visitor behaviour',
          'Meet legal, regulatory, or contractual obligations',
        ],
      },
      {
        type: 'p',
        text: 'We will not use your personal information for purposes unrelated to those described in this Privacy Policy without an appropriate legal basis or your consent.',
      },
    ],
  },
  {
    title: 'Contact Forms',
    blocks: [
      {
        type: 'p',
        text: 'When you submit a form through our website, the information entered may be sent to our internal team, email system, CRM platform, or authorised service provider so that we can respond to your request.',
      },
      {
        type: 'p',
        text: 'Please do not submit confidential, financial, medical, or highly sensitive information through general contact forms.',
      },
    ],
  },
  {
    title: 'Cookies',
    blocks: [
      { type: 'p', text: 'Our website may use cookies and similar technologies to:' },
      {
        type: 'ul',
        items: [
          'Remember user preferences',
          'Improve website functionality',
          'Analyse website traffic',
          'Measure website performance',
          'Support security and spam protection',
          'Provide relevant advertising, where applicable',
        ],
      },
      {
        type: 'p',
        text: 'You may control or disable cookies through your browser settings. Disabling certain cookies may affect how some parts of the website function.',
      },
    ],
  },
  {
    title: 'Analytics and Third-Party Services',
    blocks: [
      { type: 'p', text: 'We may use third-party tools and services such as:' },
      {
        type: 'ul',
        items: [
          'Website analytics platforms',
          'Customer relationship management systems',
          'Email service providers',
          'Hosting providers',
          'Cloud storage services',
          'Spam prevention services',
          'Embedded maps, videos, or social media tools',
        ],
      },
      {
        type: 'p',
        text: 'These third parties may process limited information according to their own privacy policies and service terms.',
      },
      {
        type: 'p',
        text: 'We recommend reviewing the privacy policies of any third-party service you access through our website.',
      },
    ],
  },
  {
    title: 'How We Share Information',
    blocks: [
      { type: 'p', text: 'We do not sell or rent your personal information.' },
      { type: 'p', text: 'We may share information with:' },
      {
        type: 'ul',
        items: [
          'Employees and authorised team members',
          'Hosting and technical service providers',
          'CRM and communication platforms',
          'Analytics and security providers',
          'Professional advisers',
          'Government authorities or regulators, where legally required',
          'Business partners involved in delivering a requested service',
        ],
      },
      {
        type: 'p',
        text: 'Information is shared only where reasonably necessary for business operations, service delivery, security, or legal compliance.',
      },
    ],
  },
  {
    title: 'Data Security',
    blocks: [
      {
        type: 'p',
        text: 'We use reasonable administrative, technical, and organisational measures to protect personal information against:',
      },
      { type: 'ul', items: ['Unauthorised access', 'Loss', 'Misuse', 'Alteration', 'Disclosure', 'Destruction'] },
      {
        type: 'p',
        text: 'However, no internet transmission or electronic storage system can be guaranteed to be completely secure.',
      },
    ],
  },
  {
    title: 'Data Retention',
    blocks: [
      { type: 'p', text: 'We retain personal information only for as long as reasonably necessary to:' },
      {
        type: 'ul',
        items: [
          'Respond to enquiries',
          'Deliver requested services',
          'Maintain business records',
          'Resolve disputes',
          'Enforce agreements',
          'Comply with legal obligations',
        ],
      },
      {
        type: 'p',
        text: 'When information is no longer required, we may securely delete, anonymise, or archive it.',
      },
    ],
  },
  {
    title: 'Your Rights',
    blocks: [
      { type: 'p', text: 'Depending on the laws applicable to you, you may have the right to:' },
      {
        type: 'ul',
        items: [
          'Request access to your personal information',
          'Request correction of inaccurate information',
          'Request deletion of your information',
          'Withdraw consent',
          'Object to certain uses of your information',
          'Request restriction of processing',
          'Request a copy of your information',
          'Raise a complaint with an appropriate authority',
        ],
      },
      { type: 'p', text: 'To exercise any applicable rights, contact us using the details provided below.' },
    ],
  },
  {
    title: 'Marketing Communications',
    blocks: [
      {
        type: 'p',
        text: 'We may send marketing communications only where permitted by law or where you have provided consent.',
      },
      { type: 'p', text: 'You may unsubscribe from marketing messages at any time by:' },
      {
        type: 'ul',
        items: [
          'Using the unsubscribe option in the communication',
          'Contacting us directly',
          'Updating your communication preferences',
        ],
      },
      { type: 'p', text: 'Service-related messages may still be sent when necessary.' },
    ],
  },
  {
    title: 'External Links',
    blocks: [
      { type: 'p', text: 'Our website may contain links to external websites.' },
      {
        type: 'p',
        text: 'We are not responsible for the privacy practices, security, availability, or content of third-party websites. Visiting external websites is at your own discretion.',
      },
    ],
  },
  {
    title: "Children's Privacy",
    blocks: [
      { type: 'p', text: 'Our website and services are not intended for children unless specifically stated otherwise.' },
      {
        type: 'p',
        text: 'We do not knowingly collect personal information from children without appropriate consent. If you believe that a child has submitted personal information through our website, please contact us so that we can review and remove it where appropriate.',
      },
    ],
  },
  {
    title: 'International Data Processing',
    blocks: [
      {
        type: 'p',
        text: 'Some service providers used by our website may process or store information in countries other than your own.',
      },
      {
        type: 'p',
        text: 'Where applicable, we take reasonable steps to ensure that information is handled using appropriate safeguards.',
      },
    ],
  },
  {
    title: 'Changes to This Privacy Policy',
    blocks: [
      { type: 'p', text: 'We may update this Privacy Policy periodically to reflect:' },
      {
        type: 'ul',
        items: [
          'Changes to our services',
          'Changes to website functionality',
          'New technologies',
          'Legal or regulatory requirements',
          'Changes to third-party integrations',
        ],
      },
      {
        type: 'p',
        text: 'The revised policy will be published on this page with an updated "Last Updated" date.',
      },
    ],
  },
  {
    title: 'Contact Us',
    blocks: [
      { type: 'p', text: 'For questions, requests, or concerns regarding this Privacy Policy, contact:' },
      {
        type: 'ul',
        items: [
          'Email: info@automationsystems.co.in',
          'Phone: 080 – 41692300 / 080 – 43751024',
          'Address: #2497, Ground Floor, 17th Main, HAL 2nd Stage, Indiranagar, Bangalore, Karnataka – 560008.',
        ],
      },
    ],
  },
]

function PrivacyPolicy() {
  return (
    <main className="bg-white">
      <section
        className="relative flex min-h-125 items-center bg-cover bg-center px-5 pt-28"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)), url(${heroBg})` }}
      >
        <div className="mx-auto w-full max-w-300 pt-0.5">
          <a href="/" className="text-[20px] font-semibold capitalize leading-normal text-background transition-colors hover:text-white">
            Home
          </a>
          <h1 className="-ml-1 mt-2.5 text-[36px] font-semibold leading-[1.05] text-white md:text-[70px]">
            Privacy Policy
          </h1>
        </div>
      </section>

      <section className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-300">
          <p className="text-[18px] font-semibold uppercase tracking-wide">Last Updated: 31-07-2026</p>
          <p className="mt-4 text-[18px] leading-8 text-text">
            ASSIPL respects your privacy and is committed to protecting the personal information you share with us
            through this website.
          </p>
          <p className="mt-4 text-[18px] leading-8 text-text">
            This Privacy Policy explains how we collect, use, store, and protect your information when you visit
            our website, submit a form, contact us, or use our services.
          </p>

          <div className="mt-8">
            {sections.map((section, index) => (
              <LegalSection key={section.title} number={index + 1} title={section.title} blocks={section.blocks} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default PrivacyPolicy
