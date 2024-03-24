import { install, defineConfig } from '/node_modules/@twind/core/core.js'
import install1 from '/node_modules/@twind/with-web-components/with-web-components.js'
//import config from '/node_modules/@twind/core/core.js'
//You must call install at least once, but can call it multiple times
// install({
//   presets: [
//     (await import('/node_modules/@twind/preset-autoprefix/preset-autoprefix.js')).default,
//     (await import('/node_modules/@twind/preset-tailwind/preset-tailwind.js')).default,
//     (await import('/node_modules/@twind/preset-tailwind-forms/preset-tailwind-forms.js')).default
//   ]
// })

import presetAutoprefix from '/node_modules/@twind/preset-autoprefix/preset-autoprefix.js'
import presetTailwind from '/node_modules/@twind/preset-tailwind/preset-tailwind.js'
import presetTailwindForms from '/node_modules/@twind/preset-tailwind-forms/preset-tailwind-forms.js'


install({
  /* config */
  presets: [presetAutoprefix(), presetTailwind(), presetTailwindForms()],
})

var withTwind1 = install1({presets: [presetAutoprefix(), presetTailwind(), presetTailwindForms()],})
