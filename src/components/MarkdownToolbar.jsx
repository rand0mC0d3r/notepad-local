import './MarkdownToolbar.css';

const MarkdownToolbar = ({ onFormat }) => {
  const tools = [
    { icon: 'B', title: 'Bold', format: (text) => `**${text}**` },
    { icon: 'I', title: 'Italic', format: (text) => `*${text}*` },
    { icon: 'H', title: 'Heading', format: (text) => `# ${text}` },
    { icon: '🔗', title: 'Link', format: (text) => `[${text}](url)` },
    { icon: '📷', title: 'Image', format: (text) => `![alt](${text})` },
    { icon: '•', title: 'List', format: (text) => `- ${text}` },
    { icon: '1.', title: 'Ordered List', format: (text) => `1. ${text}` },
    { icon: '```', title: 'Code Block', format: (text) => `\`\`\`\n${text}\n\`\`\`` },
    { icon: '`', title: 'Inline Code', format: (text) => `\`${text}\`` },
    { icon: '>', title: 'Quote', format: (text) => `> ${text}` },
  ];

  return (
    <div className="markdown-toolbar">
      {tools.map((tool, index) => (
        <button
          key={index}
          className="toolbar-btn"
          onClick={() => onFormat(tool.format)}
          title={tool.title}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
};

export default MarkdownToolbar;
