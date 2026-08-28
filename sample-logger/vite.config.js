import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages deployment note:
// Using a relative base ('./') makes the built asset paths work no matter what
// the repository name is (e.g. https://<user>.github.io/<repo>/). This is the
// most portable option and requires zero edits after cloning.
//
// If you prefer absolute paths, replace the line below with:
//   base: '/<your-repo-name>/',
export default defineConfig({
  base: './',
  plugins: [react()],
})
