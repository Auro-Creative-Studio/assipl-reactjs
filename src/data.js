import productImage from './assets/products/video-surveillance-1.webp'
import productImageTwo from './assets/products/video-surveillance-2.webp'
import productImageThree from './assets/products/video-surveillance-3.webp'
import productImageFour from './assets/products/video-surveillance-4.webp'
import productImageFive from './assets/products/video-surveillance-5.webp'

export const products = [
  { title: 'Video Surveillance and Smart Cameras', description: 'AI-powered cameras for intelligent surveillance, automated threat detection, and secure access monitoring.', image: productImage },
  { title: 'Access Control Systems', description: 'Smart access control for secure entry, identity verification, and real-time monitoring.', image: productImageTwo },
  { title: 'Fire Detection Systems', description: 'Smart fire detection for early alerts, rapid response, and enhanced safety.', image: productImageThree },
  { title: 'Intrusion Detection Systems', description: 'Advanced multi-tiered networks providing instant perimeter and core boundary breach alerts.', image: productImageFour },
  { title: 'Gate Automation Systems', description: 'Heavy-duty physical security solutions managing high-volume pedestrian and vehicular logistics.', image: productImageFive },
  { title: 'Gas Suppression Systems', description: 'Clean-agent gas suppression systems engineered to protect data centres and server rooms.', image: productImage },
]

export const services = [
  { number: '01', title: 'Strategic Design & Management', description: 'Comprehensive site surveys, precise system configuration, and dedicated project management.' },
  { number: '02', title: 'SITC Execution', description: 'Flawless supply, installation, testing and commissioning executed by trained specialists.' },
  { number: '03', title: 'Operational Training', description: 'Hands-on training on system operations to ensure your internal team is confident with the infrastructure.' },
  { number: '04', title: 'Lifecycle Maintenance', description: 'Post-sales maintenance, warranty tracking and annual maintenance services to maximise system uptime.' },
]

export const testimonials = [
  {
    quote:
      'The ASSIPL team is highly professional in all dealings. Their cooperation and readiness to provide solutions have been remarkable. Since our association, it has truly been a pleasure working with such a supportive and dedicated team.',
    company: 'SBI',
  },
  {
    quote:
      'I am happy to state that the services provided by Automation Security & Systems to our company has been very satisfactory in all respects. Thank you for the support extended to us, over the years.',
    company: 'SATTVA',
  },
  {
    quote:
      'We have been associated with Anuj for the past 10 years, and working with him and his team has been a pleasure. Their dedication ensures that all systems function flawlessly around the clock.',
    company: 'AXIS BANK',
  },
  {
    quote:
      'We are truly pleased with the services offered by your company in all respects. We sincerely thank you for the continued support. Since our association in 2022, your consistent commitment and quality service have been greatly valued.',
    company: 'HDFC BANK',
  },
]

export const locations = [
  { name: 'Punjab', lon: 76.8, lat: 30.7 },
  { name: 'Haryana', lon: 76.5, lat: 29 },
  { name: 'Delhi', lon: 77.2, lat: 28.6 },
  { name: 'Rajasthan', lon: 75.8, lat: 26.9 },
  { name: 'Uttar Pradesh', lon: 80.9, lat: 26.8 },
  { name: 'Madhya Pradesh', lon: 77.4, lat: 23.3 },
  { name: 'Pune', lon: 73.9, lat: 18.5 },
  { name: 'Mumbai', lon: 72.9, lat: 19.1 },
  { name: 'Goa', lon: 74, lat: 15.3 },
  { name: 'Kerala', lon: 76.3, lat: 10 },
  { name: 'Tamil Nadu', lon: 80.3, lat: 13.1 },
  { name: 'Andhra Pradesh', lon: 80.6, lat: 16.5 },
  { name: 'Hyderabad', lon: 78.5, lat: 17.4 },
  { name: 'Karnataka', lon: 77.6, lat: 12.97, hq: true },
]
