import { LitElement, html }  from '/node_modules/lit/index.js';
import "./twind.js"

//import '/node_modules/lit-html/lit-html.js';

//import '/node_modules/lit-element/lit-element.js';


//import '/node_modules/lit/index.js';

import install1 from '/node_modules/@twind/with-web-components/with-web-components.js'

import presetAutoprefix from '/node_modules/@twind/preset-autoprefix/preset-autoprefix.js'
import presetTailwind from '/node_modules/@twind/preset-tailwind/preset-tailwind.js'
import presetTailwindForms from '/node_modules/@twind/preset-tailwind-forms/preset-tailwind-forms.js'


const withTwind = install1({presets: [presetAutoprefix(), presetTailwind(), presetTailwindForms()],})



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