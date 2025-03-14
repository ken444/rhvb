import { LitElement, html } from '/node_modules/lit/index.js';
import { withTwind } from './twind_lit.js'
import "./pastScoreLine.js"

 class MyElement extends withTwind(LitElement) {

    static get properties() {
        return {
            scores: {},
        };
    }

    constructor() {
        super();
        this.scores = ['red', 'green', 'blue'];
      }

    render() {
        return html`
        <div class="grid grid-flow-col auto-cols-fr">
            ${this.scores.map(v => html`<my-pastscoreline score="${v}"></my-pastscoreline>`)}
        </div>
    `;
    }
}


customElements.define('my-pastscoreitem', MyElement);

