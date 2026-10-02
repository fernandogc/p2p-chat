import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wyw from '@wyw-in-js/vite'

const reactOptions = {
  babel: {
    plugins: [['babel-plugin-react-compiler', {}]]
  }
}

export default defineConfig({
  plugins: [
    react(reactOptions),
    wyw()
  ]
})
