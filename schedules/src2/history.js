import {LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

//import '/node_modules/lit-html/lit-html.js';

//import '/node_modules/lit-element/lit-element.js';


//import '/node_modules/lit/index.js';



class MyElement extends LitElement {

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
        <p class="text-3xl font-bold underline">A parag3raph</p>
      </div>
    `;
  }
}
customElements.define('my-history', MyElement);