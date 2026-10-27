import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.wildernesstracevetclinic.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  },
  compressHTML: false
});
