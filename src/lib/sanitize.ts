/**
 * Utility to sanitize Mojibake characters common in Spanish encoding errors.
 */
export function sanitizeMojibake(text: string): string {
  if (!text) return text;
  
  const map: Record<string, string> = {
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã±': 'ñ',
    'Ã ': 'Á',
    'Ã‰': 'É',
    'Ã\u00cd': 'Í',
    'Ã“': 'Ó',
    'Ãš': 'Ú',
    'Ã‘': 'Ñ',
    'Â¿': '¿',
    'Â¡': '¡',
    'Ã¼': 'ü',
    'Ãœ': 'Ü',
    'Âº': 'º',
    'Âª': 'ª',
    'Ã¤': 'ä',
    'Ã¶': 'ö'
  };

  let sanitized = text;
  Object.entries(map).forEach(([mojibake, correct]) => {
    sanitized = sanitized.replace(new RegExp(mojibake, 'g'), correct);
  });

  return sanitized;
}
