# AVENIQ Showcase Website

A premium, highly interactive digital showcase designed to demonstrate the design craftsmanship and technical excellence of AVENIQ. Built as a production-ready, scalable foundation using Next.js 15, TypeScript, and Tailwind CSS v3.

## Technology Stack

- **Core**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v3 (stable), PostCSS, Autoprefixer, next-themes
- **Animations**: GSAP, Framer Motion, Lenis (smooth scrolling)
- **Forms & Validation**: React Hook Form, Zod
- **Backend Integrations**: Supabase Client (configuration templates), Cloudinary (placeholder services)

---

## Folder Architecture

The project is structured using a clean, layered architecture designed for long-term scalability and domain separation.

```
├── app/                  # Route layouts, pages, sitemaps, robots, metadata, and globals.css
├── components/           # Presentation layer (reusable UI and layout primitives)
│   ├── common/           # Custom shareable UI (buttons, cards)
│   ├── layout/           # Structure primitives (Container, Stack, Grid, Section)
│   ├── typography/       # Headings and custom text components
│   └── ui/               # Primitive base components (shadcn setup)
├── features/             # Feature-specific components and business logic
│   ├── home/             # Landing page content modules
│   └── showcase/         # Showcase gallery modules
├── providers/            # React providers (Theme, Lenis scroll, Custom cursor context)
├── animations/           # Animation utility files and configuration
│   ├── gsap/             # GSAP instance plugins configurations
│   └── variants/         # Framer motion preset states
├── config/               # Settings layer (siteConfig, SEO defaults, nav maps)
├── constants/            # Immutable arrays (routes, colors, breakpoints, animations)
├── data/                 # Static data layer (mocks, database validation schemas)
├── lib/                  # Helper modules (cn, env validation, debounce, format, math)
├── services/             # Integrations (Supabase, Cloudinary)
└── public/               # Asset folder (fonts, logos, images)
```

---

## Getting Started

### Prerequisites

Ensure you have **Node.js 18+** and **pnpm** installed.

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure environment:
   Create a `.env.local` file at the root (see [.env.local](file:///.env.local) template):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. Run the development server:
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the foundation shell.

---

## Commands & Scripts

- `pnpm run dev` — Starts the development server at port 3000.
- `pnpm run build` — Generates an optimized production build.
- `pnpm run start` — Boots the compiled server.
- `pnpm run lint` — Validates code cleanliness with ESLint.
- `pnpm tsc --noEmit` — Validates strict TypeScript compliance.

---

## Code Quality Standards

To maintain senior-level codebase quality:
- **Server Components by Default**: Client Components should only be declared when browser context (e.g. state, hooks, document objects) is required.
- **Strict TypeScript**: Avoid `any` completely. Rely on interfaces defined in `types/` or validation schemas in `data/schemas/`.
- **Decoupled Configuration**: Never hardcode endpoints, routes, colors, or transitions inside pages or UI layers. Map them to `config/` or `constants/`.
- **Target File Size Limits**:
  - Presentation components ≤ 200 lines.
  - Custom React Hooks ≤ 150 lines.
  - Utility and service files ≤ 150 lines.
- **Style Rules**: Always use the typography primitives (`Heading`, `Text`, `Caption`) and layouts (`Container`, `Section`, `Stack`, `Grid`) to ensure visual consistency.
