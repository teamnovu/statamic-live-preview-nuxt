# Statamic Live Preview for Nuxt

This package allows you to use a Nuxt website as Live Preview in Statamic.

## Installation

### Add package to your nuxt app

`yarn add @teamnovu/statamic-live-preview-nuxt`

### Add plugin to your nuxt config

Create a file called 'live-preview.js' in the plugins folder.

Add the following lines to `plugins/live-preview.js':

```javascript
import livePreview from '@teamnovu/statamic-live-preview-nuxt'

export default livePreview
```

Add the plugin to your nuxt.config.js file.

```javascript
plugins: [
    // ...
    '~/plugins/live-preview.js'
]
```

### Transpilation

Depending on your Node-version you may need to add the package to be transpiled by nuxt.

```javascript
build: {
    transpile: [
        // ...
        '@teamnovu/statamic-live-preview-nuxt'
    ]
}
```
