export const presets = {
  presets: [
    (await import('/node_modules/@twind/preset-autoprefix/preset-autoprefix.js')).default,
    (await import('/node_modules/@twind/preset-tailwind/preset-tailwind.js')).default,
    (await import('/node_modules/@twind/preset-tailwind-forms/preset-tailwind-forms.js')).default
  ]
}