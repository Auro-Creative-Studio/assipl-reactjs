import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import About from './pages/About'
import Career from './pages/Career'
import Csr from './pages/Csr'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Process from './pages/Process'
import Services from './pages/Services'
import SingleProduct from './pages/SingleProduct'
import './App.css'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/process" element={<Process />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service" element={<Services />} />
        <Route path="/services" element={<Services />} />
        <Route path="/career" element={<Career />} />
        <Route path="/csr" element={<Csr />} />
        <Route path="/products/video-surveillance" element={<SingleProduct />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
