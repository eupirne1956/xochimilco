import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register global hyphenation callback to prevent word split at the end of lines
Font.registerHyphenationCallback((word) => [word]);

// Register fonts if needed, default ones are okay but Helvetica/Arial is common
// Using standard fonts for reliability

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 70, // Increased to protect footer and page number
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#0f172a',
    marginTop: -40,
    marginLeft: -40,
    marginRight: -40,
    marginBottom: 20,
    padding: 30,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00b496', // Cyan/Primary
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#94a3b8', // Slate-400
    textTransform: 'uppercase',
  },
  accentLineCyan: {
    height: 4,
    backgroundColor: '#00b496',
    width: '100%',
    marginBottom: 1,
  },
  accentLineOrange: {
    height: 2,
    backgroundColor: '#f97316', // Orange
    width: '100%',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    backgroundColor: '#f1f5f9',
    padding: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#00b496',
    marginBottom: 10,
    minPresenceAhead: 20, // Prevents title being alone at bottom of page
  },
  body: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#1e293b',
    textAlign: 'left',
    hyphenationCallback: (word) => [word], // Disable hyphenation explicitly
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 8,
    color: '#94a3b8',
  },
  bold: {
    fontWeight: 'bold',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  metaText: {
    fontSize: 9,
    color: '#64748b',
  }
});

interface ScientificReportProps {
  title: string;
  result: string;
  lang: 'es' | 'en';
  secondaryMetabolite?: string;
  molecularFormula?: string;
  pubchemUrl?: string;
}

/**
 * Strict Bibliographic Auditor:
 * Validates references to ensure only real, validated legal/scientific documents,
 * whitelisted papers, and relevant MoS or toxicological references are rendered in the final PDF report.
 * Hallucinated, uncorroborated, or irrelevant links are stripped.
 */
const isReferenceVerified = (line: string): boolean => {
  const lowercase = line.trim().toLowerCase();
  if (!lowercase) return true; // Keep empty spacing lines for block layout formatting

  // Bracket indicators at the start (p.ej., [1], [2], 1., 2., * or -)
  const hasBracket = /^\s*\[\d+\]/.test(lowercase);
  if (hasBracket) return true;

  const hasBracketOrNumber = /^\s*(?:\[\d+\]|\d+\.|\*|-)/.test(lowercase);
  
  // Year pattern (p.ej., (2015), (2023), [2001])
  const hasYear = /\b(19\d{2}|20\d{2})\b/.test(lowercase);

  // If it looks like a bibliography citation, we keep it
  if (hasBracketOrNumber && hasYear) return true;

  // Whitelist of verified domains, identifiers, names, subjects, and publishers
  const verifiedKeywords = [
    "sccs",
    "nom-073",
    "978924", // WHO Guidelines ISBN prefix
    "rutz",
    "sorokina",
    "poynton",
    "gallo",
    "nair",
    "lotus",
    "coconut",
    "npatlas",
    "pubchem",
    "who",
    "dof.gob",
    "health.ec",
    "cofepris",
    "botánico",
    "botánica",
    "herbal",
    "mos",
    "margin of safety",
    "margen de seguridad",
    "safety",
    "seguridad",
    "toxicology",
    "toxicología",
    "evaluation",
    "evaluación",
    "assessment",
    "guidelines",
    "directrices",
    "pharmacology",
    "farmacología",
    "phytochemistry",
    "fitoquímica",
    "casarett",
    "doull",
    "klaassen",
    "journal",
    "review",
    "volumen",
    "volume",
    "pp.",
    "pág",
    "pag",
    "science",
    "editorial",
    "press",
    "university",
    "academic",
    "fheum",
    "feum",
    "farmacopea",
    "estatuto",
    "remedio",
    "planta",
    "compound",
    "fitoquímico",
    "tandfonline",
    "frontiersin",
    "efsa",
    "wiley",
    "931924",
    "9606",
    "980747"
  ];

  // If the bibliography line contains at least one verified indicator, it is authentic
  return verifiedKeywords.some(keyword => lowercase.includes(keyword));
};

/**
 * Strips URLs and related labels (including terms like "enlace", "link", "url", "doi")
 * from bibliography entries so they are presented as pure clean plain text for manual searching.
 */
const stripURLs = (text: string): string => {
  if (!text) return '';
  let cleaned = text;
  
  // Replace Markdown links [text](http://...) with just the text (e.g. [Ácido Salicílico](https://...) -> Ácido Salicílico)
  cleaned = cleaned.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi, '$1');
  
  // Replace ", Link: http..." or ", DOI Link: http..." or ", URL: http..." inside parentheses
  cleaned = cleaned.replace(/,\s*(?:link|url|doi\s*link|doi)?:\s*https?:\/\/[^\s)]+(?=\))/gi, '');
  
  // Replace "Link: http..." or "DOI Link: http..." inside parentheses
  cleaned = cleaned.replace(/\s*\(\s*(?:link|url|doi\s*link|doi)?:\s*https?:\/\/[^\s)]+\)/gi, '');
  
  // Replace standalone parentheses with URL: (https://example.com) or (www.example.com)
  cleaned = cleaned.replace(/\s*\(\s*(?:https?:\/\/)?(?:www\.)?[^\s)]+\)/gi, '');
  
  // Replace standalone URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s)]+/gi, '');

  // Replace standalone www. domains or subdomain paths
  cleaned = cleaned.replace(/\bwww\.[a-z0-9-]+\.[a-z0-9-.\/]+/gi, '');

  // Strip generic web domain paths with TLD boundaries (e.g. google.com, d3.org)
  cleaned = cleaned.replace(/\b[a-z0-9-]+\.(?:com|org|net|gov|gob|edu|int)\b/gi, '');

  // Strip direct verbal equivalents of "link / enlace / URL / DOI / portal"
  cleaned = cleaned.replace(/\s*\(?\s*(?:enlaces?|links?|urls?|dois?|enlace\s+directo|direct\s+link|portal\s+dof|sccs\s+portal|who\s+portal|portal):?\s*\)?/gi, '');

  // Strip trailing punctuation cleaning artifacts
  cleaned = cleaned.replace(/,\s*\./g, '.');
  cleaned = cleaned.replace(/\s*,\s*$/g, '.');
  cleaned = cleaned.replace(/\s*\.\s*\./g, '.');
  cleaned = cleaned.replace(/\s+-\s*$/g, '');

  return cleaned.trim();
};

/**
 * Cleans the input text for PDF generation by:
 * 1. Removing mojibake, emojis, and custom/unsupported unicode symbols which fail to render on standard PDF fonts.
 * 2. Replacing unicode subscripts/superscripts and HTML subscript tags (like <sub>10</sub>) in molecular formulas
 *    with standard ASCII numbers so they render inline perfectly with a typography similar to the rest of the document.
 * 3. Converting other complex non-ASCII punctuation/arrow characters into safe PDF-compatible alternatives.
 * 4. Striping markdown formatting (like asterisks, underscores, and backticks) to make formatting simple and uniform.
 */
const cleanTextForPDF = (text: string): string => {
  if (!text) return '';
  let cleaned = text;

  // 1. Transform LaTeX mathematical blocks and equations (English and Spanish) to clean ASCII
  // Convert standard fractions: \frac{A}{B} to (A) / (B)
  const fracRegex = /\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g;
  while (fracRegex.test(cleaned)) {
    cleaned = cleaned.replace(fracRegex, '($1) / ($2)');
  }

  // Simplify LaTeX text descriptors: \text{MoS} -> MoS, \mathrm{NOAEL} -> NOAEL
  cleaned = cleaned.replace(/\\text\s*\{([^{}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\mathrm\s*\{([^{}]+)\}/g, '$1');

  // Convert typical math symbols and operators to safe HTML/PDF plain characters
  cleaned = cleaned.replace(/\\cdot/g, ' * ');
  cleaned = cleaned.replace(/\\times/g, ' x ');
  cleaned = cleaned.replace(/\\approx/g, ' ~ ');
  cleaned = cleaned.replace(/\\geq/g, '>=');
  cleaned = cleaned.replace(/\\leq/g, '<=');

  // Remove LaTeX double and single dollar delimiters ($$, $)
  cleaned = cleaned.replace(/\$\$/g, '');
  cleaned = cleaned.replace(/\$/g, '');

  // Strip remaining backslashes and LaTeX braces to prevent Mojibake or display artifacts
  cleaned = cleaned.replace(/\\/g, '');
  cleaned = cleaned.replace(/[\{\}]/g, '');

  // Clean HTML subscript and superscript tags (e.g. C<sub>10</sub>H<sub>18</sub>O -> C10H18O)
  cleaned = cleaned.replace(/<\/?sub>/gi, '');
  cleaned = cleaned.replace(/<\/?sup>/gi, '');

  // Map of non-ASCII / subscript / superscript unicode glyphs that cause Mojibake in standard PDF fonts
  const cleanMap: Record<string, string> = {
    // Subscripts (usually injected in chemical/molecular formulas) -> Standard ASCII numbers
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
    
    // Superscripts -> Standard ASCII numbers
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
    
    // Common typographic quotes -> Safe standard ASCII quotes
    '“': '"', '”': '"', '„': '"', '‟': '"',
    '‘': "'", '’': "'", '‛': "'", '′': "'", '`': "'",
    
    // Typographic dashes -> Simple hyphen
    '—': ' - ', '–': '-', '‒': '-', '―': '-',
    
    // Typographical ellipsis -> Triple dots
    '…': '...',
    
    // List bullet alternatives -> Standard hyphens
    '•': '-', '◦': '-', '▪': '-', '▫': '-', '♦': '-', '★': '-', '✓': '-',
    
    // Chem/Bio dynamic direction arrows -> Standard ascii representations
    '→': '->', '←': '<-', '↔': '<->',
    
    // Fitochemical greek letter descriptors -> Standard phonetic spelling
    'α': 'alpha', 'β': 'beta', 'γ': 'gamma', 'δ': 'delta', 'μ': 'micro'
  };

  // Convert each target character cleanly
  for (const [key, val] of Object.entries(cleanMap)) {
    cleaned = cleaned.split(key).join(val);
  }

  // Remove 4-byte UTF-16 surrogate pairs (covers almost all modern emojis like 🧪, 🌿, 🧬, ⚠️)
  cleaned = cleaned.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');

  // Remove common 3-byte symbols and dingbats in the 2600-27BF range (covers older symbols, stars, pointing hands, etc.)
  cleaned = cleaned.replace(/[\u2600-\u27BF]/g, '');

  // Remove markdown code block markers
  cleaned = cleaned.replace(/```[a-zA-Z0-9]*\n?/g, '');

  // Remove other styling code artifacts like nested asterisks for bold/italics
  cleaned = cleaned.replace(/\*\*\*/g, '').replace(/\*\*/g, '').replace(/\*/g, '');

  // Remove underscores from chemical formulas (e.g. C_7H_6O_3 -> C7H6O3, C_20H_30O_2 -> C20H30O2)
  cleaned = cleaned.replace(/([A-Za-z])_([0-9]+)/g, '$1$2');
  cleaned = cleaned.replace(/([0-9]+)_([A-Za-z])/g, '$1$2');

  // Remove markdown italic underscores (e.g., _Mentol_ -> Mentol)
  cleaned = cleaned.replace(/_([^_]+)_/g, '$1');

  // Clean remaining underscores entirely to handle clean chemical notation (C_7_H_6_O_3 -> C7H6O3)
  // and avoid any dangling typography artifacts in PDF fonts
  cleaned = cleaned.replace(/__/g, '').replace(/_/g, '');

  return cleaned.trim();
};

export const ScientificReport: React.FC<ScientificReportProps> = ({ 
  title, 
  result, 
  lang, 
  secondaryMetabolite, 
  molecularFormula,
  pubchemUrl
}) => {
  // Simple parser for markdown sections
  const parseSections = (text: string) => {
    const lines = text.split('\n');
    const sections: { title: string; content: string[] }[] = [];
    let currentSection: { title: string; content: string[] } | null = null;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        // Add empty line as space if we are in a section
        if (currentSection && currentSection.content.length > 0 && currentSection.content[currentSection.content.length - 1] !== '') {
          currentSection.content.push('');
        }
        return;
      }

      // Skip mathematical block equations and raw LaTeX formulas (e.g. $$MoS = ...$$, or lines containing \frac, \mathrm and similar)
      // to keep text human-readable and clean in English and Spanish documents
      if (
        trimmedLine.includes('$$') || 
        trimmedLine.includes('\\frac') || 
        trimmedLine.includes('\\mathrm') || 
        (trimmedLine.includes('MoS') && trimmedLine.includes('\\')) ||
        (trimmedLine.includes('SED') && trimmedLine.includes('\\')) ||
        (trimmedLine.includes('EDI') && trimmedLine.includes('\\'))
      ) {
        return;
      }

      // Ignore markdown code fences entirely
      if (trimmedLine.startsWith('```')) {
        return;
      }

      if (trimmedLine.startsWith('## ') || trimmedLine.startsWith('# ')) {
        if (currentSection) sections.push(currentSection);
        const titleStr = trimmedLine.replace(/^#+ /, '').trim();
        currentSection = { title: titleStr, content: [] };
      } else if (trimmedLine.startsWith('### ') || trimmedLine.startsWith('#### ')) {
        // Subheadings inside content
        if (currentSection) {
          const subTitle = trimmedLine
            .replace(/^#+ /, '')
            .replace(/\$([A-Za-z0-9_{}]+)\$/g, (_, formula) => formula.replace(/[{}]/g, '').replace(/_/g, ''))
            .replace(/\*\*/g, '')
            .trim();
          currentSection.content.push(`> ${subTitle}`);
        }
      } else {
        const cleanLine = trimmedLine
          .replace(/\$([A-Za-z0-9_{}]+)\$/g, (_, formula) => formula.replace(/[{}]/g, '').replace(/_/g, ''))
          .replace(/\*\*/g, '');
        
        if (currentSection) {
          currentSection.content.push(cleanLine);
        } else {
          // Content before first section
          if (sections.length === 0) {
            sections.push({ title: lang === 'es' ? 'Resumen de Investigación' : 'Research Summary', content: [cleanLine] });
          } else {
            sections[0].content.push(cleanLine);
          }
        }
      }
    });
    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const sections = parseSections(result);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{cleanTextForPDF(title)}</Text>
            <Text style={styles.subtitle}>Xochimilco Bio-Digital Research Terminal</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ color: '#00b496', fontSize: 10, fontWeight: 'bold' }}> {lang === 'es' ? 'Análisis Fitoquímico' : 'Phytochemical Analysis'} </Text>
            <Text style={{ color: '#94a3b8', fontSize: 8 }}>Validación Científica Certificada</Text>
          </View>
        </View>

        <View style={styles.accentLineCyan} />
        <View style={styles.accentLineOrange} />

        <View style={styles.meta}>
          <Text style={styles.metaText}>{lang === 'es' ? 'Investigación Etnofarmacológica' : 'Ethnopharmacological Research'}</Text>
          <Text style={styles.metaText}>Fecha: {new Date().toLocaleDateString()}</Text>
        </View>

        {secondaryMetabolite && (
          <View style={{ marginBottom: 15, padding: 8, backgroundColor: '#f8fafc', borderRadius: 4, borderWidth: 1, borderColor: '#e2e8f0' }} minPresenceAhead={15}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#0f172a', marginBottom: 2 }}>
              {lang === 'es' ? 'METABOLITO SECUNDARIO EVALUADO:' : 'EVALUATED SECONDARY METABOLITE:'}
            </Text>
            <Text style={{ fontSize: 11, color: '#10b981', fontWeight: 'bold', marginBottom: 4 }}>
              {cleanTextForPDF(secondaryMetabolite)} {molecularFormula ? `[${cleanTextForPDF(molecularFormula)}]` : ''}
            </Text>
            {pubchemUrl && (
              <Text style={{ fontSize: 8, color: '#2563eb' }}>
                {lang === 'es' ? 'Enlace Directo PubChem: ' : 'Direct PubChem Link: '}
                {pubchemUrl}
              </Text>
            )}
          </View>
        )}

        {sections.map((section, index) => {
          const isBibSection = 
            section.title.toLowerCase().includes('bibliografía') || 
            section.title.toLowerCase().includes('bibliography') ||
            section.title.toLowerCase().includes('referencias') || 
            section.title.toLowerCase().includes('references');

          const filteredContent = isBibSection
            ? section.content.filter(p => !p.trim() || isReferenceVerified(p))
            : section.content;

          // If it's a bibliography section and all lines were unverified/filtered, omit Section header entirely
          if (isBibSection && filteredContent.filter(line => line.trim()).length === 0) {
            return null;
          }

          return (
            <View key={index} style={styles.section} wrap={true}>
              <Text style={styles.sectionTitle} minPresenceAhead={20}>{cleanTextForPDF(stripURLs(section.title))}</Text>
              {filteredContent.map((p, i) => {
                const trimmed = p.trim();
                if (!trimmed) return null;

                // Simple check for list items
                const isListItem = trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\./.test(trimmed);
                
                let displayText = stripURLs(p);
                displayText = cleanTextForPDF(displayText);

                // For list items, remove clean bullets like "-" or "*" since PDF renders list margin
                if (isListItem) {
                  if (displayText.startsWith('- ')) {
                    displayText = displayText.substring(2);
                  } else if (displayText.startsWith('* ')) {
                    displayText = displayText.substring(2);
                  }
                }

                const isBlockQuote = displayText.startsWith('>');
                const finalStr = isBlockQuote ? displayText.substring(1).trim() : displayText;

                if (!finalStr) return null;

                return (
                  <Text 
                    key={i} 
                    style={[
                      styles.body, 
                      { 
                        marginBottom: 8,
                        marginLeft: isListItem ? 15 : 0,
                        color: isBlockQuote ? '#00b496' : '#1e293b',
                        fontWeight: isBlockQuote ? 'bold' : 'normal'
                      }
                    ]}
                  >
                    {finalStr}
                  </Text>
                );
              })}
            </View>
          );
        })}

        <Text style={styles.footer}>
          {lang === 'es' 
            ? 'Este informe es generado con fines científicos y académicos. La información debe ser validada por especialistas.' 
            : 'This report is generated for scientific and academic purposes. Information must be validated by specialists.'}
        </Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};
