<div align="center">

# 🚀 Plataforma IMR  
### Sistema completo de cursos online com autenticação, pagamentos e painel moderno

![cover](https://dummyimage.com/1200x350/0f0f0f/ffffff&text=Plataforma+IMR+%7C+Next.js+Stripe+Supabase)

---

## 🔥 Status: Em desenvolvimento ativo  
Última atualização: **2025**

![Next.js Badge](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs)
![Supabase Badge](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Stripe Badge](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)
![Tailwind Badge](https://img.shields.io/badge/TailwindCSS-Framework-38B2AC?style=for-the-badge&logo=tailwindcss)
![Shadcn Badge](https://img.shields.io/badge/shadcn/ui-Components-white?style=for-the-badge)
![License Badge](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

</div>

---

# 📘 **Descrição Geral**

A **Plataforma IMR** é um sistema completo para cursos online desenvolvido com:

- **Next.js App Router (fullstack)**
- **Supabase (autenticação + banco de dados)**
- **Stripe (pagamentos e webhooks)**
- **Tailwind CSS + Shadcn/UI (frontend moderno)**

Com este ecossistema, o usuário consegue:

✔ Cadastrar-se  
✔ Validar e-mail com código  
✔ Comprar cursos via Stripe  
✔ Receber liberação instantânea do conteúdo  
✔ Acessar tudo em um painel responsivo  

---

# 🏗️ **Arquitetura Geral**

```mermaid
flowchart TD
    A[Frontend - Next.js 14] --> B[API Routes - Next.js]
    B --> C[Supabase - Auth]
    B --> D[Supabase - Postgres DB]
    A --> E[Stripe Checkout]
    E --> F[Stripe Webhooks -> API]
    F --> D
    D --> G[User Courses / Acesso Liberado]















