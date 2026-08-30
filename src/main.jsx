import React from "react";
import { createRoot } from "react-dom/client";
import {
  Phone, ArrowRight, Leaf, Star, ShieldCheck, CircleDollarSign,
  Clock3, Scissors, Sprout, TreePine, Trash2, CalendarDays,
  MapPin, Upload, Send, CheckCircle2, Menu, X
} from "lucide-react";
import "./styles.css";
import "./responsive.css";
import { siteConfig } from "./siteConfig";

const PHONE = import.meta.env.VITE_CONTACT_PHONE || "021 081 31690";
const EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "Neerajchauhangvr@gmail.com";
const AUTO_REPLY = import.meta.env.VITE_AUTO_REPLY || "Thanks for your interest in AVCENA Gardening & Lawnmowing. We will contact you shortly.";
const API_ENDPOINT = import.meta.env.VITE_API_URL || "/api/submit";
const USE_BACKEND = Boolean(import.meta.env.VITE_API_URL) || !import.meta.env.PROD;
const enabledServices = siteConfig.services.filter((service) => service.enabled);
const enabledAreaList = siteConfig.areas.filter((area) => area.enabled).map((area) => area.name);
const enabledTrustItems = siteConfig.trustItems.filter((item) => item.enabled);
const enabledReviews = siteConfig.reviews.filter((review) => review.enabled);
const enabledSuburbContent = siteConfig.suburbContent.filter((item) => item.enabled);

function App() {
  const [menu, setMenu] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");

  const [customerReviews, setCustomerReviews] = React.useState(() => {
    try {
      const saved = localStorage.getItem("avcenaCustomerReviews");
      if (!saved) return [...siteConfig.reviews.filter((review) => review.enabled)];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length ? parsed : [...siteConfig.reviews.filter((review) => review.enabled)];
    } catch {
      return [...siteConfig.reviews.filter((review) => review.enabled)];
    }
  });

  const [reviewForm, setReviewForm] = React.useState({ name: "", suburb: "", rating: 5, quote: "" });
  const [reviewSubmitted, setReviewSubmitted] = React.useState(false);
  const [reviewLinkCopied, setReviewLinkCopied] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem("avcenaCustomerReviews", JSON.stringify(customerReviews));
  }, [customerReviews]);

  const handleCopyReviewLink = async () => {
    if (!siteConfig.reviewRequest.enabled) return;
    try {
      await navigator.clipboard.writeText(siteConfig.reviewRequest.url);
      setReviewLinkCopied(true);
      setTimeout(() => setReviewLinkCopied(false), 2200);
    } catch {
      window.open(siteConfig.reviewRequest.url, "_blank", "noreferrer");
    }
  };

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

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.quote.trim()) return;

    const newReview = {
      quote: reviewForm.quote.trim(),
      name: reviewForm.name.trim(),
      location: reviewForm.suburb.trim() ? `${reviewForm.suburb.trim()}, Auckland` : "Auckland, New Zealand",
      rating: Number(reviewForm.rating) || 5,
      enabled: true
    };

    setCustomerReviews((prev) => [newReview, ...prev]);
    setReviewForm({ name: "", suburb: "", rating: 5, quote: "" });
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 2500);
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
            <p className="eyebrow">AUCKLAND LAWN MOWING & GARDEN CARE</p>
            <h1>Professional Lawn Mowing<br/>& Garden Maintenance</h1>
            <p className="hero-copy">Trusted Auckland gardening and lawn care services for homes and properties. We provide affordable lawn mowing, garden maintenance, hedge trimming and seasonal garden clean-ups.</p>
            <div className="actions">
              <button className="btn primary" onClick={() => scrollTo("contact")}><ArrowRight size={18}/> GET A FREE QUOTE</button>
            </div>
          </div>
        </section>

        {siteConfig.sections.services && (
          <section id="services" className="section">
            <div className="container">
              <p className="eyebrow green">OUR SERVICES</p>
              <h2>Complete Auckland Garden & Lawn Care</h2>
              <p className="services-intro">From regular lawn mowing and garden maintenance to hedge trimming, weed removal and green waste removal, AVCENA helps homeowners and property owners keep outdoor spaces neat, healthy and well maintained across Auckland.</p>
              <div className="services-grid">
                {enabledServices.map(({ title, description, icon: Icon }) => <article className="service-card" key={title}>
                  <Icon className="service-icon"/><h3>{title}</h3><p>{description}</p>
                </article>)}
              </div>
            </div>
          </section>
        )}

        <section className="trust">
          <div className="container trust-grid">
            {enabledTrustItems.map(({ icon: Icon, title, description }) => <div className="trust-item" key={title}><Icon/><div><b>{title}</b><span>{description}</span></div></div>)}
          </div>
        </section>

        <section id="about" className="section about">
          <div className="container about-grid">
            <div>
              <p className="eyebrow green">ABOUT AVCENA</p>
              <h2>Your Local Gardening<br/>& Lawn Care Experts</h2>
              <p>AVCENA Gardening & Lawnmowing is an Auckland-based garden and lawn care business helping homeowners and property owners maintain tidy, attractive outdoor spaces with reliable lawn mowing, garden maintenance, hedge trimming and general garden care.</p>
              <ul className="checks">
                {["Experienced & Friendly Team","Quality Equipment","Reliable Service","Fully Insured*"].map(x => <li key={x}><CheckCircle2 size={19}/>{x}</li>)}
              </ul>
              <small className="note">*Only display “Fully Insured” once your business has appropriate insurance.</small>
            </div>
            <div className="about-photo"><img src={`${import.meta.env.BASE_URL}avcena-gardener.jpg`} alt="AVCENA gardener trimming a hedge" /></div>
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

        {siteConfig.sections.reviews && (
          <section id="reviews" className="section reviews">
            <div className="container review-grid">
              <div className="review-card">
                <p className="eyebrow green">WHAT OUR CLIENTS SAY</p>
                <h2>Trusted by Auckland Homeowners</h2>
                <div className="stars">{[1,2,3,4,5].map(i=><Star key={i} size={18} fill="currentColor"/>)}</div>
                {customerReviews.length > 0 ? (
                  <>
                    <div className="review-list">
                      {customerReviews.slice(0, 3).map((review, index) => (
                        <div className="mini-review" key={`${review.name}-${index}`}>
                          <div className="mini-stars">{[...Array(review.rating || 5)].map((_, i) => <Star key={i} size={14} fill="currentColor"/>)}</div>
                          <p className="quote">“{review.quote}”</p>
                          <b>— {review.name}</b><small>{review.location}</small>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>

              {siteConfig.sections.reviewForm && (
                <div className="review-form-wrap">
                  <h3>Leave a Review</h3>
                  {siteConfig.reviewRequest.enabled && (
                    <div className="review-cta">
                      <span>Happy with the service? Share the review link with your customer after the job.</span>
                      <button type="button" className="btn outline small" onClick={handleCopyReviewLink}>Copy review link</button>
                      {reviewLinkCopied && <div className="success review-success"><CheckCircle2/> Review link copied.</div>}
                    </div>
                  )}
                  <form className="review-form" onSubmit={handleReviewSubmit}>
                    <div className="two">
                      <label>Your Name<input value={reviewForm.name} onChange={(event) => setReviewForm({ ...reviewForm, name: event.target.value })} required /></label>
                      <label>Suburb<input value={reviewForm.suburb} onChange={(event) => setReviewForm({ ...reviewForm, suburb: event.target.value })} /></label>
                    </div>
                    <label>Rating
                      <select value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: Number(event.target.value) })}>
                        {[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} star{value > 1 ? "s" : ""}</option>)}
                      </select>
                    </label>
                    <label>Your Review<textarea rows="4" value={reviewForm.quote} onChange={(event) => setReviewForm({ ...reviewForm, quote: event.target.value })} required placeholder="Tell others how great the service was..." /></label>
                    <button className="btn primary full" type="submit">POST REVIEW</button>
                    {reviewSubmitted && <div className="success review-success"><CheckCircle2/> Thanks! Your review has been added.</div>}
                  </form>
                </div>
              )}

              {siteConfig.sections.areas && (
                <div id="areas" className="areas-panel">
                  <p className="eyebrow green">AREAS WE SERVICE</p>
                  <h2>Proudly Serving Auckland</h2>
                  <div className="areas">{enabledAreaList.map(a=><span key={a}><MapPin size={16}/>{a}</span>)}</div>
                  {enabledSuburbContent.length > 0 && (
                    <div className="suburb-content">
                      {enabledSuburbContent.map((item) => (
                        <p key={item.name}><strong>{item.name}:</strong> {item.text}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        <section id="contact" className="section contact">
          <div className="container contact-grid">
            <div className="contact-copy">
              <p className="eyebrow green">GET A FREE QUOTE</p>
              <h2>Let's Make Your Garden Look Great.</h2>
              <p>Tell us what you need and send photos if you have them. We’ll get back to you to discuss your job.</p>
              <div className="contact-line"><Phone/><a href={`tel:${PHONE.replaceAll(" ","")}`}>{PHONE}</a></div>
              <div className="contact-line"><MapPin/><span>Auckland, New Zealand</span></div>
              <div className="contact-line"><span className="email-icon">@</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
              {siteConfig.googleBusinessProfile.enabled && (
                <div className="contact-line"><span className="email-icon">G</span><a href={siteConfig.googleBusinessProfile.url} target="_blank" rel="noreferrer">{siteConfig.googleBusinessProfile.label}</a></div>
              )}
              {siteConfig.reviewRequest.enabled && (
                <div className="contact-line"><span className="email-icon">★</span><a href={siteConfig.reviewRequest.url} target="_blank" rel="noreferrer">{siteConfig.reviewRequest.label}</a></div>
              )}
            </div>
            <form className="quote-form" encType="multipart/form-data" onSubmit={submit}>
              <h3>Fast, Easy & Obligation Free</h3>
              {submitted && <div className="success"><CheckCircle2/> Thanks! Your enquiry has been sent.</div>}
              {submitError && <div className="success" role="alert">{submitError}</div>}
              <div className="two"><label>Your Name *<input required name="name"/></label><label>Phone Number *<input required name="phone" type="tel"/></label></div>
              <label>Email Address *<input required name="email" type="email"/></label>
              <label>Property Address *<input required name="address"/></label>
              <label>Service Required *
                <select required defaultValue="" name="service"><option value="" disabled>Select a service</option>{enabledServices.map(({ title })=><option key={title}>{title}</option>)}</select>
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
          <div className="footer-meta">
            <span>© 2026 AVCENA Gardening & Lawnmowing</span>
            <a href={`mailto:${EMAIL}`}>Contact us by email</a>
            {siteConfig.privacyPolicy.enabled && (
              <a href={`${import.meta.env.BASE_URL}${siteConfig.privacyPolicy.path.replace(/^\//, "")}`}>Privacy Policy</a>
            )}
          </div>
          <a className="footer-call" href={`tel:${PHONE.replaceAll(" ","")}`} aria-label={`Call AVCENA on ${PHONE}`}><Phone size={20}/><small>CALL US</small></a>
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
