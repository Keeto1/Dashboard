# Dashboard Project

## Project Overview
Modern, responsive, and interactive React dashboard with data visualization components.

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Charts**: Recharts
- **Styling**: CSS with CSS Variables

## Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Project Structure
```
src/
├── components/
│   ├── charts/          # Chart components (Line, Bar, Area, Donut)
│   ├── common/          # Shared components (Header, Sidebar, StatsCard, Loading)
│   └── sections/        # Page sections (Hero, Metrics, Analytics, Performance, Team)
├── hooks/               # Custom React hooks
├── services/            # API/Data services
├── mock/                # Mock data
├── styles/              # Global styles and CSS variables
└── utils/               # Helper functions
```

## Components

### Charts
- `LineChart` - Line chart with Recharts
- `BarChart` - Bar chart with multiple bars support
- `AreaChart` - Area chart with gradient fill
- `DonutChart` - Circular progress indicator

### Sections
- `Hero` - Welcome section with call-to-action buttons
- `Metrics` - Key metrics cards with stats
- `Analytics` - Revenue and sales charts
- `Performance` - Performance metrics with sparklines
- `Activity` - Recent activity feed
- `Team` - Team members list with status

## Styling

### Color System
The dashboard uses a professional color palette defined in CSS variables:
- `--primary`: #4361ee (Primary blue)
- `--secondary`: #7209b7 (Purple)
- `--success`: #4cc9f0 (Cyan)
- `--warning`: #f72585 (Pink)
- `--info`: #4895ef (Light blue)

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: < 768px
- Desktop: < 1024px
- Large: < 1280px

## Features
- ✅ Fully responsive design
- ✅ Interactive charts with tooltips
- ✅ Hover effects and animations
- ✅ Loading states
- ✅ Mobile-friendly sidebar
- ✅ Professional color scheme
- ✅ Modular component architecture

## Data Source
Currently using mock data from `public/mock/data.json`. To connect to a real API, update the functions in `src/services/dashboard.js`.

## Best Practices
- Use CSS variables for consistent theming
- Follow existing component patterns
- Keep components modular and reusable
- Use semantic HTML
- Maintain responsive design across all components
