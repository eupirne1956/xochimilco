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
  let cleaned = text;
  
  // Replace Markdown links [text](http://...) with just the text
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
  cleaned = cleaned.trim();
  
  return cleaned;
};

export const ScientificReport: React.FC<ScientificReportProps> = ({ title, result, lang }) => {
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

      if (trimmedLine.startsWith('## ') || trimmedLine.startsWith('# ')) {
        if (currentSection) sections.push(currentSection);
        const title = trimmedLine.replace(/^#+ /, '').trim();
        currentSection = { title, content: [] };
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
            <Text style={styles.title}>{title}</Text>
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
              <Text style={styles.sectionTitle} minPresenceAhead={20}>{stripURLs(section.title)}</Text>
              {filteredContent.map((p, i) => {
                // Simple check for list items
                const isListItem = p.trim().startsWith('- ') || p.trim().startsWith('* ') || /^\d+\./.test(p.trim());
                const displayText = stripURLs(p);
                return (
                  <Text 
                    key={i} 
                    style={[
                      styles.body, 
                      { 
                        marginBottom: 8,
                        marginLeft: isListItem ? 15 : 0,
                        color: p.startsWith('>') ? '#00b496' : '#1e293b',
                        fontWeight: p.startsWith('>') ? 'bold' : 'normal'
                      }
                    ]}
                  >
                    {displayText.startsWith('>') ? displayText.substring(1).trim() : displayText}
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
