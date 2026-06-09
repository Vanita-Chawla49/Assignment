import { formatDate, getInitials } from '../lib/format'

function DocumentList({ label, items, activeDocumentId, onSelect, emptyMessage }) {
  return (
    <section className="sidebar-section">
      <div className="section-header">
        <h3>{label}</h3>
        <span>{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="muted">{emptyMessage}</p>
      ) : (
        <div className="document-list">
          {items.map((doc) => (
            <button
              key={doc._id}
              type="button"
              className={`document-card ${activeDocumentId === doc._id ? 'active' : ''}`}
              onClick={() => onSelect(doc._id)}
            >
              <div className="document-card-top">
                <strong>{doc.title}</strong>
                <span>{formatDate(doc.updatedAt)}</span>
              </div>
              <div className="document-card-bottom">
                <div className="owner-chip">
                  <span>{getInitials(doc.owner.name)}</span>
                  <small>{doc.owner.name}</small>
                </div>
                <small>{doc.collaborators.length} shared</small>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default function Sidebar({
  currentUser,
  users,
  documents,
  activeDocumentId,
  onCreate,
  onImport,
  onSelect,
  onUserChange,
  importBusy,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div>
          <p className="eyebrow">Ajaia Interview Project</p>
          <h1>Collaborative Docs</h1>
        </div>
        <select value={currentUser?._id || ''} onChange={(event) => onUserChange(event.target.value)}>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="sidebar-actions">
        <button type="button" className="primary-button" onClick={onCreate}>
          New document
        </button>
        <label className="upload-button">
          {importBusy ? 'Importing...' : 'Import file'}
          <input
            type="file"
            accept=".txt,.md,.docx"
            onChange={(event) => onImport(event.target.files?.[0])}
            disabled={importBusy}
          />
        </label>
      </div>

      <p className="muted compact">Supported imports: `.txt`, `.md`, `.docx`.</p>

      <DocumentList
        label="Owned"
        items={documents.owned}
        activeDocumentId={activeDocumentId}
        onSelect={onSelect}
        emptyMessage="No owned documents yet."
      />
      <DocumentList
        label="Shared with me"
        items={documents.shared}
        activeDocumentId={activeDocumentId}
        onSelect={onSelect}
        emptyMessage="Nothing has been shared yet."
      />
    </aside>
  )
}

