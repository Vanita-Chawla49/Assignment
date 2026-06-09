const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    contentJson: { type: Object, required: true },
    contentHtml: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    attachments: [
      {
        originalName: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    lastOpenedAt: { type: Date },
  },
  { timestamps: true }
);

documentSchema.index({ title: 'text', contentHtml: 'text' });

module.exports = mongoose.model('Document', documentSchema);

