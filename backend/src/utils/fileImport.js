const mammoth = require('mammoth');

async function parseUploadedFile(file) {
  const extension = file.originalname.split('.').pop()?.toLowerCase();

  if (extension === 'txt' || extension === 'md') {
    return file.buffer.toString('utf8');
  }

  if (extension === 'docx') {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  throw new Error('Unsupported file type. Use .txt, .md, or .docx');
}

function textToEditorJson(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line, index, array) => line.length > 0 || (index > 0 && array[index - 1].length > 0));

  const content = lines.length
    ? lines.map((line) => ({
        type: 'paragraph',
        content: line ? [{ type: 'text', text: line }] : [],
      }))
    : [{ type: 'paragraph' }];

  return { type: 'doc', content };
}

function textToHtml(text) {
  const paragraphs = text
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => `<p>${escapeHtml(line)}</p>`);

  return paragraphs.join('') || '<p></p>';
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

module.exports = { parseUploadedFile, textToEditorJson, textToHtml };

