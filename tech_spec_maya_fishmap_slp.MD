# Website Specification Sheet
## Maya Fishman SLP - Professional Landing Page

### **Project Overview**
- **Website Type**: Single-page promotional/landing page
- **Target Audience**: Parents, adults seeking speech therapy services
- **Platform**: Static HTML/CSS/JS hosted on GitHub Pages
- **Domain**: [To be specified]
- **Design Language**: Clean, minimal, professional
- **Languages**: **Bilingual - English/Hebrew with toggle functionality**
- **Device Support**: **Fully responsive - mobile-first design**

---

### **Language Support Requirements**

#### **Bilingual Functionality**
- **Primary Languages**: English and Hebrew
- **Language Toggle**: Prominent toggle button in header
- **Default Language**: [To be determined - English or Hebrew]
- **Content Management**: Separate content objects for each language
- **URL Structure**: Single page with language parameter (?lang=he/en)

#### **RTL (Right-to-Left) Support**
- **Hebrew Layout**: Full RTL layout support for Hebrew content
- **Text Direction**: Automatic text direction switching
- **UI Elements**: Mirror layout for Hebrew (navigation, forms, etc.)
- **Typography**: Hebrew-compatible font stack

#### **Technical Implementation**
- **Language Detection**: Browser language detection with manual override
- **State Persistence**: Remember user's language choice (localStorage)
- **Smooth Transitions**: Animated language switching
- **Fallback**: English as fallback for missing Hebrew content

---

### **Color Palette & Usage**

| Color | Hex Code | Primary Usage |
|-------|----------|---------------|
| Light Pastel Blue | `#A8D8F0` | Section backgrounds, soft accents |
| Dark Blue | `#3A6EA5` | Important text, primary buttons, headers |
| Light Pink | `#F8C8DC` | Soft backgrounds behind titles/testimonials |
| Dark Pink | `#E75480` | Call-to-action buttons, highlights |
| White | `#FFFFFF` | Main background, card backgrounds |
| Light Gray | `#F2F2F2` | Section dividers, subtle area highlighting |

---

### **Mobile-First Responsive Design**

#### **Design Philosophy**
- **Mobile-First**: Design starts with mobile experience
- **Progressive Enhancement**: Add features for larger screens
- **Touch-Friendly**: All interactive elements optimized for touch
- **Performance**: Fast loading on mobile networks

#### **Breakpoints**
- **Mobile Small**: 320px - 480px
- **Mobile Large**: 481px - 767px
- **Tablet**: 768px - 1024px
- **Desktop**: 1025px - 1200px
- **Large Desktop**: 1201px+

#### **Mobile-Specific Features**
- **Navigation**: Collapsible hamburger menu
- **Language Toggle**: Compact toggle in mobile header
- **Forms**: Large input fields, simplified layouts
- **Buttons**: Minimum 48px touch targets
- **Typography**: Readable font sizes (minimum 16px on mobile)

---

### **Page Structure & Sections**

#### **1. Header/Navigation**
- **Content**: 
  - Maya Fishman's name and credentials
  - **Language toggle button (EN/עב)**
  - Mobile hamburger menu
  - Navigation links
- **Responsive**: Collapsible navigation on mobile
- **RTL**: Mirrored layout for Hebrew

#### **2. Hero Section**
- **Content**:
  - Professional tagline/mission statement (bilingual)
  - Hero image placeholder
  - Primary CTA button (Schedule Consultation)
- **Responsive**: Full-width on all devices, text overlay adjusts
- **RTL**: Text alignment changes for Hebrew

#### **3. About/Professional Background**
- **Content**:
  - Professional photo placeholder
  - Education and certifications (bilingual)
  - Years of experience
  - Treatment philosophy
  - Professional affiliations
- **Responsive**: Single column on mobile, two-column on desktop
- **RTL**: Image-text order reverses for Hebrew

#### **4. Services Offered**
- **Content**:
  - Service categories (bilingual descriptions)
  - Age groups served
  - Treatment approaches used
- **Responsive**: Single column on mobile, grid on larger screens
- **RTL**: Card layouts adjust for Hebrew reading direction

#### **5. Contact Information & Form**
- **Content**:
  - Contact details (phone, email, address)
  - Office hours
  - Interactive contact form (bilingual labels)
- **Responsive**: Stacked layout on mobile, side-by-side on desktop
- **RTL**: Form layout mirrors for Hebrew

#### **6. Footer**
- **Content**:
  - Copyright information (bilingual)
  - Professional licensing info
  - Social media links
- **Responsive**: Simplified layout on mobile
- **RTL**: Layout mirrors for Hebrew

---

### **Interactive Elements**

#### **Language Toggle**
- **Position**: Top-right of header
- **Style**: Switch or button format (EN | עב)
- **Animation**: Smooth transition between languages
- **Persistence**: Remembers user choice

#### **Contact Form (Bilingual)**
- **Fields**:
  - Name / שם (required)
  - Email / אימייל (required)
  - Phone / טלפון
  - Subject / נושא (dropdown)
  - Message / הודעה (textarea)
- **Validation**: Bilingual error messages
- **RTL**: Form layout adjusts for Hebrew
- **Mobile**: Optimized input fields and spacing

---

### **Typography Guidelines**

#### **Font Strategy**
- **English**: Modern sans-serif (Google Fonts: Poppins or Open Sans)
- **Hebrew**: Hebrew-compatible font (Assistant, Heebo, or Rubik)
- **Fallbacks**: System fonts for both languages

#### **Responsive Typography**
- **Mobile**: 
  - H1: 24-28px
  - H2: 20-24px
  - Body: 16px
- **Desktop**: 
  - H1: 32-40px
  - H2: 24-28px
  - Body: 18px

---

### **Technical Specifications**

#### **File Structure**
    /
    ├── index.html
    ├── css/
    │   ├── styles.css
    │   ├── responsive.css
    │   └── rtl.css
    ├── js/
    │   ├── main.js
    │   ├── language-toggle.js
    │   └── form-validation.js
    ├── data/
    │   ├── content-en.json
    │   └── content-he.json
    ├── images/
    │   ├── hero-image.jpg
    │   ├── profile-photo.jpg
    │   └── icons/
    └── README.md

#### **Language Implementation**
- **Content Storage**: JSON files for each language
- **Dynamic Loading**: JavaScript-based content switching
- **CSS Classes**: `.ltr` and `.rtl` classes for layout control
- **HTML Lang Attribute**: Dynamic lang attribute updating

#### **Mobile Performance**
- **Image Optimization**: Responsive images with srcset
- **CSS**: Mobile-first media queries
- **JavaScript**: Touch event optimization
- **Loading**: Progressive loading for mobile

---

### **Accessibility Requirements**
- **WCAG 2.1 AA** compliance in both languages
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Compatible with Hebrew and English screen readers
- **Language Attributes**: Proper lang attributes for each section
- **Color Contrast**: Meets accessibility standards in both RTL/LTR layouts

---

### **Content Placeholders (Bilingual)**

#### **Text Content Needed**
- [ ] Professional bio (English & Hebrew, 150-200 words each)
- [ ] Service descriptions (English & Hebrew, 50-75 words each)
- [ ] Contact information
- [ ] Credentials and certifications (both languages)
- [ ] Treatment philosophy statement (both languages)
- [ ] Form labels and validation messages (both languages)

#### **Technical Testing Required**
- [ ] Cross-browser RTL support testing
- [ ] Mobile responsiveness on various devices
- [ ] Language toggle functionality
- [ ] Form submission in both languages
- [ ] Performance testing on mobile networks

---

### **Launch Checklist**
- [ ] **Bilingual content** review and approval
- [ ] **RTL layout** testing
- [ ] **Mobile responsiveness** across devices
- [ ] **Language toggle** functionality testing
- [ ] Cross-browser testing (including RTL support)
- [ ] Form functionality in both languages
- [ ] **Mobile performance** optimization
- [ ] Accessibility audit (bilingual)
- [ ] SEO optimization for both languages