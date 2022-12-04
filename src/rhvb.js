import { html } from 'https://unpkg.com/lit?module';
import { component, useState } from 'https://unpkg.com/haunted/haunted.js';

function Counter() {
  const [count, setCount] = useState(0);

  return html`
    <div part="count">${count}</div>
    <button part="button" @click=${() => setCount(count + 1)}>
      Increment
    </button>
  `;
}

customElements.define('my-counter', component(Counter));