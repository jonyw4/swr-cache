const path = require('path')
const { build } = require('esbuild')

const defaultBuildConfig = {
  entryPoints: ['./src/index.ts'],
  bundle: true,
  loader: { '.ts': 'ts' },
  define: {},
  minify: true,
}

const buildConfigForCommonJs = {
  ...defaultBuildConfig,
  outfile: path.resolve(__dirname, 'dist/cjs/index.js'),
  platform: 'neutral',
  target: 'es2020',
  format: 'cjs',
}

const buildConfigForEsm = {
  ...defaultBuildConfig,
  outfile: path.resolve(__dirname, 'dist/esm/index.js'),
  platform: 'browser',
  target: 'esnext',
  format: 'esm',
}

const buildConfigs = [
  buildConfigForCommonJs,
  buildConfigForEsm,
]

buildConfigs.forEach((config) => {
  build(config)
    .then(async () => {
      console.log(`⚡ Bundling client for ${config.format} format is done`)
    })
    .catch(() => process.exit(1))
})
