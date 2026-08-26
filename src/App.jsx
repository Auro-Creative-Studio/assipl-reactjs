import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import CmsLayout from './cms/components/layout/CmsLayout'
import ProtectedCmsRoute from './cms/components/layout/ProtectedCmsRoute'
import SuperAdminRoute from './cms/components/layout/SuperAdminRoute'
import BlogCreate from './cms/view/blogs/Create'
import BlogEdit from './cms/view/blogs/Edit'
import BlogList from './cms/view/blogs/List'
import ContactForm from './cms/view/ContactForm'
import CookieConsentsList from './cms/view/cookie/List'
import Dashboard from './cms/view/Dashboard'
import EnquiryForm from './cms/view/EnquiryForm'
import Login from './cms/view/Login'
import Media from './cms/view/Media'
import NewsletterSubscribers from './cms/view/NewsletterSubscribers'
import CmsContactPage from './cms/view/pages/contact/Contact'
import Profile from './cms/view/Profile'
import SeoCreate from './cms/view/seo/Create'
import SeoEdit from './cms/view/seo/Edit'
import SeoList from './cms/view/seo/List'
import UserCreate from './cms/view/users/Create'
import UserEdit from './cms/view/users/Edit'
import UserList from './cms/view/users/List'
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

function PublicLayout() {
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
        <Route path="/blogs/:slug" element={<SingleBlog />} />
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

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route element={<ProtectedCmsRoute />}>
        <Route path="/admin" element={<CmsLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="pages/contact" element={<CmsContactPage />} />
          <Route path="enquiries" element={<EnquiryForm />} />
          <Route path="contacts" element={<ContactForm />} />
          <Route path="newsletter-subscribers" element={<NewsletterSubscribers />} />
          <Route path="seo" element={<SeoList />} />
          <Route path="seo/create" element={<SeoCreate />} />
          <Route path="seo/edit/:id" element={<SeoEdit />} />
          <Route path="blogs" element={<BlogList />} />
          <Route path="blogs/create" element={<BlogCreate />} />
          <Route path="blogs/edit/:id" element={<BlogEdit />} />
          <Route path="cookie-consents" element={<CookieConsentsList />} />
          <Route path="media" element={<Media />} />
          <Route path="profile" element={<Profile />} />
          <Route element={<SuperAdminRoute />}>
            <Route path="users" element={<UserList />} />
            <Route path="users/create" element={<UserCreate />} />
            <Route path="users/edit/:id" element={<UserEdit />} />
          </Route>
        </Route>
      </Route>
      <Route path="/*" element={<PublicLayout />} />
    </Routes>
  )
}

export default App
