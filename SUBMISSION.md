# Submission

## Project

**Ajaia Collaborative Docs**

A lightweight full-stack collaborative document editor built for the interview exercise. The app focuses on the core workflow of creating, editing, importing, saving, reopening, and sharing documents while keeping the scope realistic for the timebox.

## What is included

### Application

- `frontend/` React + Vite client
- `backend/` Node.js + Express API
- MongoDB persistence via Mongoose

### Core capabilities implemented

#### 1. Document creation and editing

- Create a new document
- Rename a document
- Edit document content in the browser
- Save and reopen documents
- Autosave after short idle periods
- Manual save button

#### 2. Rich-text formatting

- Bold
- Italic
- Underline
- Headings
- Bullet lists
- Numbered lists
- Basic text alignment

#### 3. File upload / import

- Import `.txt`, `.md`, and `.docx` files
- Imported content becomes a new editable document
- Original file metadata is stored with the document
- Supported file types are clearly stated in the UI and README

#### 4. Sharing model

- Each document has a single owner
- Owner can grant access to another user
- Owned documents and shared documents are shown separately
- Collaborators can open and edit shared documents
- Only the owner can share a document further

#### 5. Persistence

- Documents persist in MongoDB
- Sharing relationships persist in MongoDB
- Rich-text structure persists as editor JSON
- Rendered HTML is also stored for practical reuse

## Demo users

The app seeds these users automatically on backend startup:

- `ava@ajaia.test`
- `ben@ajaia.test`
- `cara@ajaia.test`

The frontend includes a user switcher to demonstrate ownership and sharing flows without implementing a full auth system.

## Key files

### Root

- `README.md` - setup and run instructions
- `ARCHITECTURE.md` - short architecture note
- `AI_WORKFLOW.md` - AI workflow note
- `SUBMISSION.md` - this file

### Backend

- `backend/src/server.js` - app startup, DB connection, seeding
- `backend/src/app.js` - middleware and API registration
- `backend/src/models/User.js` - user model
- `backend/src/models/Document.js` - document model
- `backend/src/routes/documentController.js` - document logic
- `backend/src/routes/index.js` - API routes
- `backend/src/utils/fileImport.js` - import parsing helpers

### Frontend

- `frontend/src/App.jsx` - main application workflow
- `frontend/src/components/Sidebar.jsx` - document lists and user switcher
- `frontend/src/components/EditorToolbar.jsx` - formatting controls
- `frontend/src/components/SharePanel.jsx` - sharing UI
- `frontend/src/lib/api.js` - API client

## Run instructions

1. Start MongoDB locally
2. Copy env templates:
   - `backend/.env.example` to `backend/.env`
   - `frontend/.env.example` to `frontend/.env`
3. Install dependencies:
   - `npm run install:all`
4. Start both apps:
   - `npm run dev`

Frontend runs on `http://localhost:5173`

Backend runs on `http://localhost:4000`

## Validation completed

The following checks were completed:

- Frontend production build with `npm run build` in `frontend/`
- Backend syntax checks with `node --check` on core server files

## Product and engineering choices

### Chosen simplifications

- No full authentication system; seeded demo users are used instead
- No real-time multi-user collaboration
- No version history or comments
- `.docx` import preserves text content, not full Word formatting fidelity

### Why these choices were made

The objective was to deliver the strongest coherent working version within the exercise scope. The implementation prioritizes:

1. A stable document workflow
2. Clear persistence behavior
3. A usable sharing demo
4. Product-relevant file import

## Known limitations

- Real-time collaboration is not implemented
- Rich-text formatting support is intentionally basic
- Imported Markdown is treated as plain text content rather than full Markdown rendering
- Sharing supports only seeded users known to the system
- No attachment download surface is included; attachment metadata is stored for imported files

## Suggested demo flow

1. Launch the app as Ava
2. Create a new document
3. Add formatted content with headings and lists
4. Save the document
5. Import a `.txt`, `.md`, or `.docx` file as a second document
6. Share one document with Ben
7. Switch the active user to Ben
8. Open the document from the "Shared with me" list

## Deliverables checklist

- [x] Full-stack application
- [x] Frontend and backend folders
- [x] MongoDB persistence
- [x] Document creation and editing
- [x] Rich-text formatting
- [x] File upload/import
- [x] Sharing model
- [x] README with setup instructions
- [x] Architecture note
- [x] AI workflow note
- [x] Submission file
