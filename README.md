# 📘 Plataforma IMR — Documentação Geral das Funcionalidades


A Plataforma IMR é um sistema completo de cursos online desenvolvido em Next.js App Router, com foco em performance, segurança, escalabilidade e integração com serviços profissionais.

O objetivo é permitir que usuários se cadastrem, validem identidade por email, comprem cursos via Stripe e tenham acesso imediato ao conteúdo adquirido — tudo isso com uma UX moderna e responsiva construída com Tailwind + Shadcn/UI.

> **Status do Projeto:** Em desenvolvimento ativo
>
> **Última atualização:** 2025

---

# 🚀 Visão Geral da Plataforma

A **Plataforma IMR** é um sistema moderno e escalável criado com **Next.js (App Router)**, com backend integrado, frontend dinâmico, arquitetura organizada e recursos essenciais para operação real em produção.

O sistema já possui:

* 🔐 Autenticação completa com verificação por e-mail
* 📧 Código de validação enviado por e-mail
* 👤 Fluxo de cadastro seguro com criptografia de senha
* 🛍️ Sistema de confirmação de compra (implementado no início do projeto)
* 🌐 API totalmente funcional em rotas server-side do Next.js
* 📡 Testes manuais via Node.js com `fetch`
* 🧩 Estrutura modular pronta para escalar para dashboard, módulos administrativos e mais

---
🏛️ Tecnologias Utilizadas (Stack Oficial)

A plataforma utiliza tecnologias modernas que são padrão em empresas de ponta:

Frontend & Fullstack

Next.js 14 (App Router) – SSR, RSC, Edge Ready

React 18+

TypeScript

Tailwind CSS – estilização rápida e responsiva

Shadcn/UI – biblioteca de componentes premium

Lucide Icons – ícones modernos

Zod – validação de dados

Backend

Next.js API Routes / Route Handlers

Supabase

Autenticação

Banco de dados Postgres

RLS (Row Level Security)

Realtime

Stripe

Checkout

Webhooks

Registro de pagamentos

Associação pagamento → curso no Supabase

Infraestrutura

Vercel — deploy do frontend e backend juntos

Supabase Cloud — base de dados e autenticação

Stripe Dashboard — controle dos pagamentos

# 🧩 Funcionalidades Implementadas

A seguir está a **lista completa e detalhada** de tudo que funciona hoje na plataforma.

---

🎯 Funcionalidades Já Implementadas

Abaixo está a lista oficial e completa de tudo que JÁ está funcionando no projeto.

🔐 1. Sistema de Autenticação Completo

Cadastro com:
✔ Nome
✔ Sobrenome
✔ Email
✔ Telefone
✔ Senha forte validada por critérios (maiúscula, minúscula, número, especial, 8+ chars)

Login / Logout

Recuperação de senha

Controle de sessão persistente

Hook próprio useAuth() integrado ao Supabase

Registro automático do usuário na tabela users após signup

📧 2. Verificação de Email com Código

Envio de código via email usando serviço confiável

Código armazenado e validado via backend

Login bloqueado até a verificação acontecer

Prevenção contra brute force e tentativas repetidas

💳 3. Integração Completa com Stripe

A plataforma já possui integração funcional com toda a cadeia do Stripe:

✔ Checkout

Criação de sessão de pagamento

Informações do usuário e curso enviadas ao Stripe

✔ Webhooks (implementado corretamente)

Recebe notificações do Stripe mesmo com o sistema offline

Confirma transações

Valida assinatura do evento

Atualiza a base Supabase com:

ID do pagamento

User ID

Course ID

Valor

Status

Evita duplicações com controle idempotente

✔ Registro de Compra

Após pagamento ser aprovado → grava automaticamente no Supabase:

purchases

user_courses

Garantido via webhook (não depende do cliente)

🧩 4. Integração Total com o Supabase

Tabela users

Tabela purchases

Tabela courses

Tabela user_courses

RLS configurado

Realtime funcionando com presença (usuários online)

Inclui:

✔ Presença em tempo real (Realtime)

Componente funcionando:

Lista de usuários online

Atualiza ao entrar/sair

Indicador verde ao vivo

🛒 5. Fluxo Completo de Compra

Usuário logado escolhe o curso

Inicia o checkout Stripe

Stripe redireciona para pagamento seguro

Webhook recebe confirmação

Compra é registrada no Supabase

Usuário ganha acesso ao conteúdo automaticamente

🌗 6. Tema Claro/Escuro (Dark Mode)

Persistência do tema

Estilização completa usando Tailwind

Inputs, botões e formulários adaptados

Componentes Shadcn estilizados para os dois temas

🧮 7. Calculadora de BTUs Inteligente

Interface moderna usando Tailwind + Lucide

Janela arrastável com controle completo do DOM

Cálculo baseado em:

Área

Exposição solar

Pessoas

Fontes de calor

Resultado formatado e responsivo

📦 8. Arquitetura Organizada e Escalável

Padrão de pastas limpo

API Routes isoladas

Serviços separados por domínio

Middlewares próprios

Tipagem TypeScript forte

Nada de gambiarra

🚀 9. Deploy Profissional

Deploy contínuo na Vercel

Variáveis de ambiente configuradas corretamente

Webhooks do Stripe apontando para produção

Build otimizado com cache e assets minificados

---
📚 Como Rodar o Projeto
git clone https://github.com/SEU-USUARIO/plataforma-imr.git
cd plataforma-imr
npm install
npm run dev


Crie um arquivo .env.local com:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASS=
EMAIL_SERVER_HOST=
EMAIL_FROM=

🔄 Atualizações Futuras (Roadmap Oficial)

Área do aluno completa

Upload e streaming de video-aulas

Sistema de módulos e progresso

Dashboard admin

Faturas e histórico de compras

Webhooks adicionais

Chat interno aluno → suporte

Integração WhatsApp Business API (se for viável)

Notificações push

# 🏆 Conclusão

A Plataforma IMR já possui um conjunto de funcionalidades **prontas e operacionais**, com qualidade profissional e seguindo padrões modernos de engenharia de software.

Este README reflete:

* Organização
* Clareza
* Profissionalismo
* Arquitetura escalável
* Domínio técnico

