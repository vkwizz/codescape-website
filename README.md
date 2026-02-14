# CODESCAPE Website

A modern, multi-page website showcasing CODESCAPE's services and portfolio with stunning animations and interactive elements.

## 🌟 Features

- **3D Hero Section**: Eye-catching 3D "CODESCAPE" text with gradient effects using Three.js
- **Animated Project Slider**: GSAP-powered carousel with smooth transitions and 3D card effects
- **Multi-Page Structure**: Optimized for SEO with dedicated pages for:
  - Home (3D hero + company info)
  - Projects (animated slider showcase)
  - Careers (job listings)
  - Resources (blog, contact, legal, about)
- **Responsive Design**: Mobile-first approach with smooth animations
- **Interactive Elements**: Custom cursor, scroll effects, and hover animations

## 🚀 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **JavaScript** - Interactive functionality
- **Three.js** - 3D graphics and animations
- **GSAP** - Advanced animation library
- **Tailwind CSS** - Utility-first styling

## 📁 Project Structure

```
Codescape/
├── index.html              # Home page with 3D hero
├── projects.html           # Projects showcase with slider
├── careers.html            # Careers and job listings
├── resources.html          # Blog, contact, legal, about
├── ProjectSlider.jsx       # Next.js component (reference)
├── ProjectSlider.module.css # Next.js styles (reference)
└── .gitignore             # Git ignore file
```

## 🎨 Design Highlights

- **Color Scheme**: Blue gradient palette (#1e3a8a to #60a5fa)
- **Typography**: Inter (body) + Instrument Sans (headings)
- **Animations**: Smooth GSAP transitions with reduced motion support
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

## 🖥️ Local Development

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Codescape
   ```

2. Run a local server:
   ```bash
   python -m http.server 3000
   ```

3. Open in browser:
   ```
   http://localhost:3000
   ```

## 📄 Pages Overview

### Home (`index.html`)
- Full-screen 3D hero with animated text
- "What is CODESCAPE?" section
- "Why Choose CODESCAPE?" with stats and CTA

### Projects (`projects.html`)
- Interactive GSAP slider with 6 projects
- Scroll/swipe navigation
- Auto-play carousel with smooth color transitions

### Careers (`careers.html`)
- Hero banner with CTA
- Job listings with tech stack details
- Company benefits section

### Resources (`resources.html`)
- About CODESCAPE (Mission, Vision, Values)
- Team section
- Blog articles
- Contact form
- Privacy Policy & Terms

## 🔧 Future Enhancements

- [ ] Migrate to Next.js framework
- [ ] Add backend API integration
- [ ] Implement blog CMS
- [ ] Add analytics tracking
- [ ] Optimize images with lazy loading

## 📝 License

All rights reserved © 2026 CODESCAPE

---

**Built with passion and precision by CODESCAPE** 🚀
