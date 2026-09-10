import React from 'react';
import { ExternalLink } from 'lucide-react';

interface AIMarkdownRendererProps {
  content: string;
  onNavigate: (route: string) => void;
  className?: string;
}

/**
 * Parses bold, links, and code chips inside line text safely.
 */
export function renderInline(text: string, onNavigate: (route: string) => void): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Markdown link: [label](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    // Bold: **content**
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

    // Pick the earliest match
    let firstMatchIndex = -1;
    let matchType: 'link' | 'bold' | null = null;
    let matchLength = 0;
    let matchContent = '';
    let linkUrl = '';

    if (linkMatch && linkMatch.index !== undefined) {
      firstMatchIndex = linkMatch.index;
      matchType = 'link';
      matchLength = linkMatch[0].length;
      matchContent = linkMatch[1];
      linkUrl = linkMatch[2];
    }

    if (
      boldMatch &&
      boldMatch.index !== undefined &&
      (firstMatchIndex === -1 || boldMatch.index < firstMatchIndex)
    ) {
      firstMatchIndex = boldMatch.index;
      matchType = 'bold';
      matchLength = boldMatch[0].length;
      matchContent = boldMatch[1];
      linkUrl = '';
    }

    if (firstMatchIndex === -1 || matchType === null) {
      parts.push(remaining);
      break;
    }

    // Push text preceding the match
    if (firstMatchIndex > 0) {
      parts.push(remaining.substring(0, firstMatchIndex));
    }

    if (matchType === 'bold') {
      parts.push(
        <strong key={'b-' + keyIndex++} className="font-semibold text-slate-900 dark:text-stone-100">
          {matchContent}
        </strong>
      );
    } else if (matchType === 'link') {
      const isInternal = linkUrl.startsWith('#/') || linkUrl.startsWith('/');
      if (isInternal) {
        const route = linkUrl.replace(/^#\/?/, '').replace(/^\//, '');
        parts.push(
          <button
            key={'link-' + keyIndex++}
            onClick={() => onNavigate(route)}
            className="text-[#065F46] dark:text-emerald-400 font-bold underline hover:text-[#043E2F] cursor-pointer inline-flex items-center gap-0.5"
          >
            <span>{matchContent}</span>
          </button>
        );
      } else {
        parts.push(
          <a
            key={'link-' + keyIndex++}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#065F46] dark:text-emerald-400 font-bold underline hover:text-[#043E2F] inline-flex items-center gap-0.5"
          >
            <span>{matchContent}</span>
            <ExternalLink className="w-2.5 h-2.5 inline shrink-0" />
          </a>
        );
      }
    }

    remaining = remaining.substring(firstMatchIndex + matchLength);
  }

  return parts;
}

export const AIMarkdownRenderer: React.FC<AIMarkdownRendererProps> = ({
  content,
  onNavigate,
  className = '',
}) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length === 0) return;
    const header = tableRows[0];
    const body = tableRows.slice(1);

    elements.push(
      <div key={'table-' + elements.length} className="my-3 overflow-x-auto rounded-xl border border-stone-200 dark:border-[#1E3A33]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100 dark:bg-[#1A312B] text-stone-700 dark:text-stone-200 border-b border-stone-200 dark:border-[#1E3A33]">
              {header.map((col, idx) => (
                <th key={idx} className="p-2.5 font-bold font-editorial">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-[#1E3A33]">
            {body.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-stone-50/60 dark:hover:bg-[#162723]">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-2.5 text-stone-600 dark:text-stone-300">
                    {renderInline(cell.trim(), onNavigate)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    inTable = false;
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Table rows: starts and ends with '|'
    if (line.startsWith('|') && line.endsWith('|')) {
      // Skip separator rows like | :--- | :--- |
      if (/^\|[\s\-:]+\|/.test(line)) {
        continue;
      }
      inTable = true;
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (!line) {
      continue;
    }

    // Level 1 Heading
    if (line.startsWith('# ')) {
      elements.push(
        <h3
          key={i}
          className="text-base sm:text-lg font-black text-[#064E3B] dark:text-emerald-300 font-editorial mt-3 mb-2 border-b border-emerald-100 dark:border-emerald-950 pb-1.5"
        >
          {line.replace('# ', '')}
        </h3>
      );
      continue;
    }

    // Level 2 Heading
    if (line.startsWith('## ')) {
      elements.push(
        <h4
          key={i}
          className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-editorial mt-3.5 mb-1.5 flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0" />
          {line.replace('## ', '')}
        </h4>
      );
      continue;
    }

    // Level 3 Heading
    if (line.startsWith('### ')) {
      elements.push(
        <h5
          key={i}
          className="text-xs font-bold text-[#065F46] dark:text-emerald-400 mt-2.5 mb-1"
        >
          {line.replace('### ', '')}
        </h5>
      );
      continue;
    }

    // Step numbers: e.g. **01**
    if (/^\*\*0\d\*\*/.test(line)) {
      elements.push(
        <div key={i} className="mt-2.5 mb-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#064E3B] text-amber-200 text-[10px] font-black tracking-wider">
          STEP {line.replace(/\*/g, '')}
        </div>
      );
      continue;
    }

    // Bullet points: starts with '- ' or '• ' or '* '
    if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
      const itemText = line.replace(/^[-•*]\s+/, '');
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1 text-xs sm:text-[13px] leading-relaxed text-stone-700 dark:text-stone-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5 shrink-0" />
          <div>{renderInline(itemText, onNavigate)}</div>
        </div>
      );
      continue;
    }

    // Numbered list: starts with '1. ', '2. ', etc.
    if (/^\d+\.\s/.test(line)) {
      const numMatch = line.match(/^(\d+)\.\s/);
      const num = numMatch ? numMatch[1] : '1';
      const text = line.replace(/^\d+\.\s+/, '');
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1 text-xs sm:text-[13px] leading-relaxed text-stone-700 dark:text-stone-300">
          <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0 text-xs">{num}.</span>
          <div>{renderInline(text, onNavigate)}</div>
        </div>
      );
      continue;
    }

    // Standard paragraph
    elements.push(
      <p key={i} className="my-1.5 text-xs sm:text-[13px] leading-relaxed text-stone-700 dark:text-stone-300">
        {renderInline(line, onNavigate)}
      </p>
    );
  }

  if (inTable) {
    flushTable();
  }

  return <div className={`space-y-0.5 ${className}`}>{elements}</div>;
};
