import heroBg from '../assets/terms.webp'
import LegalSection from '../components/LegalSection'
import Reveal from '../components/Reveal'
import { useSeoMeta } from '../hooks/useSeoMeta'

const contactDetails = [
  'Company Name: Automations Systems and Solutions (ASSIPL)',
  'Email: assipl@automationsystems.co.in',
  'Phone: 080 – 41692300 / 080 – 43751024',
  'Address: House No: 2497, GF, 17th Main, HAL 2nd Stage, Indiranagar, Bangalore – 560008.',
]

const sections = [
  {
    title: 'About the Company',
    blocks: [
      { type: 'p', text: 'This website is operated by:' },
      { type: 'ul', items: contactDetails },
      {
        type: 'p',
        text: 'The website provides information about our company, products, services, solutions, projects, maintenance support, and related business activities.',
      },
    ],
  },
  {
    title: 'Website Use',
    blocks: [
      { type: 'p', text: 'You agree to use this website only for lawful purposes.' },
      { type: 'p', text: 'You must not:' },
      {
        type: 'ul',
        items: [
          'Use the website for fraudulent, illegal, or harmful activities',
          'Attempt to gain unauthorised access to the website, server, or connected systems',
          'Introduce viruses, malware, or other harmful code',
          'Copy, scrape, reproduce, or misuse website content without permission',
          'Interfere with the website’s functionality, performance, or security',
          'Submit false, misleading, abusive, or unlawful information',
          'Use automated systems to overload or disrupt the website',
        ],
      },
      {
        type: 'p',
        text: 'Automations Systems and Solutions (ASSIPL) reserves the right to restrict or block access where misuse is suspected.',
      },
    ],
  },
  {
    title: 'Website Information',
    blocks: [
      {
        type: 'p',
        text: 'We aim to ensure that the information displayed on this website is accurate and up to date.',
      },
      {
        type: 'p',
        text: 'However, website content is provided for general informational purposes only. We do not guarantee that all information is complete, accurate, current, error-free, or suitable for every business requirement.',
      },
      {
        type: 'p',
        text: 'Product specifications, service descriptions, images, pricing, availability, timelines, technical details, and other information may change without prior notice.',
      },
    ],
  },
  {
    title: 'Enquiries and Contact Forms',
    blocks: [
      {
        type: 'p',
        text: 'Submitting an enquiry, contact form, request for quotation, consultation request, or service request does not create a binding agreement between you and Automations Systems and Solutions (ASSIPL).',
      },
      { type: 'p', text: 'A formal business relationship will begin only after:' },
      {
        type: 'ul',
        items: [
          'Requirements have been reviewed',
          'The project scope has been agreed',
          'Pricing and commercial terms have been confirmed',
          'A quotation, proposal, purchase order, or contract has been accepted',
          'Any required advance payment has been received',
        ],
      },
      {
        type: 'p',
        text: 'You are responsible for ensuring that all information submitted through the website is accurate and complete.',
      },
    ],
  },
  {
    title: 'Quotations and Proposals',
    blocks: [
      {
        type: 'p',
        text: 'Any quotation, estimate, proposal, or commercial offer provided by Automations Systems and Solutions (ASSIPL) may be subject to:',
      },
      {
        type: 'ul',
        items: [
          'A stated validity period',
          'Product and material availability',
          'Site conditions',
          'Technical feasibility',
          'Applicable taxes and statutory charges',
          'Delivery and installation requirements',
          'Third-party costs',
          'Final scope confirmation',
          'Client approvals',
        ],
      },
      {
        type: 'p',
        text: 'Prices may change if the project scope, quantity, specification, site location, installation requirement, or timeline changes.',
      },
    ],
  },
  {
    title: 'Products and Services',
    blocks: [
      {
        type: 'p',
        text: 'Descriptions of products, solutions, maintenance services, installations, integrations, and other services displayed on the website are general in nature.',
      },
      {
        type: 'p',
        text: 'The final scope, specification, quantity, warranty, delivery schedule, installation requirement, support obligation, and commercial terms will be defined in the applicable quotation, proposal, invoice, purchase order, or contract.',
      },
      {
        type: 'p',
        text: 'Automations Systems and Solutions (ASSIPL) reserves the right to modify, replace, discontinue, or update any product or service without prior notice.',
      },
    ],
  },
  {
    title: 'Payments',
    blocks: [
      {
        type: 'p',
        text: 'Where payments are applicable, payment terms will be stated in the relevant quotation, invoice, proposal, purchase order, or agreement.',
      },
      { type: 'p', text: 'Clients are required to make payments:' },
      {
        type: 'ul',
        items: [
          'Within the specified due date',
          'Through approved payment methods',
          'In accordance with agreed payment milestones',
          'Including applicable taxes and charges',
        ],
      },
      { type: 'p', text: 'Delayed payments may result in:' },
      {
        type: 'ul',
        items: [
          'Project delays',
          'Suspension of services',
          'Withholding of delivery',
          'Withholding of installation or support',
          'Additional charges',
          'Cancellation of the order or service',
        ],
      },
      {
        type: 'p',
        text: 'Payments already made may be non-refundable where procurement, customisation, mobilisation, installation, licensing, or service delivery has commenced.',
      },
    ],
  },
  {
    title: 'Cancellations and Refunds',
    blocks: [
      {
        type: 'p',
        text: 'Cancellation and refund eligibility will depend on the nature of the product or service and the terms agreed in writing.',
      },
      { type: 'p', text: 'Refunds may not be available for:' },
      {
        type: 'ul',
        items: [
          'Completed services',
          'Partially completed work',
          'Customised products or solutions',
          'Special-order materials',
          'Purchased equipment',
          'Software licences',
          'Third-party charges',
          'Installation work',
          'Site mobilisation',
          'Consultation, design, or engineering work already performed',
        ],
      },
      {
        type: 'p',
        text: 'Any approved refund may be subject to deductions for costs already incurred by Automations Systems and Solutions (ASSIPL).',
      },
    ],
  },
  {
    title: 'Delivery and Project Timelines',
    blocks: [
      {
        type: 'p',
        text: 'Any delivery, installation, implementation, maintenance, or project completion timeline provided is an estimate unless expressly confirmed in writing.',
      },
      { type: 'p', text: 'Timelines may be affected by:' },
      {
        type: 'ul',
        items: [
          'Product availability',
          'Supplier or manufacturer delays',
          'Site readiness',
          'Client approvals',
          'Payment delays',
          'Transportation issues',
          'Technical complications',
          'Government restrictions',
          'Weather conditions',
          'Events beyond our reasonable control',
        ],
      },
      {
        type: 'p',
        text: 'Automations Systems and Solutions (ASSIPL) will not be responsible for delays caused by the client, supplier, manufacturer, contractor, authority, or any event outside our reasonable control.',
      },
    ],
  },
  {
    title: 'Client Responsibilities',
    blocks: [
      { type: 'p', text: 'Where services, installations, or projects are involved, the client may be required to provide:' },
      {
        type: 'ul',
        items: [
          'Accurate project and site information',
          'Safe and timely site access',
          'Required permissions and approvals',
          'Electrical, network, and infrastructure availability',
          'Civil or structural readiness',
          'Safe working conditions',
          'Authorised representatives',
          'Timely decisions and approvals',
          'Payment according to agreed terms',
        ],
      },
      {
        type: 'p',
        text: 'Any delay, rework, or additional cost caused by incomplete client responsibilities may be charged separately.',
      },
    ],
  },
  {
    title: 'Third-Party Products and Services',
    blocks: [
      {
        type: 'p',
        text: 'Our products or services may include hardware, software, platforms, integrations, licences, cloud services, or components provided by third parties.',
      },
      { type: 'p', text: 'Third-party products and services are subject to their own:' },
      {
        type: 'ul',
        items: [
          'Terms and conditions',
          'Privacy policies',
          'Software licences',
          'Warranties',
          'Support arrangements',
          'Availability',
          'Manufacturer conditions',
        ],
      },
      {
        type: 'p',
        text: 'Automations Systems and Solutions (ASSIPL) is not responsible for changes, failures, interruptions, limitations, or policies imposed by third-party providers.',
      },
    ],
  },
  {
    title: 'Warranties',
    blocks: [
      {
        type: 'p',
        text: 'Product warranties, where applicable, may be provided by the manufacturer, distributor, supplier, or Automations Systems and Solutions (ASSIPL).',
      },
      { type: 'p', text: 'Warranty coverage may be subject to:' },
      {
        type: 'ul',
        items: [
          'Proper installation',
          'Normal and authorised usage',
          'Manufacturer warranty conditions',
          'Valid invoices and documentation',
          'Serial-number verification',
          'Required maintenance',
          'Timely reporting of defects',
        ],
      },
      { type: 'p', text: 'Warranty coverage may not apply to damage caused by:' },
      {
        type: 'ul',
        items: [
          'Misuse or negligence',
          'Physical damage',
          'Power fluctuations or electrical faults',
          'Water, fire, or environmental damage',
          'Unauthorised repairs or modifications',
          'Improper handling',
          'Third-party interference',
          'Failure to follow operating instructions',
        ],
      },
      {
        type: 'p',
        text: 'Applicable warranty terms will be specified in the relevant quotation, invoice, proposal, contract, or warranty document.',
      },
    ],
  },
  {
    title: 'Maintenance and Support',
    blocks: [
      {
        type: 'p',
        text: 'Maintenance, annual maintenance contracts, technical support, remote assistance, site visits, replacement services, and response timelines will be governed by the specific maintenance agreement or commercial document.',
      },
      { type: 'p', text: 'Services not included in the agreed maintenance scope may be charged separately.' },
      {
        type: 'p',
        text: 'Availability of spare parts, replacement products, and manufacturer support may depend on third-party suppliers and product lifecycle conditions.',
      },
    ],
  },
  {
    title: 'Intellectual Property',
    blocks: [
      {
        type: 'p',
        text: 'All website content, including but not limited to text, images, graphics, logos, icons, videos, layouts, designs, documents, code, technical material, and brand elements, is owned by, licensed to, or authorised for use by Automations Systems and Solutions (ASSIPL).',
      },
      {
        type: 'p',
        text: 'You may not copy, modify, reproduce, republish, distribute, sell, licence, or commercially exploit website content without prior written permission.',
      },
    ],
  },
  {
    title: 'User-Submitted Content',
    blocks: [
      { type: 'p', text: 'Any information, documents, images, messages, feedback, or materials submitted to us must not:' },
      {
        type: 'ul',
        items: [
          'Violate any applicable law',
          'Infringe intellectual property rights',
          'Contain harmful software',
          'Contain offensive, abusive, or misleading content',
          'Breach another person’s privacy or confidentiality',
          'Include unauthorised sensitive or confidential information',
        ],
      },
      { type: 'p', text: 'You remain responsible for the information and content you submit.' },
    ],
  },
  {
    title: 'Privacy',
    blocks: [
      {
        type: 'p',
        text: 'Personal information submitted through the website will be handled in accordance with our Privacy Policy.',
      },
      { type: 'p', text: 'By using the website or submitting information, you acknowledge that your data may be processed for:' },
      {
        type: 'ul',
        items: [
          'Responding to enquiries',
          'Preparing quotations and proposals',
          'Providing requested services',
          'Customer communication',
          'Technical support',
          'Business administration',
          'Website security',
          'Legal and regulatory compliance',
        ],
      },
    ],
  },
  {
    title: 'Disclaimer',
    blocks: [
      { type: 'p', text: 'The website and its content are provided on an "as is" and "as available" basis.' },
      { type: 'p', text: 'To the extent permitted by law, Automations Systems and Solutions (ASSIPL) does not guarantee:' },
      {
        type: 'ul',
        items: [
          'Continuous website availability',
          'Error-free operation',
          'Accuracy of all website content',
          'Suitability for a particular purpose',
          'Compatibility with every browser or device',
          'Freedom from viruses or technical issues',
          'Availability of every listed product or service',
        ],
      },
      { type: 'p', text: 'You use the website and rely on its content at your own discretion.' },
    ],
  },
  {
    title: 'Limitation of Liability',
    blocks: [
      {
        type: 'p',
        text: 'To the maximum extent permitted by applicable law, Automations Systems and Solutions (ASSIPL) will not be liable for any indirect, incidental, special, consequential, or business-related loss arising from:',
      },
      {
        type: 'ul',
        items: [
          'Use or inability to use the website',
          'Reliance on website information',
          'Website interruptions',
          'Third-party links, products, or services',
          'Data loss',
          'Security incidents outside our reasonable control',
          'Business interruption',
          'Loss of revenue, profits, contracts, or opportunities',
          'Delays caused by suppliers, manufacturers, clients, or external authorities',
        ],
      },
      {
        type: 'p',
        text: 'Nothing in these Terms excludes liability that cannot legally be excluded under applicable law.',
      },
    ],
  },
  {
    title: 'Indemnity',
    blocks: [
      {
        type: 'p',
        text: 'You agree to indemnify and hold harmless Automations Systems and Solutions (ASSIPL), its employees, directors, representatives, partners, and service providers from claims, damages, liabilities, costs, or expenses arising from:',
      },
      {
        type: 'ul',
        items: [
          'Your misuse of the website',
          'Your violation of these Terms',
          'Your unlawful activity',
          'Information or content submitted by you',
          'Your infringement of third-party rights',
        ],
      },
    ],
  },
  {
    title: 'External Links',
    blocks: [
      { type: 'p', text: 'This website may contain links to external websites.' },
      {
        type: 'p',
        text: 'Such links are provided for convenience only. Automations Systems and Solutions (ASSIPL) does not control and is not responsible for the content, security, availability, privacy practices, products, or services of third-party websites.',
      },
      { type: 'p', text: 'Accessing external websites is at your own risk.' },
    ],
  },
  {
    title: 'Website Availability',
    blocks: [
      {
        type: 'p',
        text: 'Automations Systems and Solutions (ASSIPL) may modify, suspend, restrict, or discontinue any part of the website at any time.',
      },
      {
        type: 'p',
        text: 'We are not liable if the website becomes temporarily or permanently unavailable due to maintenance, technical faults, security concerns, upgrades, or circumstances beyond our control.',
      },
    ],
  },
  {
    title: 'Force Majeure',
    blocks: [
      {
        type: 'p',
        text: 'Automations Systems and Solutions (ASSIPL) will not be responsible for delays or failure to perform obligations caused by events beyond our reasonable control, including:',
      },
      {
        type: 'ul',
        items: [
          'Natural disasters',
          'Fire or flooding',
          'War or civil disturbance',
          'Government restrictions',
          'Labour disputes',
          'Internet or power failures',
          'Cyberattacks',
          'Supplier or manufacturer failures',
          'Transportation disruptions',
          'Public health emergencies',
          'Import or regulatory restrictions',
        ],
      },
    ],
  },
  {
    title: 'Termination',
    blocks: [
      { type: 'p', text: 'We may suspend or terminate access to the website if you:' },
      {
        type: 'ul',
        items: [
          'Violate these Terms',
          'Misuse the website',
          'Engage in unlawful activity',
          'Threaten website security',
          'Infringe the rights of others',
        ],
      },
      { type: 'p', text: 'Termination does not affect rights or obligations that arose before termination.' },
    ],
  },
  {
    title: 'Governing Law and Jurisdiction',
    blocks: [
      { type: 'p', text: 'These Terms and Conditions will be governed by the laws of India.' },
      {
        type: 'p',
        text: 'Any dispute arising from these Terms, the website, or related services will be subject to the jurisdiction of the competent courts in Bangalore, Karnataka, India.',
      },
    ],
  },
  {
    title: 'Changes to These Terms',
    blocks: [
      { type: 'p', text: 'Automations Systems and Solutions (ASSIPL) may update these Terms and Conditions periodically.' },
      { type: 'p', text: 'Any updated version will be published on this page with a revised "Last Updated" date.' },
      {
        type: 'p',
        text: 'Continued use of the website after changes are published means that you accept the revised Terms and Conditions.',
      },
    ],
  },
  {
    title: 'Contact Information',
    blocks: [
      { type: 'p', text: 'For questions regarding these Terms and Conditions, contact:' },
      {
        type: 'ul',
        items: [
          'Automations Systems and Solutions (ASSIPL)',
          'Email: assipl@automationsystems.co.in',
          'Phone: 080 – 41692300 / 080 – 43751024',
          'Address: House No: 2497, GF, 17th Main, HAL 2nd Stage, Indiranagar, Bangalore – 560008.',
        ],
      },
    ],
  },
]

function TermsConditions() {
  useSeoMeta({
    title: 'Terms and Conditions | ASSIPL',
    description: 'Read the terms and conditions governing the use of the ASSIPL website and services.',
  })

  return (
    <main className="bg-white">
      <section
        className="relative flex min-h-100 items-start bg-cover bg-center px-5 pt-48 sm:px-10 md:min-h-125 md:px-8 md:pt-60 xl:px-60 xl:pt-52"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)), url(${heroBg})` }}
      >
        <div className="mx-auto w-full max-w-300 pt-0.5">
          <a href="/" className="text-[20px] font-semibold capitalize leading-normal text-background transition-colors hover:text-white">
            Home
          </a>
          <Reveal
            as="h1"
            className="-ml-1 mt-2.5 text-[36px] font-semibold leading-[1.05] text-white md:text-[70px]"
          >
            Terms and Conditions
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-300">
          <Reveal as="p" className="text-[16px] md:text-[18px] font-semibold uppercase tracking-wide">Last Updated: 31-07-2026</Reveal>
          <Reveal as="p" delay={100} className="mt-4 text-body text-text">Welcome to Automations Systems and Solutions (ASSIPL).</Reveal>
          <Reveal as="p" delay={200} className="mt-4 text-body text-text">
            These Terms and Conditions govern your access to and use of this website, including any content,
            features, enquiry forms, products, services, solutions, and information made available through it.
          </Reveal>
          <Reveal as="p" delay={300} className="mt-4 text-body text-text">
            By accessing or using this website, you agree to these Terms and Conditions. If you do not agree with
            these terms, please discontinue using the website.
          </Reveal>

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

export default TermsConditions
