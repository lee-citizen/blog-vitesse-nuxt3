import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['load-btn', 'h-34px leading-36px p-y-0 p-x-36px c-#909090 bg-[var(--color-bg-primary)] z-9 tracking-2px rounded-4px border-solid border-1px border-color-[var(--color-border-1)]'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
    ['f-c-c', 'flex justify-center items-center'],
    ['f-b-c', 'flex justify-between items-center'],
    ['no-data', 'absolute top-4/10 left-5/10 text-20px tracking-4px -translate-5/10 font-bold c-red'],
  ],
  rules: [
    // [/^c-([a-zA-Z\d]+)$/, ([, d]) => ({ color: `#${d}` })],
    // [/^clr-bg-(.*)$/, ([, d]) => ({ background: `var(--color-${d})` })],
    // [/^clr-border-(.*)$/, ([, d]) => ({ borderColor: `var(--color-${d})` })],
    // [/^clr-text-(.*)$/, ([, d]) => ({ color: `var(--color-${d})` })],
    // [/^-c-(.*)$/, ([, c]) => {
    //   return { color: 'red' }
    // }],
  ],
  theme: {
    breakpoints: {
      sm: '480px',
      // => @media (min-width: 480px) { ... }

      md: '680px',
      // => @media (min-width: 780px) { ... }

      lg: '900px',
      // => @media (min-width: 900px) { ... }

      xl: '1200px',
      // => @media (min-width: 1200px) { ... }
      xxl: '1470',
    },
  },

  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),

  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
