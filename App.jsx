import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Cards from './pages/Cards.jsx';
import Book from './pages/Book.jsx';
import Contact from './pages/Contact.jsx';
import Admin from './pages/Admin.jsx';
import { INSTAGRAM_URL, EMAIL } from './api.js';

export const Moons = () => (
  <div className="moons" aria-hidden="true">
    {['new', 'wax1', 'wax2', 'full', 'wan1', 'wan2', 'new'].map((p, i) => <span key={i} className={p} />)}
  </div>
);

const ScrollTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

export default function App() {
  return (
    <>
      <ScrollTop />
      <header className="nav">
        <Link to="/"><img src="/images/logo-wordmark.png" alt="Sitaraah Wellness" className="nav-logo" /></Link>
        <nav>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/cards">Affirmation Cards</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <Link to="/book" className="btn btn-small">Book a session</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/book" element={<Book />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<section className="section narrow"><h1>Page not found</h1><Link to="/" className="btn">Back home</Link></section>} />
        </Routes>
      </main>
      <footer className="footer">
        <img src="/images/logo-emblem.png" alt="" className="footer-emblem" />
        <Moons />
        <p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">@sitaraah_wellness</a>
          {' '}&nbsp;|&nbsp;{' '}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
        <small>&copy; {new Date().getFullYear()} Sitaraah Wellness</small>
      </footer>
    </>
  );
}
