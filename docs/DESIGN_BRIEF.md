# Wilderness Trace Veterinary Clinic — Design & Build Brief (`BUILD_BRIEF.md`)

- **Monday Item:** `AI Build Process Test: Grok, rebuild from existing site`
- **Monday Subitem 1:** `Design`
- **Source Site:** `https://www.wildernesstracevetclinic.com/`
- **Target GitHub Repository:** `CachoMX/wilderness-trace-vet-clinic`
- **Target Vercel Team:** `cachomx's projects` (`team_5czNM30Wyn6t6cezBvE9rdyG`)
- **Framework:** Astro (static pre-rendered HTML for all 36 routes + Vercel serverless endpoint `/api/contact` for Resend form submission)

---

## 1. Visual Fidelity & Spec Alignment Strategy
1. **1:1 Visual & Content Fidelity:**
   - Every one of the **35 live Joomla pages** (`/` + `/about-us` + `/contact` + `/privacy-policy` + 3 Emergency pages + 14 Service pages + `/blog` + 13 Blog post pages) is reconstructed with its exact copy, headings, layout sections, background colors/images, cards, icons, and all **72 local images** (served locally from `/images/...` and `/media/...` with explicit `width`/`height`, `loading="lazy"` below the fold, and `fetchpriority="high"` on the hero LCP image).
   - **Header (`#sp-header.lg-header`):** Exact sticky white header with the Wilderness Trace Veterinary Clinic logo on the left and the exact 8-item desktop megamenu (`Home`, `About Us`, `Sick Pets` ▾, `Veterinary Services` ▾ with nested `Wellness Care` ▸, `Boarding`, `Grooming`, `Resources` ▾, `Contact`) plus accessible mobile offcanvas drawer.
   - **Hero Slider (Homepage `#sp-page-title`):** Lightweight zero-jQuery CSS/JS 4-slide hero matching the SmartSlider3 hero on the live homepage (`Welcome to Wilderness Trace Veterinary Clinic` / `Where small-town charm meets high-tech care` / `Call Us Now (859) 854-5055` CTA button over the blue diagonal/overlay panel and the 4 pet slides: border collie, striped cat, black lab puppy, young white cat). The first slide image is preloaded with `fetchpriority="high"` and never hides/delays the H1 or LCP element.
   - **SP Page Builder Sections:** Preserves the exact section structure, spacing, royal-blue (`#0538c3`) and soft blue-gray (`#e6eaf4`) backgrounds, feature cards, service icon grids, parallax/CTA bands (`Join the Wilderness Trace family` and `We invite you and your best friend to join us at Wilderness Trace Veterinary Clinic`), and the two-column bottom `Contact Us` + `Hours` + interactive/facade OpenStreetMap section (`#section-id-1674763278008`).
   - **EasyBlog Clone (`/blog` and `/blog/[slug]`):** Preserves the exact EasyBlog layout, search bar (static client/build search scoped to blog posts), post metadata (date, category `Blog`), full article HTML & images, **"Most Popular"** posts block, and **"Recent Posts"** block.
2. **Vetcelerator Spec Enhancements (`design-spec.md` v1.1 & Carlos's Decisions):**
   - **Contact Page (`/contact`):** Preserves the exact live 2-column Contact info + Google Maps section AND adds the native HTML Contact Form (`Name`, `Email`, `Phone`, `Pet's Name / Species`, `Reason for Visit`, `Message`, plus honeypot `_gotcha`) posting to `/api/contact` (serverless function using `process.env.RESEND_API_KEY`) which sends the transactional email and returns an HTTP **303 redirect to `/thank-you/?form=submitted`**.
   - **Thank You Page (`/thank-you`):** Matches the clinic's hero + typography + brand colors, displays the confirmation message (`Thank you for contacting Wilderness Trace Veterinary Clinic. A member of our team will reach out to you soon. We look forward to assisting you and your pet!`), sets `<meta name="robots" content="noindex, nofollow">`, and pushes the `form_submission` conversion event to `dataLayer` when `?form=submitted` is present.
   - **Custom 404 Page (`/404`):** Styled with the clinic header/footer, helpful navigation links, and `noindex`.
   - **Motion (`design-spec.md` §11a):** CSS-first scroll-reveal animations (`transform` + `opacity` only, never hiding content if JS is disabled, never animating the Hero/LCP entrance, and fully respecting `@media (prefers-reduced-motion: reduce)`), plus smooth hover micro-interactions on buttons (`#3366FF` → `#0037DD`), service cards, and navigation links.
   - **Third-Party Compliance & Speed (`design-spec.md` §4.12–4.14, §8, §11):**
     - **Cookie Banner (`#sp-cookie-consent`):** Styled in `#4a13d6` with white text, links to `/privacy-policy`, `Accept` button (persists consent and updates Google Consent Mode v2), and `×` close button (dismisses for current page load).
     - **Google Consent Mode v2 + GTM (`GTM-MK3H6C4`) + GA4 (`G-9GL6SP7C3M`):** Default consent set to `denied` before any tag loads; scripts loaded lazily after idle/interaction so TBT = 0 ms and Lighthouse Mobile Performance ≥ 90.
     - **UserWay Accessibility Widget (`do6urgIMaj`):** Loaded lazily on user interaction / idle so it never blocks the main thread during initial load.
     - **Footer Compliance:** Exact SMS opt-out line (`Reply STOP to unsubscribe from SMS messages. Messaging and data rates may apply. Privacy Policy.`) + dynamic copyright year (`© 2026 Wilderness Trace Veterinary Clinic. Veterinary Marketing & Websites by Vetcelerator.` with `rel="nofollow"` on the agency credit link).

---

## 2. Design Tokens (`src/styles/tokens.css`)
```css
:root {
  --color-brand-primary: #0538c3;
  --color-brand-primary-hover: #0743e2;
  --color-brand-primary-ink: #ffffff;
  --color-brand-cta: #3366ff;
  --color-brand-cta-hover: #0037dd;
  --color-brand-secondary: #1e429f;
  --color-cookie-bg: #4a13d6;
  --color-surface: #ffffff;
  --color-surface-alt: #e6eaf4;
  --color-surface-muted: #f5f5f5;
  --color-surface-dark: #0a1931;
  --color-text: #111111;
  --color-text-body: #212529;
  --color-text-muted: #555555;
  --color-border: #dce2f0;
  --overlay-hero: rgba(5, 56, 195, 0.72);
  --font-heading: 'Anton', Impact, sans-serif;
  --font-body: 'Poppins', system-ui, -apple-system, sans-serif;
  --radius-base: 6px;
  --radius-pill: 50px;
}
```

---

## 3. Complete Route Table (37 Routes: 35 Live Pages + `/thank-you` + `/404`)
| # | Route | Template | Title | H1 | Indexable |
|---|---|---|---|---|---|
| 1 | `/` | `Home` | Veterinarian Junction City, KY | Wilderness Trace Veterinary Clinic | Welcome to Wilderness Trace Veterinary Clinic | Yes |
| 2 | `/about-us` | `About` | Veterinarian Dr. Stephanie Raispis Junction City, KY | Wilderness Trace Veterinary Clinic | About Us | Yes |
| 3 | `/adult-cat-wellness-care-junction-city` | `ServiceOrEmergency` | Adult Cat Wellness Care Junction City, KY | Wilderness Trace Veterinary Clinic | Adult Cat Wellness | Yes |
| 4 | `/blog` | `BlogIndex` | Recent Blog Posts - Blog | Blog | Yes |
| 5 | `/blog/a-guide-to-choosing-the-best-pet-food` | `BlogPost` | Choosing the Best Pet Food in Junction City, KY - Blog | A Guide to Choosing the Best Pet Food | Yes |
| 6 | `/blog/a-new-pet-starter-guide-junction-city-kentucky` | `BlogPost` | New Pet Starter Guide | Wilderness Trace Veterinary Clinic - Blog | A New Pet Starter Guide | Yes |
| 7 | `/blog/conquering-the-jitters` | `BlogPost` | Conquering the Jitters - Blog | Conquering the Jitters | Yes |
| 8 | `/blog/how-cold-laser-therapy-can-relieve-your-pets-pain` | `BlogPost` | The Power of Cold Laser Therapy for Pets - Blog | How Cold Laser Therapy Can Relieve Your Pet’s Pain | Yes |
| 9 | `/blog/how-to-spot-dental-pain-in-pets-signs-you-shouldnt-ignore` | `BlogPost` | Signs of Dental Pain in Pets | Wilderness Trace Vet Clinic - Blog | How to Spot Dental Pain in Pets: Signs You Shouldn’t Ignore | Yes |
| 10 | `/blog/important-dental-care-for-pets-in-junction-city` | `BlogPost` | Important Dental Care for Pets in Junction City - Blog | Important Dental Care for Pets in Junction City | Yes |
| 11 | `/blog/is-pet-insurance-worth-it-in-junction-city-ky` | `BlogPost` | Is Pet Insurance Worth It in Junction City, KY | Wilderness Trace Veterinary Clinic - Blog | Is Pet Insurance Worth It in Junction City, KY? | Yes |
| 12 | `/blog/preparing-your-pet-for-halloween-visitors-in-junction-city-ky` | `BlogPost` | Prepare Your Pet for Halloween | Wilderness Trace Vet Clinic - Blog | Preparing Your Pet for Halloween Visitors in Junction City, KY | Yes |
| 13 | `/blog/should-you-microchip-your-indoor-cat` | `BlogPost` | Microchipping Your Indoor Cat | Wilderness Trace Vet Clinic - Blog | Should You Microchip Your Indoor Cat? | Yes |
| 14 | `/blog/vet-near-me-quiz-are-you-smarter-than-a-5th-grader-pet-edition-wilderness-trace-veterinary-clinic` | `BlogPost` | Wilderness Trace Veterinary Clinic in Junction City | Vet Near Me Quiz - Blog | Vet Near Me Quiz – Are You Smarter Than a 5th Grader? Pet Edition | Wilderness Trace Veterinary Clinic | Yes |
| 15 | `/blog/welcome-to` | `BlogPost` | Welcome to Wilderness Trace Veterinary Clinic - Blog | Welcome to Wilderness Trace Veterinary Clinic | Yes |
| 16 | `/blog/what-to-think-about-when-adopting-a-shelter-pet` | `BlogPost` | What to Think About When Adopting a Shelter Pet in Junction City, KY - Blog | What to Think About When Adopting a Shelter Pet in Junction City, KY | Yes |
| 17 | `/blog/why-kittens-need-feline-leukemia-prevention` | `BlogPost` | Prevent Kitten Feline Leukemia | Wilderness Trace Vet Clinic - Blog | Why Kittens Need Feline Leukemia Prevention | Yes |
| 18 | `/canine-adult-wellness-care-junction-city` | `ServiceOrEmergency` | Canine Adult Wellness Care Junction City, KY | Wilderness Trace Veterinary Clinic | Canine Adult Wellness | Yes |
| 19 | `/canine-senior-wellness-care-junction-city` | `ServiceOrEmergency` | Canine Senior Wellness Care Junction City, KY | Wilderness Trace Veterinary Clinic | Canine Senior Wellness | Yes |
| 20 | `/cat-emergency-situations-junction-city` | `ServiceOrEmergency` | Cat Emergency Situations Junction City, KY | Wilderness Trace Veterinary Clinic | Cat Emergency Situations | Yes |
| 21 | `/cold-laser-therapy-junction-city` | `ServiceOrEmergency` | Cold Laser Therapy Junction City, KY | Wilderness Trace Veterinary Clinic | Cold Laser Therapy | Yes |
| 22 | `/contact` | `Contact` | Contact Veterinarian in Junction City, KY | Wilderness Trace Veterinary Clinic | Contact Us | Yes |
| 23 | `/dog-emergency-situations-junction-city` | `ServiceOrEmergency` | Dog Emergency Situations Junction City, KY | Wilderness Trace Veterinary Clinic | Dog Emergency Situations | Yes |
| 24 | `/in-house-laboratory-junction-city` | `ServiceOrEmergency` | In-House Laboratory Junction City, KY | Wilderness Trace Veterinary Clinic | Laboratory | Yes |
| 25 | `/kitten-wellness-care-junction-city` | `ServiceOrEmergency` | Kitten Wellness Care Junction City, KY | Wilderness Trace Veterinary Clinic | Kitten Wellness | Yes |
| 26 | `/pet-boarding-junction-city` | `ServiceOrEmergency` | Pet Boarding Junction City, KY | Wilderness Trace Veterinary Clinic | Boarding | Yes |
| 27 | `/pet-dentistry-junction-city` | `ServiceOrEmergency` | Pet Dentistry Junction City, KY | Wilderness Trace Veterinary Clinic | Dentistry | Yes |
| 28 | `/pet-emergency-tips-junction-city` | `ServiceOrEmergency` | Pet Emergency Tips Junction City, KY | Wilderness Trace Veterinary Clinic | Emergency Tips | Yes |
| 29 | `/pet-foods-junction-city` | `ServiceOrEmergency` | Pet Foods Junction City, KY | Wilderness Trace Veterinary Clinic | Pet Foods | Yes |
| 30 | `/pet-grooming-junction-city` | `ServiceOrEmergency` | Pet Grooming Junction City, KY | Wilderness Trace Veterinary Clinic | Grooming | Yes |
| 31 | `/pet-pharmacy-junction-city` | `ServiceOrEmergency` | Pet Pharmacy Junction City, KY | Wilderness Trace Veterinary Clinic | Pharmacy | Yes |
| 32 | `/pet-surgery-junction-city` | `ServiceOrEmergency` | Pet Surgery Junction City, KY | Wilderness Trace Veterinary Clinic | Surgery | Yes |
| 33 | `/privacy-policy` | `Privacy` | Privacy Policy | Wilderness Trace Veterinary Clinic | Privacy Policy | Yes |
| 34 | `/puppy-wellness-care-junction-city` | `ServiceOrEmergency` | Puppy Wellness Care Junction City, KY | Wilderness Trace Veterinary Clinic | Puppy Wellness | Yes |
| 35 | `/radiology-junction-city` | `ServiceOrEmergency` | Radiology Junction City, KY | Wilderness Trace Veterinary Clinic | Radiology | Yes |
| 36 | `/thank-you` | `ThankYou` | Thank You | Wilderness Trace Veterinary Clinic | Thank You! | No (`noindex`) |
| 37 | `/404` | `NotFound` | Page Not Found | Wilderness Trace Veterinary Clinic | Page Not Found | No (`noindex`) |
