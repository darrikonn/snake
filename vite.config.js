import react from '@vitejs/plugin-react'
import path from 'path'
import {defineConfig, loadEnv} from 'vite'

export default defineConfig(({mode}) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react()],
    resolve: {
      alias: {
        snake: path.resolve(__dirname, 'src'),
      },
    },
  }
})
