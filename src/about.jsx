import React from "react";
import { ArrowLeft, CheckCircle2, Leaf, MapPin, Phone } from "lucide-react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./responsive.css";
import "./about.css";

const PHONE = import.meta.env.VITE_CONTACT_PHONE || "021 081 31690";
const EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "Neerajchauhangvr@gmail.com";

function AboutPage() {
  return (
    <div className="site about-page">
      <header className="header">
        <div className="container nav">
          <a className="brand" href="./">
            <span className="brand-mark"><Leaf size={28} fill="currentColor" /></span>
            <span><b>AVCENA</b><small>GARDENING & LAWNMOWING</small></span>
          </a>
          <a className="phone" href={`tel:${PHONE.replaceAll(" ", "")}`}>
            <span className="phone-icon"><Phone size={18} fill="currentColor" /></span>
            <span><small>Call Us Now</small><b>{PHONE}</b></span>
          </a>
        </div>
      </header>

      <main className="about-page-main">
        <div className="container about-page-grid">
          <section className="about-page-copy">
            <p className="eyebrow green">ABOUT AVCENA</p>
            <h1>Your Local Gardening<br />& Lawn Care Experts</h1>
            <p>AVCENA Gardening & Lawnmowing is an Auckland-focused lawn and garden care business. We are passionate about providing tidy, reliable and affordable outdoor maintenance.</p>
            <ul className="checks">
              {["Experienced & Friendly Team", "Quality Equipment", "Reliable Service", "Fully Insured*"].map((item) => (
                <li key={item}><CheckCircle2 size={22} />{item}</li>
              ))}
            </ul>
            <small className="note">*Only display “Fully Insured” once your business has appropriate insurance.</small>
            <a className="back-home" href="./"><ArrowLeft size={16} /> Back to home</a>
          </section>
          <div className="about-page-photo">
            <img src={`${import.meta.env.BASE_URL}avcena-homepage-design.png`} alt="AVCENA gardener trimming a hedge" />
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-simple">
          <div className="footer-brand"><Leaf size={28} /><span><b>AVCENA</b><small>GARDENING & LAWNMOWING</small></span></div>
          <span className="footer-location"><MapPin size={15} /> Auckland, New Zealand</span>
          <div className="footer-meta"><span>© 2026 AVCENA Gardening & Lawnmowing</span><a href={`mailto:${EMAIL}`}>Contact us by email</a></div>
          <a className="footer-call" href={`tel:${PHONE.replaceAll(" ", "")}`} aria-label={`Call AVCENA on ${PHONE}`}><Phone size={20} /><small>CALL US</small></a>
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("about-root")).render(<AboutPage />);
