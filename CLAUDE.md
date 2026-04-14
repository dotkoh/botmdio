@AGENTS.md

# Bot MD IO — Design System & Tech Stack

## Stack
- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4 (use `@import "tailwindcss"` in globals.css, NOT @tailwind directives)
- PostCSS config: `{ plugins: { "@tailwindcss/postcss": {} } }`
- Font: Inter from Google Fonts (latin subset), applied via `next/font/google` in root layout.tsx
- Icons: lucide-react (use 15-18px for inline, 20-24px for standalone)
- Path alias: `@/*` → `./src/*`

## Layout Architecture
- Root body: `bg-gray-50` with Inter font class
- Dashboard layout: `flex min-h-screen` with fixed sidebar + scrollable main
- Sidebar: fixed left, `w-56 bg-white border-r border-gray-200`, always visible
- Main content: `flex-1 ml-56 flex flex-col`
- Header: `sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3`
- Z-index layers: sidebar=10, header=20, dropdowns=30, modals/overlays=50

## Component Patterns

### Cards
`bg-white rounded-xl border border-gray-200 p-5` — no box-shadows on cards.

### Buttons
- Primary: `bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors`
- Secondary: `bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm`
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`

### Sidebar Navigation
- Active: `bg-blue-50 text-blue-600 border-l-3 border-blue-600 font-medium`
- Inactive: `text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors`

### Dropdowns
- Container: `absolute top-full left-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-30`
- Always use click-outside handler with useRef + useEffect

### Modals
- Backdrop: `fixed inset-0 z-50 bg-black/40 flex items-center justify-center`
- Content: `bg-white rounded-2xl shadow-xl w-[480px] max-w-[90vw]`

### Form Inputs
- Input: `w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition`

## Color Palette
- Primary: `#4361EE` (brand — buttons, links, focus)
- Gray-50 page bg, Gray-200 borders, Gray-400 muted text, Gray-900 primary text

## Typography
- Page title: `text-2xl font-bold text-gray-900`
- Section heading: `text-lg font-semibold text-gray-900`
- Card title: `text-sm font-medium text-gray-500`
- Body: `text-sm text-gray-700`
- Secondary: `text-xs text-gray-400`
- Table header: `text-xs font-semibold text-gray-500 uppercase tracking-wider`

## Do NOT
- Use box-shadows on cards (use `border border-gray-200`)
- Use `@tailwind` directives (Tailwind v4 uses `@import "tailwindcss"`)
- Use heavy component libraries (no MUI, Chakra, shadcn)
- Use `text-black` (use `text-gray-900`)
