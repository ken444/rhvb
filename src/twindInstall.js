import { install } from '@twind/core'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'
import presetTailwindForms from '@twind/preset-tailwind-forms'

// You must call install at least once, but can call it multiple times
install({
  /* config */
  presets: [presetAutoprefix(), presetTailwind(), presetTailwindForms()],
})

// npm install @twind/core @twind/preset-autoprefix @twind/preset-tailwind @twind/preset-tailwind-forms
// npm install esbuild
// node_modules/.bin/esbuild.cmd src/twindInstall.js --bundle --outfile=src/twind1.js