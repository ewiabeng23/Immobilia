import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { LangProvider } from './hooks/useLang'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Listings from './pages/Listings'
import PropertyDetail from './pages/PropertyDetail'
import ListProperty from './pages/ListProperty'
import About from './pages/About'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppRoutes() {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main>
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/listings"     element={<Listings />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/list"         element={<ListProperty />} />
          <Route path="/about"        element={<About />} />
          <Route path="/admin"        element={<Admin />} />
          <Route path="*"             element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LangProvider>
  )
}
