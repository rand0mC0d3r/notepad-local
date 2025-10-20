import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { themeStyles, baseStyles } from '../styles/theme';

export type FormatFunction = (text: string) => string;

interface Tool {
  icon: string;
  title: string;
  format: FormatFunction;
}

@customElement('markdown-toolbar')
export class MarkdownToolbar extends LitElement {
  @property({ type: Object }) onFormat?: (formatFn: FormatFunction) => void;

  static styles = [
    themeStyles,
    baseStyles,
    css`
      :host {
        display: flex;
        gap: var(--spacing-xs);
        padding: var(--spacing-sm);
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-divider);
        overflow-x: auto;
      }
      
      button {
        min-width: 36px;
        height: 32px;
        font-size: 0.9rem;
        font-weight: 600;
      }
    `
  ];

  private tools: Tool[] = [
    { icon: 'B', title: 'Bold', format: (text) => `**${text}**` },
    { icon: 'I', title: 'Italic', format: (text) => `*${text}*` },
    { icon: 'H', title: 'Heading', format: (text) => `# ${text}` },
    { icon: '---', title: 'Separator', format: () => `---` },
    { icon: '🔗', title: 'Link', format: (text) => `[${text}](url)` },
    { icon: '📷', title: 'Image', format: (text) => `![alt](${text})` },
    { icon: '•', title: 'List', format: (text) => `- ${text}` },
    { icon: '1.', title: 'Ordered List', format: (text) => `1. ${text}` },
    { icon: '```', title: 'Code Block', format: (text) => `\`\`\`\n${text}\n\`\`\`` },
    { icon: '`', title: 'Inline Code', format: (text) => `\`${text}\`` },
    { icon: '>', title: 'Quote', format: (text) => `> ${text}` },
  ];

  render() {
    return html`
      ${this.tools.map(tool => html`
        <button
          @click=${() => this.onFormat?.(tool.format)}
          title=${tool.title}
        >
          ${tool.icon}
        </button>
      `)}
    `;
  }
}
