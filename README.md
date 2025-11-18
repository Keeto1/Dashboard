# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Backend API

This dashboard is intended to be used with a backend API. Configure your backend base URL in the `.env` file using `VITE_API_URL`, for example:

```
VITE_API_URL=http://localhost:4000/api
```

The frontend expects the backend to expose the endpoints documented in `src/config/api.js` (examples listed below). Ensure CORS allows the frontend origin (dev server typically at `http://localhost:3001`).

If you don't have a backend yet, implement the required endpoints and response shapes described in the code comments inside `src/services/`.

### Local development

Run the dev server with:

```
npm run dev
```

If you later add a backend, implement it under `src/services/` and expose any required environment variables in `.env.local`.
