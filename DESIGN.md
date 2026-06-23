---
name: Premium Sensuality
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0d0e0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#292a2a'
  surface-container-highest: '#333535'
  on-surface: '#e3e2e2'
  on-surface-variant: '#cfc4c5'
  inverse-surface: '#e3e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#988e90'
  outline-variant: '#4c4546'
  surface-tint: '#c6c6c6'
  primary: '#c6c6c6'
  on-primary: '#303030'
  primary-container: '#000000'
  on-primary-container: '#757575'
  inverse-primary: '#5e5e5e'
  secondary: '#f7b6bb'
  on-secondary: '#4d2429'
  secondary-container: '#68393e'
  on-secondary-container: '#e4a5aa'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#000000'
  on-tertiary-container: '#747576'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#ffdadc'
  secondary-fixed-dim: '#f7b6bb'
  on-secondary-fixed: '#340f15'
  on-secondary-fixed-variant: '#68393e'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#121414'
  on-background: '#e3e2e2'
  surface-variant: '#333535'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 80px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: 0.05em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.03em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.03em
  subheading:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.2em
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '300'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.1em
spacing:
  margin-edge: 5vw
  gutter: 24px
  section-gap: 120px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is rooted in the "Vogue" editorial aesthetic—a high-fashion, high-contrast environment that prioritizes evocative imagery over dense UI. It targets a sophisticated audience looking for luxury and exclusivity. The brand personality is alluring, authoritative, and unapologetically premium.

The visual style is **Minimalist / High-Contrast**, leaning heavily on generous "black space" to allow photorealistic textures—such as the subtle sheen of silk and the intricate patterns of lace—to serve as the primary atmospheric drivers. All interactions are deliberate and restrained, evoking the feeling of a private gallery or a boutique atelier.

## Colors
The palette is dominated by **Onyx Black**, creating a deep, immersive "dark mode" that serves as the canvas for luxury. 

- **Onyx Black (#000000):** Used for the background and primary surfaces to establish depth.
- **Rose Gold Blush (#F0B0B5):** Reserved strictly for high-impact CTAs, active states, and essential highlights.
- **Champagne White (#F8F8F8):** The primary color for body text and primary headers, ensuring high legibility against the dark background.
- **Soft Silver (#C0C0C0):** Utilized for metadata, secondary descriptions, and subtle decorative borders.

## Typography
The typography system relies on the contrast between the romantic, high-stroke-contrast of a serif and the geometric precision of a sans-serif.

- **Headlines:** Use **Playfair Display**. Characterized by elegant serifs and extreme contrast. Increased letter spacing is required for a sophisticated, editorial look.
- **Navigation & Sub-headers:** Use **Montserrat** in all-caps. This provides a functional, modern counterpoint to the decorative headings.
- **Body Text:** Use **Montserrat** with a generous 1.6 line height to ensure maximum readability and a spacious, airy feel.

## Layout & Spacing
The layout follows a **Fluid Grid** model with an emphasis on oversized margins to mimic the layout of a physical high-fashion magazine. 

- **Desktop:** A 12-column grid with a minimum 5vw outer margin. Content should "breathe," utilizing asymmetric layouts to create visual interest.
- **Section Spacing:** Vertical gaps between major content blocks should be aggressive (120px+) to maintain the sense of luxury.
- **Mobile:** Reflows to a 2-column or 1-column grid. The 5vw side margins are maintained to ensure content doesn't feel cramped.

## Elevation & Depth
This design system rejects traditional shadows in favor of **Tonal Layers** and **Low-contrast Outlines**. 

Depth is communicated through the layering of images and text. Surfaces use variations of black and very dark greys (e.g., #050505) to distinguish between the background and interactive containers. Borders are strictly 1px solid **Soft Silver** at low opacity (10-20%) to define shapes without breaking the dark aesthetic. Photorealistic silk or lace overlays can be applied to background containers to add a tactile, sensual depth.

## Shapes
In alignment with the high-fashion aesthetic, all shapes must have **0px border radius**. Sharp, architectural edges convey a sense of precision, discipline, and luxury. This applies to buttons, input fields, cards, and image containers.

## Components

- **Buttons:** Primary buttons are solid **Rose Gold Blush** with **Onyx Black** all-caps text. Secondary buttons are "Ghost" style: 1px **Champagne White** border, sharp edges, and white text. Hover states should include a subtle silk-texture overlay or a slight opacity shift.
- **Inputs:** Underline-only or 1px bordered boxes. Use **Soft Silver** for placeholder text. The focus state transitions the border to **Rose Gold Blush**.
- **Cards:** Product cards must be minimalist. The image is the hero. Price and title appear in **Champagne White** (Montserrat) below the image, with no visible container border unless hovered.
- **Logo Placement:** The "Femme" logo must be centered in the global header, significantly sized to command attention. On scroll, it may transition to the monogram version for space efficiency.
- **Chips/Labels:** Small, all-caps **Montserrat** text with a 1px border. Used for "New Arrival" or "Limited Edition" tags.
- **Navigation:** Top-level links are all-caps with generous horizontal tracking. Underline animations on hover should be a thin 1px line in **Rose Gold Blush**.