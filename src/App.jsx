import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import About from './pages/About'
import Career from './pages/Career'
import Csr from './pages/Csr'
import Home from './pages/Home'
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
