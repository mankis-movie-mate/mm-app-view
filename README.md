# mm-app-view

[![CI/CD](https://github.com/mankis-movie-mate/mm-app-view/actions/workflows/build-and-push.yml/badge.svg)](https://github.com/mankis-movie-mate/mm-app-view/actions)
[![Docker](https://img.shields.io/docker/pulls/manki1337/mm-app-view?logo=docker)](https://hub.docker.com/r/manki1337/mm-app-view)
[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=mm-app-view)](https://mm-app-view.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-3A3A3A?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

**Frontend UI for [MovieMate](https://github.com/mankis-movie-mate)**  
The movie recommendation dashboard and user-facing views.

---

## 🚀 **Live Demo**

👉 **[Try it on Vercel &nbsp;🌐](https://mm-app-view.vercel.app)**


---

## 🧩 **Tech Stack**

- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) 
- [React Query](https://tanstack.com/query/latest) (data fetching & caching)
- [Vercel](https://vercel.com/) (cloud hosting)
- [Docker](https://www.docker.com/) (for K8s self-hosted deployments)

---

## 🏗️ **Features**

- 🔑 User authentication, JWT & refresh token support
- 🎬 Search & discover movies (detailed card & info page)
- 🌟 Personalized movie recommendations
- 📜 Watchlists (with management, create/edit/delete)
- 📝 User reviews & ratings

---



### **Local Development**

```sh
cd mm-app-view
cp .env.example .env.local      # Fill in your envs!
npm install
npm run dev
