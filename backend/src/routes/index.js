const express = require('express');
const multer = require('multer');
const {
  createDocument,
  getDocument,
  importDocument,
  listDocuments,
  listUsers,
  shareDocument,
  updateDocument,
} = require('./documentController');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/health', (_req, res) => res.json({ ok: true }));
router.get('/users', listUsers);
router.get('/documents', listDocuments);
router.post('/documents', createDocument);
router.post('/documents/import', upload.single('file'), importDocument);
router.get('/documents/:id', getDocument);
router.put('/documents/:id', updateDocument);
router.post('/documents/:id/share', shareDocument);

module.exports = router;

