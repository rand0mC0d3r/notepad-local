import { css } from 'lit';

export const themeStyles = css`
  :host {
    --color-primary: #007acc;
    --color-background: #1e1e1e;
    --color-surface: #2d2d2d;
    --color-text: #ffffff;
    --color-text-secondary: #999999;
    --color-divider: #404040;
    --color-hover: rgba(255, 255, 255, 0.1);
    --color-active: rgba(0, 122, 204, 0.2);
    
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    
    --border-radius: 4px;
    --transition-speed: 0.2s;
  }
  
  :host(.light) {
    --color-background: #f5f5f5;
    --color-surface: #ffffff;
    --color-text: #1e1e1e;
    --color-text-secondary: #666666;
    --color-divider: #e0e0e0;
    --color-hover: rgba(0, 0, 0, 0.05);
    --color-active: rgba(0, 122, 204, 0.1);
  }
`;

export const baseStyles = css`
  * {
    box-sizing: border-box;
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    padding: var(--spacing-sm);
    border-radius: var(--border-radius);
    transition: background-color var(--transition-speed);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  button:hover {
    background-color: var(--color-hover);
  }
  
  button:active {
    background-color: var(--color-active);
  }
  
  input, textarea, select {
    background: var(--color-surface);
    border: 1px solid var(--color-divider);
    color: var(--color-text);
    padding: var(--spacing-sm);
    border-radius: var(--border-radius);
    font-family: inherit;
    font-size: inherit;
  }
  
  input:focus, textarea:focus, select:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 0;
  }
`;
