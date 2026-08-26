import React from "react";
import { createRoot } from "react-dom/client";
import {
  Phone, ArrowRight, Leaf, Star, ShieldCheck, CircleDollarSign,
  Clock3, Scissors, Sprout, TreePine, Trash2, CalendarDays,
  MapPin, Upload, Send, CheckCircle2, Menu, X
} from "lucide-react";
import "./styles.css";
import "./responsive.css";

const PHONE = import.meta.env.VITE_CONTACT_PHONE || "021 081 31690";
const EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "Neerajchauhangvr@gmail.com";
const AUTO_REPLY = import.meta.env.VITE_AUTO_REPLY || "Thanks for your interest in AVCENA Gardening & Lawnmowing. We will contact you shortly.";
const API_ENDPOINT = import.meta.env.VITE_API_URL || "/api/submit";
const USE_BACKEND = Boolean(import.meta.env.VITE_API_URL) || !import.meta.env.PROD;

const services = [
  ["Lawn Mowing", "Regular or one-off lawn mowing to keep your lawn looking perfect.", Scissors],
  ["Lawn Edging", "Neat and clean edges for a professional finish.", Leaf],
  ["Garden Maintenance", "Weeding, trimming, pruning and general garden care.", Sprout],
  ["Hedge Trimming", "Keep your hedges neat, healthy and well shaped.", TreePine],
  ["Weed Removal", "Effective weed control to keep your garden clean.", Sprout],
  ["Garden Clean Ups", "One-off or seasonal garden clean ups.", Trash2],
  ["Green Waste Removal", "We remove and dispose of green waste responsibly.", Trash2],
  ["Regular Maintenance", "Weekly, fortnightly or monthly garden and lawn care.", CalendarDays]
];

const areas = [
  "Mt Albert", "St Lukes", "Sandringham", "Epsom",
  "Mt Roskill", "Avondale", "New Lynn", "Blockhouse Bay",
  "Henderson", "Glen Eden", "Titirangi", "Surrounding Auckland"
];

function App() {
  const [menu, setMenu] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitted(false);
    setSubmitError("");
    const form = event.currentTarget;
    try {
      if (!USE_BACKEND) {
        const fields = {
          _subject: "New AVCENA quote enquiry",
          _autoresponse: AUTO_REPLY,
          _next: `${window.location.origin}${import.meta.env.BASE_URL}thanks.html`
        };
        Object.entries(fields).forEach(([name, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          form.appendChild(input);
        });
        form.method = "POST";
        form.action = `https://formsubmit.co/${EMAIL}`;
        HTMLFormElement.prototype.submit.call(form);
        return;
      }
      const formData = new FormData(form);
      formData.set("_subject", "New AVCENA quote enquiry");
      formData.set("_autoresponse", AUTO_REPLY);
      const response = await fetch(API_ENDPOINT, { method: "POST", body: formData });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Submission failed");
      }
      setSubmitted(true);
      form.reset();
    } catch (error) {
      if (!USE_BACKEND) {
        const fields = [...new FormData(form).entries()]
          .filter(([name, value]) => typeof value === "string" && name !== "_subject")
          .map(([name, value]) => `${name}: ${value}`)
          .join("\n");
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("New AVCENA quote enquiry")}&body=${encodeURIComponent(fields)}`;
        setSubmitError("Your email app is opening with the enquiry. Please press Send to complete it.");
      } else {
        setSubmitError(error.message);
        console.error(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="site">
      <header className="header">
        <div className="container nav">
          <button className="brand" onClick={() => scrollTo("home")} aria-label="AVCENA home">
            <span className="brand-mark"><Leaf size={28} fill="currentColor"/></span>
            <span><b>AVCENA</b><small>GARDENING & LAWNMOWING</small></span>
          </button>
          <button
            className="menu-btn"
            type="button"
            aria-label={menu ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >{menu ? <X/> : <Menu/>}</button>
          <nav className={menu ? "nav-links open" : "nav-links"}>
            {[
              ["Home","home"],["Services","services"],["About Us","about"],
              ["Gallery","gallery"],["Areas We Service","areas"],["Reviews","reviews"],["Contact","contact"]
            ].map(([label,id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
          </nav>
          <a className="phone" href={`tel:${PHONE.replaceAll(" ","")}`}>
            <span className="phone-icon"><Phone size={18} fill="currentColor"/></span>
            <span><small>Call Us Now</small><b>{PHONE}</b></span>
          </a>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-overlay"/>
          <div className="container hero-content">
            <p className="eyebrow">PROFESSIONAL GARDENING & LAWNMOWING</p>
            <h1>Beautiful Gardens.<br/>Perfect Lawns.</h1>
            <p className="hero-copy">Reliable, high-quality and affordable gardening and lawn care services across Auckland.</p>
            <div className="actions">
              <button className="btn primary" onClick={() => scrollTo("contact")}><ArrowRight size={18}/> GET A FREE QUOTE</button>
            </div>
          </div>
        </section>

        <section className="trust">
          <div className="container trust-grid">
            {[
              [Clock3,"Reliable & Punctual","We show up on time, every time."],
              [Star,"High Quality Work","We take pride in every lawn and garden."],
              [CircleDollarSign,"Affordable Prices","Quality service at competitive rates."],
              [ShieldCheck,"Satisfaction Guaranteed","We aim for 100% satisfaction on every job."]
            ].map(([Icon,t,d]) => <div className="trust-item" key={t}><Icon/><div><b>{t}</b><span>{d}</span></div></div>)}
          </div>
        </section>

        <section id="services" className="section">
          <div className="container">
            <p className="eyebrow green">OUR SERVICES</p>
            <h2>Complete Garden & Lawn Care</h2>
            <div className="services-grid">
              {services.map(([title,desc,Icon]) => <article className="service-card" key={title}>
                <Icon className="service-icon"/><h3>{title}</h3><p>{desc}</p>
              </article>)}
            </div>
          </div>
        </section>

        <section id="about" className="section about">
          <div className="container about-grid">
            <div>
              <p className="eyebrow green">ABOUT AVCENA</p>
              <h2>Your Local Gardening<br/>& Lawn Care Experts</h2>
              <p>AVCENA Gardening & Lawnmowing is an Auckland-focused lawn and garden care business. We are passionate about providing tidy, reliable and affordable outdoor maintenance.</p>
              <ul className="checks">
                {["Experienced & Friendly Team","Quality Equipment","Reliable Service","Fully Insured*"].map(x => <li key={x}><CheckCircle2 size={19}/>{x}</li>)}
              </ul>
              <small className="note">*Only display “Fully Insured” once your business has appropriate insurance.</small>
            </div>
            <div className="about-photo"><img src={`${import.meta.env.BASE_URL}avcena-homepage-design.png`} alt="AVCENA gardening service"/></div>
          </div>
        </section>

        <section id="gallery" className="section gallery">
          <div className="container">
            <p className="eyebrow green">BEFORE & AFTER</p>
            <div className="section-heading"><h2>See the Difference We Make</h2><button onClick={() => scrollTo("contact")}>GET A QUOTE <ArrowRight size={16}/></button></div>
            <div className="gallery-grid">
              {[
                ["Before","Overgrown lawn","After","Freshly mowed lawn"],
                ["Before","Untidy garden","After","Neat garden"],
                ["Before","Long grass","After","Clean lawn"]
              ].map(([a,b,c,d],i) => <div className="gallery-card" key={i}>
                <div className="fake-before"><span>{a}</span><b>{b}</b></div>
                <div className="fake-after"><span>{c}</span><b>{d}</b></div>
              </div>)}
            </div>
            <p className="gallery-note">Replace these placeholders with your real AVCENA before-and-after photos.</p>
          </div>
        </section>

        <section id="reviews" className="section reviews">
          <div className="container review-grid">
            <div className="review-card">
              <p className="eyebrow green">WHAT OUR CLIENTS SAY</p>
              <h2>Trusted by Auckland Homeowners</h2>
              <div className="stars">{[1,2,3,4,5].map(i=><Star key={i} size={18} fill="currentColor"/>)}</div>
              <p className="quote">“AVCENA did an amazing job on our lawn and garden. Very reliable, friendly and the results are outstanding. Highly recommend their service.”</p>
              <b>— Customer Review</b><small>Auckland, New Zealand</small>
            </div>
            <div id="areas">
              <p className="eyebrow green">AREAS WE SERVICE</p>
              <h2>Proudly Serving Auckland</h2>
              <div className="areas">{areas.map(a=><span key={a}><MapPin size={16}/>{a}</span>)}</div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="container contact-grid">
            <div className="contact-copy">
              <p className="eyebrow green">GET A FREE QUOTE</p>
              <h2>Let's Make Your Garden Look Great.</h2>
              <p>Tell us what you need and send photos if you have them. We’ll get back to you to discuss your job.</p>
              <div className="contact-line"><Phone/><a href={`tel:${PHONE.replaceAll(" ","")}`}>{PHONE}</a></div>
              <div className="contact-line"><MapPin/><span>Auckland, New Zealand</span></div>
              <div className="contact-line"><span className="email-icon">@</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
            </div>
            <form className="quote-form" encType="multipart/form-data" onSubmit={submit}>
              <h3>Fast, Easy & Obligation Free</h3>
              {submitted && <div className="success"><CheckCircle2/> Thanks! Your enquiry has been sent.</div>}
              {submitError && <div className="success" role="alert">{submitError}</div>}
              <div className="two"><label>Your Name *<input required name="name"/></label><label>Phone Number *<input required name="phone" type="tel"/></label></div>
              <label>Email Address *<input required name="email" type="email"/></label>
              <label>Property Address *<input required name="address"/></label>
              <label>Service Required *
                <select required defaultValue="" name="service"><option value="" disabled>Select a service</option>{services.map(([s])=><option key={s}>{s}</option>)}</select>
              </label>
              <div className="two"><label>One-off or Regular *
                <select required defaultValue="" name="frequency"><option value="" disabled>Select</option><option>One-off</option><option>Weekly</option><option>Fortnightly</option><option>Monthly</option></select>
              </label><label>Preferred Day<input type="date" name="preferredDay"/></label></div>
              <label>Upload Photos (Optional)<div className="upload"><Upload size={22}/><span>Click to upload or drag and drop</span><input type="file" name="photos" accept="image/*" multiple/></div></label>
              <label>Additional Message<textarea name="message" rows="4" placeholder="Tell us about your lawn or garden..."/></label>
              <button className="btn primary full" type="submit" disabled={submitting}><Send size={17}/> {submitting ? "SENDING..." : "SUBMIT ENQUIRY"}</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-simple">
          <div className="footer-brand"><Leaf size={28}/><span><b>AVCENA</b><small>GARDENING & LAWNMOWING</small></span></div>
          <span className="footer-location"><MapPin size={15}/> Auckland, New Zealand</span>
          <div className="footer-meta"><span>© 2026 AVCENA Gardening & Lawnmowing</span><a href={`mailto:${EMAIL}`}>Contact us by email</a></div>
          <a className="footer-call" href={`tel:${PHONE.replaceAll(" ","")}`} aria-label={`Call AVCENA on ${PHONE}`}><Phone size={20}/><small>CALL US</small></a>
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
