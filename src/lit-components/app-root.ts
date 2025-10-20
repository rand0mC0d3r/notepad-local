import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/preact-signals';
import { isSidebarOpen } from '../store/notes';
import { themeMode } from '../store/theme';
import { themeStyles } from '../styles/theme';
import './app-header';
import './app-sidebar';
import './note-editor';

@customElement('app-root')
export class AppRoot extends SignalWatcher(LitElement) {
  static styles = [
    themeStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: var(--color-background);
        color: var(--color-text);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      .app-body {
        display: flex;
        flex: 1;
        overflow: hidden;
      }
      
      app-sidebar {
        transition: transform 0.3s ease;
      }
      
      note-editor {
        flex: 1;
        overflow: hidden;
      }
    `
  ];

  connectedCallback() {
    super.connectedCallback();
    // Apply theme class to host
    this.updateThemeClass();
  }

  updated() {
    this.updateThemeClass();
  }

  private updateThemeClass() {
    const mode = themeMode.value;
    this.classList.remove('light', 'dark');
    this.classList.add(mode);
  }

  render() {
    // Reference theme signal to trigger updates on theme change
    const _mode = themeMode.value;
    const sidebarOpen = isSidebarOpen.value;

    return html`
      <app-header></app-header>
      <div class="app-body">
        <app-sidebar class=${sidebarOpen ? '' : 'closed'}></app-sidebar>
        <note-editor></note-editor>
      </div>
    `;
  }
}
