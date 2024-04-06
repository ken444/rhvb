import { LitElement, html } from '/node_modules/lit/index.js';
import { withTwind } from './twind_lit.js'

class MyElement extends withTwind(LitElement) {

    static get properties() {
        return {
            score: {},
        };
    }

    render() {
        return html`
            <div class="m-2 py-2 px-8 rounded-xl bg-blue-400 text-3xl text-right">${this.score}</div>
        `;
    }
}


customElements.define('my-pastscoreline', MyElement);

