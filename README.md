# Taskify — Full-Stack Todo Agent

A full-stack task manager with an OpenAI agent embedded where it earns its keep: prioritising tasks and acting on them, rather than being bolted on as a chat box.

**[Try it live →](https://saadaslam58.github.io/Phase-3/)**

## What it demonstrates

A small, honest example of the agent-in-production pattern:

- **Real task CRUD** — the agent operates on actual application state, not a mock
- **AI-assisted prioritisation** — the agent reasons over the task list and suggests ordering
- **Agent takes actions** — it can create and update tasks, not only describe them
- **Clean dashboard UI** — the agent is one part of a working product

## Stack

TypeScript · Next.js · React · OpenAI

## Running locally

```bash
git clone https://github.com/SaadAslam58/Phase-3.git
cd Phase-3
npm install
npm run dev
```

You will need an `OPENAI_API_KEY` in `.env.local` for the agent features.

---

<!-- gehox-footer -->
Built by [**Gehox**](https://gehox.com) — custom software, AI agents and workflow automation for small teams.

[gehox.com](https://gehox.com) · [Book a 30-min call](https://cal.com/saad-aslam/30min)
