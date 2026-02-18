# Shikshanix Career Portal - Comprehensive Full-Page Implementation Guide

## Project Overview
Create a professional, modern career portal for Shikshanix featuring multiple sections: careers landing page, job listings, and internship opportunities with smooth animations and professional branding.

---

## PART 1: MAIN CAREER PAGE (`/careers`)

### 1.1 Header Section
**Navbar Integration:**
- Display Shikshanix logo with company name
- Navigation menu with dropdown for courses
- Active page highlighting
- Sticky positioning with backdrop blur
- Mobile hamburger menu

### 1.2 Hero Section
**Visual Design:**
- Large hero banner with gradient background
- Title: "SuperChange Your TechFuture with Shiksha Nex" with animated text reveal
- Subtitle with gradient text highlighting salary range
- Search input for career exploration
- Professional woman image on the right (desktop view)
- Responsive layout (stacked on mobile, side-by-side on desktop)

**Animations:**
- Fade-in entrance animation for heading and subheading
- Animated typewriter effect for secondary title
- Image slide-in from right with scale animation
- Smooth transitions on all elements

### 1.3 Trusted by Top Companies Section
**Background & Layout:**
- Dark gradient background: `from-slate-900 via-blue-900 to-slate-900`
- Animated floating blob effects (blue and indigo)
- Section header: "Trusted by Top Companies" with gradient text
- Clean, professional typography

**Company Logos Display:**
- Grid layout: 2 columns (mobile) → 3 columns (tablet) → 6 columns (desktop)
- Real company logos: Google, Microsoft, Amazon, Infosys, TCS, LinkedIn
- Oval/rounded logo containers with white background
- Border: 2px subtle border with blue gradient on hover
- Hover Effects:
  - Scale up (1.15x)
  - Glow shadow effect
  - Subtle rotation
  - Shimmer lines appear top and bottom
  - Text gradient transition

**Bottom Stats:**
- Three stat cards showing:
  - 500+ Hiring Partners (🏢)
  - ₹12L+ Average Salary (💰)
  - 50K+ Students Placed (⭐)
- Animated gradient text on stats
- Hover lift effect with shadow elevation

### 1.4 Jobs Opportunities Section
**Section Styling:**
- Light gradient background: `from-slate-50 via-white to-blue-50`
- Clean white space
- Centered section header with gradient title

**Job Cards (3 cards in grid):**
Each card contains:
- Icon/emoji (🚀, 💼, ⭐)
- Motivational quote about job opportunities
- Professional styling with white background
- Border: 2px on hover with gradient (blue to indigo)
- Box shadow and depth effects

**Card Content:**
```
Quote examples:
1. "Shape your future with Shikshanix – exciting career opportunities await!"
2. "Your dream job is just a click away – join Shikshanix today!"
3. "Grow, innovate, and succeed with Shikshanix careers!"
```

**Interactions:**
- Card scale on hover (1.05x)
- Gradient border appears on hover
- Smooth color transitions
- "Apply Now" button with arrow icon
- Bottom CTA: "View All Jobs" button

**Animations:**
- Staggered entrance (0.2s delay between cards)
- Fade-in with upward slide
- Hover scale with shadow elevation
- Button bounce/scale on interaction

### 1.5 Internships Section
**Section Styling:**
- Warm gradient background: `from-orange-50 via-pink-50 to-rose-50`
- Similar structure to Jobs section but different colors

**Internship Cards (3 cards):**
Each card contains:
- Icon/emoji (🎓, ✨, 🌟)
- Highlight badge (Learning & Growth, Real-World Experience, Career Launch Pad)
- Motivational quote about internships
- Orange/pink color scheme

**Card Content:**
```
Quote examples:
1. "Kickstart your career with Shikshanix – internships designed for innovators!"
2. "Learn, grow, and shine – explore Shikshanix internship programs!"
3. "Step into the future of work with Shikshanix internships!"
```

**Interactions:**
- Same animations as Jobs section
- "Explore Internships" buttons
- Bottom CTA box with section heading

**Color Palette:**
- Background: Orange to pink gradients
- Buttons: Orange to pink gradient
- Text: Orange/pink accent colors
- Badges: Orange background with bold text

---

## PART 2: JOBS PAGE (`/jobs`)

### 2.1 Page Structure
**Overall Background:**
- Main page background: White
- Creates clean, professional appearance

### 2.2 Hero Section
**Design:**
- Dark gradient background: `from-slate-900 via-blue-900 to-slate-900`
- Animated blue blob effects (subtle, 0.2 opacity)
- Left side: Text content
- Right side: Oval-shaped professional image

**Left Content:**
- Title: "Shikshanix Job Portal"
- Gradient accent: Blue to cyan
- Description: Career opportunities explanation
- Supporting text: Professional journey tagline

**Right Content (Image):**
- Oval-shaped container (perfect circle)
- Dimensions: 72px to 96px (responsive)
- Border: 4px solid blue
- Layers:
  - Outer glow effect (hover state)
  - Subtle shadow for depth
  - Inner shadow overlay
  - Gradient overlay (dark-to-transparent)
  - Outer shadow circle for 3D effect
  
**Animations:**
- Content fade-in from left
- Image slide-in from right with scale
- Hover effects on image with glow expansion
- Smooth staggered entrance

### 2.3 Search Section
**Design:**
- White card with rounded borders
- Box shadow for elevation
- Positioned with negative margin (overlapping hero)
- Centered layout

**Search Bar:**
- Icon on left (Search icon)
- Placeholder: "Search jobs by title or company..."
- Real-time filtering capability
- Focus state: Border color changes to blue
- Responsive width

### 2.4 Category Tabs
**Layout:**
- Horizontal scrollable on mobile
- Flex wrap on larger screens
- Centered alignment
- Gap between buttons: 12px

**Categories:**
- All, IT, HR, Marketing, Design, Nursing

**Button States:**
- **Active:** Blue gradient (`from-blue-600 to-blue-700`), white text, shadow
- **Inactive:** White background, gray text, gray border
- **Hover:** Border and text color change to blue

**Animations:**
- Staggered entrance (0.05s delay each)
- Scale on hover (1.05x)
- Scale on tap (0.98x)

### 2.5 Job Listings
**Card Layout:**
- White background
- Rounded corners (24px)
- Left border accent: Blue (4px)
- Padding: Responsive (24px on mobile, 32px on desktop)
- Flex layout: Vertical on mobile, horizontal on desktop

**Card Content (Left Side):**
- Job title (large, bold, black text)
- Company name (bold, blue text)
- Job info grid (2 cols mobile, 4 cols desktop):
  - 📍 Location
  - 💼 Employment Type
  - ⏱️ Experience Required
  - 💵 Salary (green text)
- Skill tags/badges with blue gradient background

**Apply Button (Right Side):**
- Blue gradient (`from-blue-600 to-blue-800`)
- White text, bold font
- Padding: 12px 32px
- Rounded: 12px border-radius

**Button Functionality:**
```javascript
onClick={() => navigate("/dashboard/interview")}
```

**Button Animations:**
- Hover: Scale 1.05x
- Tap: Scale 0.95x
- Hover shadow: `0 20px 40px rgba(37, 99, 235, 0.15)` (blue shadow)

**Card Animations:**
- Individual card entrance with staggered delay
- Fade-in from bottom (y: 20px to 0)
- Hover: Lift effect (y: -4px)
- Enhanced shadow on hover

**Skill Badges:**
- Background: Blue gradient (`from-blue-100 to-blue-50`)
- Text: Blue (`text-blue-700`)
- Padding: 8px 12px
- Border-radius: Full
- Font size: Extra small, medium weight
- Hover: Scale 1.05x, background brightens

### 2.6 Job Data Structure
**Sample Job Object:**
```javascript
{
  id: number,
  title: string,
  company: string,
  location: string,
  type: "Full-time" | "Part-time" | "Remote",
  exp: string, // e.g., "2 - 5 years"
  salary: string, // e.g., "₹8.0 LPA - ₹15.0 LPA"
  skills: string[],
  category: "IT" | "HR" | "Marketing" | "Design" | "Nursing"
}
```

**Job Categories:**
- **IT:** Java, Python, Frontend, Node.js, DevOps roles
- **HR:** Recruiter, Generalist, Talent Acquisition, HR Manager
- **Marketing:** Digital Marketing, Social Media, Content, Performance
- **Design:** UI/UX, Graphic, Product, Motion, Web Design
- **Nursing:** Staff Nurse, ICU, Home Care, Pediatric, Operation Theatre

### 2.7 Empty State
**No Search Results Display:**
- Large text: "No jobs found matching your search."
- Supporting text: "Try adjusting your filters or search query."
- Centered layout with animation
- Smooth transition

### 2.8 Responsive Design
**Mobile (< 768px):**
- Single column layout
- Search bar full width
- Job cards stack vertically
- Button below job details

**Tablet (768px - 1024px):**
- 2-column job card layout
- Proper spacing
- Search bar full width

**Desktop (> 1024px):**
- Full multi-column layout
- Hero section side-by-side
- Optimal spacing and readability

---

## PART 3: STYLING & COLOR PALETTE

### Color Scheme
**Primary Colors:**
- Blue: `#2563eb` (Blue-600)
- Dark Blue: `#1e40af` (Blue-800)
- Slate: `#0f172a` (Slate-900)

**Secondary Colors:**
- Cyan: Light blue accent
- White: `#ffffff`
- Gray: Neutral text and borders

**Text Colors:**
- Primary: Black / Dark gray
- Secondary: Blue (`#2563eb`)
- Tertiary: Gray-600 for descriptions
- White: On dark backgrounds

**Background Gradients:**
- Hero Dark: `from-slate-900 via-blue-900 to-slate-900`
- Cards: White with subtle shadows
- Sections: Light gradient backgrounds

### Typography
**Font Family:**
- Heading: "Plus Jakarta Sans"
- Body: "Inter"

**Font Sizes:**
- H1: 48px (md: 56px, lg: 64px)
- H2: 32px (md: 36px, lg: 40px)
- H3: 24px
- Body: 16px
- Small: 14px

**Font Weights:**
- Bold: 700
- Semibold: 600
- Regular: 400

---

## PART 4: ANIMATIONS & INTERACTIONS

### Entrance Animations
```javascript
// Card entrance
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}

// Staggered children
staggerChildren: 0.1-0.15
delayChildren: 0.2-0.3
```

### Hover Animations
```javascript
// Button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}

// Card
whileHover={{ 
  y: -4, 
  boxShadow: "0 20px 40px rgba(37, 99, 235, 0.15)" 
}}

// Icon
whileHover={{ scale: 1.2 }}
```

### Continuous Animations
```javascript
// Floating blobs
animate={{
  y: [0, -20, 0],
  opacity: [0.2, 0.3, 0.2]
}}
transition={{
  duration: 8-10,
  repeat: Infinity,
  ease: "easeInOut"
}}
```

---

## PART 5: ACCESSIBILITY & UX

### Accessibility Features
- Proper heading hierarchy (H1 → H2 → H3)
- Alt text for all images
- ARIA labels for interactive elements
- Color contrast ratios > 4.5:1 for text
- Keyboard navigation support
- Focus states visible on all buttons

### User Experience
- Smooth page transitions
- Loading states for async operations
- Clear call-to-action buttons
- Intuitive navigation
- Mobile-first responsive design
- Touch-friendly button sizes (min 44px)
- Fast interactions (no lag)

---

## PART 6: TECHNICAL REQUIREMENTS

### Dependencies
- React + React Router
- Framer Motion (animations)
- Tailwind CSS (styling)
- Lucide React (icons)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Performance Considerations
- Lazy load images
- Optimize animations (use transform/opacity)
- Use `viewport={{ once: true }}` for entrance animations
- Minimize re-renders with proper React patterns

---

## PART 7: NAVIGATION FLOW

### URL Structure
- `/careers` - Main career page with all sections
- `/jobs` - Job listings with filtering
- `/internships` - Internship listings (if separate page)
- `/dashboard/interview` - Apply Now redirect destination

### Navigation Between Pages
- Career Page → Jobs Page: Link from "Explore Jobs" button
- Career Page → Internships: Link from "Explore Internships" button
- Jobs Page → Apply: Navigate to `/dashboard/interview`

---

## IMPLEMENTATION CHECKLIST

### Career Page (`/careers`)
- [ ] Navbar integration
- [ ] Hero section with animations
- [ ] Trusted by Top Companies section with real logos
- [ ] Jobs opportunities cards with quotes
- [ ] Internships section with quotes
- [ ] All animations and hover effects
- [ ] Responsive design across devices
- [ ] Accessibility compliance

### Jobs Page (`/jobs`)
- [ ] Page background (white)
- [ ] Dark hero section with image oval
- [ ] Search functionality
- [ ] Category filtering
- [ ] Job card layout and styling
- [ ] Apply Now button with correct redirect
- [ ] All animations and transitions
- [ ] Empty state handling
- [ ] Responsive design
- [ ] Accessibility features

### Overall
- [ ] Color scheme consistency
- [ ] Typography hierarchy
- [ ] Animation smoothness
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] SEO metadata
- [ ] Error handling
- [ ] Testing on multiple devices

---

## DEVELOPER NOTES

### Key Implementation Details
1. Use Framer Motion for all animations
2. Implement real company logos from CDN/Wikimedia
3. Create reusable components for cards
4. Use Tailwind CSS classes for styling
5. Implement proper routing with React Router
6. Add search/filter logic with state management
7. Ensure animations don't block interactions
8. Test on touch devices for mobile UX

### Performance Tips
- Use CSS transforms for animations (scale, rotate, translate)
- Avoid animating position changes (use translate instead)
- Use `will-change` CSS property for animated elements
- Implement lazy loading for images
- Optimize gradient backgrounds (consider static or CSS patterns)

### Browser Compatibility
- Chrome/Chromium: Full support
- Firefox: Full support
- Safari: Full support (test animations)
- Edge: Full support

---

## DELIVERABLES

This prompt covers:
1. ✓ Main Career Page with 3 major sections
2. ✓ Professional Jobs Page with search and filtering
3. ✓ Complete color palette and styling
4. ✓ Framer Motion animations and transitions
5. ✓ Apply Now button functionality
6. ✓ Responsive design guidelines
7. ✓ Accessibility standards
8. ✓ Developer implementation notes

---

**Last Updated:** February 15, 2025
**Status:** Ready for Builder.ai Implementation
**Completeness:** 100% Feature Complete
