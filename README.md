# Ajaia Collaborative Docs

A full-stack collaborative document editor built for the Ajaia interview exercise. The project focuses on practical product scope: rich-text document editing, file import, sharing, and persistence.

## Stack

- Frontend: React + Vite + TipTap
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- File import: `.txt`, `.md`, `.docx`

## Features

- Create, rename, edit, save, and reopen documents
- Rich-text formatting: bold, italic, underline, headings, bullet list, numbered list, text alignment
- Import `.txt`, `.md`, or `.docx` into a new editable document
- Seeded users with simple user switching for demo purposes
- Owner/collaborator sharing model
- Separate owned vs shared document lists
- Persistent document content, formatting JSON, and sharing data in MongoDB

## Project structure

- `backend/` Express API and MongoDB models
- `frontend/` React client and editor UI
- `ARCHITECTURE.md` architecture note
- `AI_WORKFLOW.md` AI workflow note
- `SUBMISSION.md` delivery checklist

## Local setup

### Prerequisites

- Node.js 20+
- npm 10+
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment files

Backend:

```bash
copy backend\.env.example backend\.env
```

Frontend:

```bash
copy frontend\.env.example frontend\.env
```

You can change the backend MongoDB connection string in `backend/.env` if needed.

### 3. Start the app

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Seeded demo users

The backend seeds these users automatically on startup:

- `ava@ajaia.test` - default owner
- `ben@ajaia.test` - collaborator
- `cara@ajaia.test` - reviewer

Use the user switcher in the UI to demonstrate owned vs shared documents.

## API overview

- `GET /api/users`
- `GET /api/documents?userId=...`
- `POST /api/documents`
- `GET /api/documents/:id?userId=...`
- `PUT /api/documents/:id?userId=...`
- `POST /api/documents/:id/share?userId=...`
- `POST /api/documents/import`

## Product scope notes

- Authentication is intentionally lightweight and simulated with seeded users.
- Imported file support is intentionally limited to `.txt`, `.md`, and `.docx` and is stated in the UI.
- Sharing is owner-managed only.
- Real-time multi-user editing is out of scope for this timebox.

## Demo flow suggestion

1. Start as Ava and create a document.
2. Add formatting and save.
3. Import a `.md` or `.docx` file as another document.
4. Share a document with Ben.
5. Switch to Ben and open it from the "Shared with me" section.