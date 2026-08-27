import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import CmsLayout from './cms/components/layout/CmsLayout'
import ProtectedCmsRoute from './cms/components/layout/ProtectedCmsRoute'
import SuperAdminRoute from './cms/components/layout/SuperAdminRoute'
import BlogCreate from './cms/view/blogs/Create'
import BlogEdit from './cms/view/blogs/Edit'
import BlogList from './cms/view/blogs/List'
import ProductCreate from './cms/view/products/Create'
import ProductEdit from './cms/view/products/Edit'
import ProductList from './cms/view/products/List'
import SingleServiceCreate from './cms/view/singleServices/Create'
import SingleServiceEdit from './cms/view/singleServices/Edit'
import SingleServiceList from './cms/view/singleServices/List'
import CareerPositionCreate from './cms/view/careerPositions/Create'
import CareerPositionEdit from './cms/view/careerPositions/Edit'
import CareerPositionList from './cms/view/careerPositions/List'
import CareerApplicationList from './cms/view/careerApplications/List'
import ContactForm from './cms/view/ContactForm'
import CookieConsentsList from './cms/view/cookie/List'
import Dashboard from './cms/view/Dashboard'
import EnquiryForm from './cms/view/EnquiryForm'
import Login from './cms/view/Login'
import Media from './cms/view/Media'
import NewsletterSubscribers from './cms/view/NewsletterSubscribers'
import CmsAboutPage from './cms/view/pages/about/About'
import CmsContactPage from './cms/view/pages/contact/Contact'
import CmsCsrPage from './cms/view/pages/csr/Csr'
import CmsHomePage from './cms/view/pages/home/Home'
import CmsProcessPage from './cms/view/pages/process/Process'
import CmsServicesPage from './cms/view/pages/services/Services'
import Profile from './cms/view/Profile'
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
import Products from './pages/Products'
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
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<SingleProduct />} />
        <Route path="/strategic-planning-design" element={<SingleService routeSlug="strategic-planning-design" />} />
        <Route path="/core-project-execution-sitc" element={<SingleService routeSlug="core-project-execution-sitc" />} />
        <Route path="/services/:slug" element={<SingleService />} />
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

          <Route path="pages/home" element={<CmsHomePage />} />
          <Route path="pages/process" element={<CmsProcessPage />} />
          <Route path="pages/contact" element={<CmsContactPage />} />
          <Route path="pages/csr" element={<CmsCsrPage />} />
          <Route path="pages/about" element={<CmsAboutPage />} />
          <Route path="pages/services" element={<CmsServicesPage />} />
          <Route path="enquiries" element={<EnquiryForm />} />
          <Route path="contacts" element={<ContactForm />} />
          <Route path="newsletter-subscribers" element={<NewsletterSubscribers />} />
          <Route path="blogs" element={<BlogList />} />
          <Route path="blogs/create" element={<BlogCreate />} />
          <Route path="blogs/edit/:id" element={<BlogEdit />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
          <Route path="single-services" element={<SingleServiceList />} />
          <Route path="single-services/create" element={<SingleServiceCreate />} />
          <Route path="single-services/edit/:id" element={<SingleServiceEdit />} />
          <Route path="career-positions" element={<CareerPositionList />} />
          <Route path="career-positions/create" element={<CareerPositionCreate />} />
          <Route path="career-positions/edit/:id" element={<CareerPositionEdit />} />
          <Route path="career-applications" element={<CareerApplicationList />} />
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

