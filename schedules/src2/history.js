import { LitElement, html }  from '/node_modules/lit/index.js';
import { withTwind } from './twind_lit.js'

class MyElement extends withTwind(LitElement) {

  // Implement `render` to define a template for your element.
  render(){
    /**
     * Return a lit-html `TemplateResult`.
     *
     * To create a `TemplateResult`, tag a JavaScript template literal
     * with the `html` helper function.
     */
    return html`
      <div>
        <p class="text-3xl font-bold underline">A parag32raph</p>
      </div>
    `;
  }
}


customElements.define('my-history', MyElement);

