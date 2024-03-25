//import * as x from 'https://cdn.jsdelivr.net/npm/@twind/core@1.1.3/core.global.min.js'
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


x.twind.install({
  /* config */
  presets: [presetAutoprefix(), presetTailwind(), presetTailwindForms()],
})


