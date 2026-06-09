import { useEffect, useMemo, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import api from './lib/api'
import Sidebar from './components/Sidebar'
import EditorToolbar from './components/EditorToolbar'
import SharePanel from './components/SharePanel'
import './App.css'

const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] }

function App() {
  const [users, setUsers] = useState([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [documents, setDocuments] = useState({ owned: [], shared: [] })
  const [activeDocument, setActiveDocument] = useState(null)
  const [title, setTitle] = useState('')
  const [saveState, setSaveState] = useState('Saved')
  const [statusMessage, setStatusMessage] = useState('Select or create a document.')
  const [importBusy, setImportBusy] = useState(false)
  const [shareBusy, setShareBusy] = useState(false)
  const [shareEmail, setShareEmail] = useState('')
  const saveTimer = useRef(null)
  const isHydratingRef = useRef(false)

  const currentUser = useMemo(
    () => users.find((user) => user._id === currentUserId) || null,
    [users, currentUserId],
  )

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: EMPTY_DOC,
    editorProps: {
      attributes: {
        class: 'editor-surface',
      },
    },
    onUpdate: () => {
      if (isHydratingRef.current || !activeDocument) return
      setSaveState('Unsaved changes')
      queueSave()
    },
  })

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    if (!currentUserId) return
    loadDocuments(currentUserId)
  }, [currentUserId])

  useEffect(() => {
    if (!editor) return

    isHydratingRef.current = true
    editor.commands.setContent(activeDocument?.contentJson || EMPTY_DOC)
    window.setTimeout(() => {
      isHydratingRef.current = false
    }, 0)
  }, [editor, activeDocument])

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  async function loadUsers() {
    try {
      const { data } = await api.get('/users')
      setUsers(data)
      if (data[0]) setCurrentUserId(data[0]._id)
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Failed to load users.')
    }
  }

  async function loadDocuments(userId) {
    try {
      const { data } = await api.get('/documents', { params: { userId } })
      setDocuments(data)

      const currentStillVisible = [...data.owned, ...data.shared].find((doc) => doc._id === activeDocument?._id)
      if (currentStillVisible) {
        await openDocument(currentStillVisible._id, userId)
        return
      }

      const nextDocument = data.owned[0] || data.shared[0] || null
      if (nextDocument) {
        await openDocument(nextDocument._id, userId)
      } else {
        setActiveDocument(null)
        setTitle('')
        setStatusMessage('No documents yet. Create one or import a file.')
        setSaveState('Saved')
      }
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Failed to load documents.')
    }
  }

  async function openDocument(documentId, userId = currentUserId) {
    try {
      const { data } = await api.get(`/documents/${documentId}`, { params: { userId } })
      setActiveDocument(data)
      setTitle(data.title)
      setShareEmail('')
      setStatusMessage(`Opened "${data.title}"`)
      setSaveState('Saved')
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Failed to open document.')
    }
  }

  async function handleCreate() {
    try {
      const { data } = await api.post('/documents', {
        title: 'Untitled document',
        userId: currentUserId,
      })

      await loadDocuments(currentUserId)
      await openDocument(data._id)
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Failed to create document.')
    }
  }

  async function handleImport(file) {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', currentUserId)

    setImportBusy(true)
    try {
      const { data } = await api.post('/documents/import', formData)
      await loadDocuments(currentUserId)
      await openDocument(data._id)
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Import failed.')
    } finally {
      setImportBusy(false)
    }
  }

  function queueSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveDocument(), 900)
  }

  async function saveDocument() {
    if (!activeDocument || !editor) return

    setSaveState('Saving...')
    try {
      const { data } = await api.put(
        `/documents/${activeDocument._id}`,
        {
          title: title.trim() || 'Untitled document',
          contentJson: editor.getJSON(),
          contentHtml: editor.getHTML(),
        },
        { params: { userId: currentUserId } },
      )

      setActiveDocument(data)
      setSaveState('Saved')
      setStatusMessage(`Saved at ${new Date(data.updatedAt).toLocaleTimeString()}`)
      await loadDocuments(currentUserId)
    } catch (error) {
      setSaveState('Save failed')
      setStatusMessage(error.response?.data?.message || 'Failed to save document.')
    }
  }

  async function handleManualSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    await saveDocument()
  }

  async function handleShare() {
    if (!activeDocument || !shareEmail) return

    setShareBusy(true)
    try {
      const { data } = await api.post(
        `/documents/${activeDocument._id}/share`,
        { collaboratorEmail: shareEmail },
        { params: { userId: currentUserId } },
      )
      setActiveDocument(data)
      setShareEmail('')
      setStatusMessage(`Shared with ${shareEmail}`)
      await loadDocuments(currentUserId)
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Sharing failed.')
    } finally {
      setShareBusy(false)
    }
  }

  function handleTitleChange(value) {
    setTitle(value)
    if (!activeDocument) return
    setSaveState('Unsaved changes')
    queueSave()
  }

  const canShare = activeDocument && activeDocument.owner && activeDocument.owner._id === currentUserId

  return (
    <div className="app-shell">
      <Sidebar
        currentUser={currentUser}
        users={users}
        documents={documents}
        activeDocumentId={activeDocument?._id}
        onCreate={handleCreate}
        onImport={handleImport}
        onSelect={openDocument}
        onUserChange={setCurrentUserId}
        importBusy={importBusy}
      />

      <main className="workspace">
        <header className="workspace-header">
          <div>
            <input
              className="document-title-input"
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Document title"
              disabled={!activeDocument}
            />
            <p className="muted">{statusMessage}</p>
          </div>
          <div className="header-actions">
            <span className={`save-pill ${saveState === 'Saved' ? 'saved' : ''}`}>{saveState}</span>
            <button type="button" className="primary-button" onClick={handleManualSave} disabled={!activeDocument}>
              Save now
            </button>
          </div>
        </header>

        <section className="editor-panel">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </section>

        {canShare ? (
          <SharePanel
            users={users}
            currentUser={currentUser}
            activeDocument={activeDocument}
            shareEmail={shareEmail}
            setShareEmail={setShareEmail}
            onShare={handleShare}
            busy={shareBusy}
          />
        ) : (
          <section className="share-panel">
            <h3>Sharing</h3>
            <p className="muted">
              {activeDocument ? 'Only the owner can grant access.' : 'Open a document to inspect sharing.'}
            </p>
          </section>
        )}
      </main>
    </div>
  )
}

export default App

