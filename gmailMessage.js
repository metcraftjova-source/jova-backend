// Builds the base64url "raw" RFC 2822 message the Gmail REST API expects.
// Supports an optional attachment (the customer's drawing) and non-ASCII text.

const CRLF = '\r\n';
const b64 = (data) => Buffer.from(data).toString('base64');
const wrap76 = (s) => (s.match(/.{1,76}/g) || ['']).join(CRLF);
const oneLine = (s) => String(s || '').replace(/[\r\n]+/g, ' ').trim();
const encodeHeader = (s) => (/^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${b64(s)}?=`);

const MIME = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  dwg: 'application/acad',
  dxf: 'application/dxf',
};

export const buildRawMessage = ({ from, to, replyTo, subject, html, attachment }) => {
  const boundary = `jova_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;

  const lines = [
    `From: ${oneLine(from)}`,
    `To: ${oneLine(to)}`,
    replyTo ? `Reply-To: ${oneLine(replyTo)}` : null,
    `Subject: ${encodeHeader(oneLine(subject))}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrap76(b64(html)),
  ].filter((l) => l !== null);

  if (attachment?.buffer?.length) {
    const safeName = oneLine(attachment.filename).replace(/[^\w.\- ]/g, '_') || 'drawing';
    const ext = safeName.split('.').pop().toLowerCase();
    lines.push(
      `--${boundary}`,
      `Content-Type: ${MIME[ext] || 'application/octet-stream'}; name="${safeName}"`,
      `Content-Disposition: attachment; filename="${safeName}"`,
      'Content-Transfer-Encoding: base64',
      '',
      wrap76(b64(attachment.buffer))
    );
  }
  lines.push(`--${boundary}--`, '');

  return Buffer.from(lines.join(CRLF))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};