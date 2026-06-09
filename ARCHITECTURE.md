# Architecture Note

## Overview

The application is a two-tier web app with a React client and an Express API backed by MongoDB.

## Frontend

- `frontend/src/App.jsx` holds the top-level document workflow.
- TipTap provides browser-based rich-text editing.
- The UI is intentionally single-page to keep the primary workflow obvious.
- The active user is simulated through a selector fed by seeded backend users.
- Autosave is triggered after short idle periods, with a manual save fallback.

## Backend

- `backend/src/server.js` starts the service, connects MongoDB, and seeds demo users.
- `backend/src/app.js` configures middleware and API routing.
- `backend/src/models/User.js` stores demo users.
- `backend/src/models/Document.js` stores title, owner, collaborators, attachments, HTML, and TipTap JSON.
- `backend/src/routes/documentController.js` handles document CRUD, sharing, and import.

## Persistence model

Each document stores:

- `title`
- `owner`
- `collaborators`
- `contentJson` for structural editor state
- `contentHtml` for convenient rendering/export paths later
- `attachments` metadata for imported files
- timestamps and `lastOpenedAt`

This preserves formatting in a practical way while keeping the schema straightforward.

## Sharing model

- A document has one owner.
- The owner can grant access to another seeded user by email.
- The document list is split into owned and shared collections on read.
- Collaborators can open and edit the document; only the owner can share it further.

## File import model

Supported file types:

- `.txt`
- `.md`
- `.docx`

`.txt` and `.md` are read as plain UTF-8 text. `.docx` is converted to raw text using `mammoth`. Imported content becomes a new editable document and records the original file as attachment metadata.

## Tradeoffs and prioritization

Chosen priorities:

1. Persistence and stable CRUD flows
2. Usable rich-text editing
3. Clear sharing demonstration
4. Product-relevant file import

Deferred intentionally:

- Real-time collaboration
- Role-based permissions beyond owner/collaborator
- Comments, version history, and export flows
- Full `.docx` formatting preservation