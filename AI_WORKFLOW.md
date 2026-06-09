# AI Workflow Note

## How AI was used

AI assistance was used to accelerate implementation planning, file scaffolding, and first-pass code generation for the full-stack app.

## Workflow summary

1. Translate the interview brief into a reduced, shippable product scope.
2. Select a practical stack: React + TipTap, Express, MongoDB.
3. Scaffold `frontend/` and `backend/` using terminal commands.
4. Generate baseline API routes, MongoDB models, and the editor UI.
5. Refine the implementation for state flow, autosave, sharing, and import handling.
6. Produce final project documentation and submission artifacts.

## What was still handled with engineering judgment

- Scope control: real-time editing was intentionally excluded.
- Data model design for owners, collaborators, and formatted content.
- UX choice to use seeded users instead of building full auth.
- Import limitations and how those constraints are surfaced in the UI.
- README and architecture framing for reviewer clarity.

## Guardrails applied

- Keep the scope coherent and demoable within interview constraints.
- Prefer readable implementation over unnecessary abstraction.
- Preserve a clear separation between client UI and server persistence logic.
- Document any limitation explicitly.