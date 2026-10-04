import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import wyw from '@wyw-in-js/vite'


export default defineConfig({
  plugins: [
    wyw(),
    react(),
    babel({
      presets: [reactCompilerPreset()]
    })
  ]
})
