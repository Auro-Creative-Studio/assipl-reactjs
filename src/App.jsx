import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import About from './pages/About'
import Blogs from './pages/Blogs'
import Career from './pages/Career'
import Csr from './pages/Csr'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Process from './pages/Process'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Services from './pages/Services'
import SingleBlog from './pages/SingleBlog'
import SingleProduct from './pages/SingleProduct'
import SingleService from './pages/SingleService'
import TermsConditions from './pages/TermsConditions'
import './App.css'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/process" element={<Process />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service" element={<Services />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route
          path="/blogs/cctv-surveillance-systems-for-commercial-security"
          element={<SingleBlog />}
        />
        <Route path="/career" element={<Career />} />
        <Route path="/csr" element={<Csr />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/products/video-surveillance" element={<SingleProduct />} />
        <Route path="/services/operational-continuity-maintenance" element={<SingleService />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
