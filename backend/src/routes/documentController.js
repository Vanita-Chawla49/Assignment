const Document = require('../models/Document');
const User = require('../models/User');
const { parseUploadedFile, textToEditorJson, textToHtml } = require('../utils/fileImport');

const EMPTY_DOC = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

async function listUsers(_req, res) {
  const users = await User.find().sort({ name: 1 });
  res.json(users);
}

async function listDocuments(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  const [owned, shared] = await Promise.all([
    Document.find({ owner: userId })
      .populate('owner collaborators', 'name email')
      .sort({ updatedAt: -1 }),
    Document.find({ collaborators: userId, owner: { $ne: userId } })
      .populate('owner collaborators', 'name email')
      .sort({ updatedAt: -1 }),
  ]);

  return res.json({ owned, shared });
}

async function createDocument(req, res) {
  const { title, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  const document = await Document.create({
    title: title?.trim() || 'Untitled document',
    owner: userId,
    contentJson: EMPTY_DOC,
    contentHtml: '<p></p>',
  });

  const populated = await document.populate('owner collaborators', 'name email');
  return res.status(201).json(populated);
}

async function getDocument(req, res) {
  const { userId } = req.query;
  const document = await Document.findById(req.params.id).populate('owner collaborators', 'name email');

  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }

  if (!canAccess(document, userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  document.lastOpenedAt = new Date();
  await document.save();

  return res.json(document);
}

async function updateDocument(req, res) {
  const { userId } = req.query;
  const { title, contentJson, contentHtml } = req.body;
  const document = await Document.findById(req.params.id).populate('owner collaborators', 'name email');

  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }

  if (!canAccess(document, userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  if (typeof title === 'string' && title.trim()) {
    document.title = title.trim();
  }

  if (contentJson) {
    document.contentJson = contentJson;
  }

  if (typeof contentHtml === 'string') {
    document.contentHtml = contentHtml;
  }

  await document.save();

  return res.json(document);
}

async function shareDocument(req, res) {
  const { userId } = req.query;
  const { collaboratorEmail } = req.body;
  const document = await Document.findById(req.params.id).populate('owner collaborators', 'name email');

  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }

  if (String(document.owner._id) !== userId) {
    return res.status(403).json({ message: 'Only the owner can share this document' });
  }

  const collaborator = await User.findOne({ email: collaboratorEmail?.toLowerCase().trim() });

  if (!collaborator) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (String(collaborator._id) === String(document.owner._id)) {
    return res.status(400).json({ message: 'Owner already has access' });
  }

  if (!document.collaborators.some((entry) => String(entry._id || entry) === String(collaborator._id))) {
    document.collaborators.push(collaborator._id);
    await document.save();
    await document.populate('owner collaborators', 'name email');
  }

  return res.json(document);
}

async function importDocument(req, res) {
  const { userId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'A file is required' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  const importedText = await parseUploadedFile(req.file);
  const titleBase = req.body.title?.trim() || req.file.originalname.replace(/\.[^.]+$/, '');

  const document = await Document.create({
    title: titleBase || 'Imported document',
    owner: userId,
    contentJson: textToEditorJson(importedText),
    contentHtml: textToHtml(importedText),
    attachments: [
      {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype || 'application/octet-stream',
        size: req.file.size,
      },
    ],
  });

  const populated = await document.populate('owner collaborators', 'name email');
  return res.status(201).json(populated);
}

function canAccess(document, userId) {
  return (
    String(document.owner._id || document.owner) === String(userId) ||
    document.collaborators.some((entry) => String(entry._id || entry) === String(userId))
  );
}

module.exports = {
  createDocument,
  getDocument,
  importDocument,
  listDocuments,
  listUsers,
  shareDocument,
  updateDocument,
};

