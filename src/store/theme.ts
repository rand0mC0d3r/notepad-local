import { signal, effect } from '@preact/signals-core';

export type ThemeMode = 'light' | 'dark';

// Signal for theme mode
export const themeMode = signal<ThemeMode>('dark');

// Initialize from localStorage
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('notepad-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    themeMode.value = savedTheme;
  }
};

// Save to localStorage on changes
effect(() => {
  localStorage.setItem('notepad-theme', themeMode.value);
  // Apply theme class to document
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(themeMode.value);
});

// Actions
export const toggleTheme = (): void => {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light';
};

// Initialize on module load
initializeTheme();
