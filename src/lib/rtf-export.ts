/**
 * Simple RTF Generator for scientific reports
 */

export function generateRTF(title: string, content: string): string {
  // Basic RTF header
  const header = '{\\\\rtf1\\\\ansi\\\\deff0 {\\\\fonttbl{\\\\f0 Arial;}{\\\\f1 Times New Roman;}}\\\\fs24 ';
  const footer = '}';

  // Helper to escape special characters and normalize Spanish tildes for RTF
  // RTF uses \'hh for hexadecimal chars
  const escapeRTF = (text: string) => {
    return text
      .replace(/á/g, "\\'e1")
      .replace(/é/g, "\\'e9")
      .replace(/í/g, "\\'ed")
      .replace(/ó/g, "\\'f3")
      .replace(/ú/g, "\\'fa")
      .replace(/ñ/g, "\\'f1")
      .replace(/Á/g, "\\'c1")
      .replace(/É/g, "\\'c9")
      .replace(/Í/g, "\\'cd")
      .replace(/Ó/g, "\\'d3")
      .replace(/Ú/g, "\\'da")
      .replace(/Ñ/g, "\\'d1")
      .replace(/\n/g, '\\\\par ');
  };

  const rtfTitle = `\\\\b\\\\fs32 ${escapeRTF(title)}\\\\b0\\\\fs24\\\\par\\\\par `;
  const rtfBody = escapeRTF(content);

  return header + rtfTitle + rtfBody + footer;
}

export function downloadFile(content: string, fileName: string, contentType: string) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}
