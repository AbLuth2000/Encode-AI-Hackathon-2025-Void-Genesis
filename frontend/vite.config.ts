import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import copy from 'rollup-plugin-copy'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    copy({
      targets: [
        {
          src: 'src/assets/glb_models/*',
          dest: 'public/assets/glb_models'
        }
      ],
      hook: 'buildStart'
    }),
    react()],

})
