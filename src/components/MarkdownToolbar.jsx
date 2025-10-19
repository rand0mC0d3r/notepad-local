import { Box, IconButton } from '@mui/material';
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
    <Box
      className="markdown-toolbar"
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {tools.map((tool) => (
        <IconButton
          key={tool.title}
          onClick={() => onFormat(tool.format)}
          title={tool.title}
          size="small"
          sx={{ minWidth: 36, height: 32 }}
        >
          {tool.icon}
        </IconButton>
      ))}
    </Box>
  );
};

export default MarkdownToolbar;
