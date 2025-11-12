# React Dashboard

A modern analytics dashboard built with React and Vite.

## Features

- React 19 with TypeScript
- Vite for fast development and builds
- Tailwind CSS for styling
- shadcn/ui component library
- Radix UI primitives
- Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Building

```bash
npm run build
# or
pnpm build
# or
yarn build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
# or
pnpm preview
# or
yarn preview
```

## Project Structure

```
ui client/
├── src/
│   ├── components/          # React components
│   ├── data/               # Mock data
│   ├── types/              # TypeScript types
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── theme-provider.tsx  # Theme configuration
├── lib/                    # Utility functions
├── hooks/                  # Custom React hooks
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
└── public/                 # Static assets
```

## Tech Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **Recharts** - Chart library
- **Lucide React** - Icons

## License

MIT

