export default function SharePanel({ users, currentUser, activeDocument, shareEmail, setShareEmail, onShare, busy }) {
  const shareableUsers = users.filter(
    (user) => user.email !== currentUser?.email && user.email !== activeDocument?.owner?.email,
  )

  return (
    <section className="share-panel">
      <div>
        <h3>Sharing</h3>
        <p className="muted">Owner: {activeDocument?.owner?.name || '—'}</p>
      </div>

      <div className="share-controls">
        <select value={shareEmail} onChange={(event) => setShareEmail(event.target.value)}>
          <option value="">Select user to share</option>
          {shareableUsers.map((user) => (
            <option key={user._id} value={user.email}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
        <button type="button" onClick={onShare} disabled={!shareEmail || busy}>
          {busy ? 'Sharing...' : 'Grant access'}
        </button>
      </div>

      <div className="share-list">
        {(activeDocument?.collaborators || []).map((collaborator) => (
          <div key={collaborator._id} className="share-list-item">
            <strong>{collaborator.name}</strong>
            <span>{collaborator.email}</span>
          </div>
        ))}
        {activeDocument?.collaborators?.length === 0 && (
          <p className="muted">No collaborators yet.</p>
        )}
      </div>
    </section>
  )
}

