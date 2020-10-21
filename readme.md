# Statamic Live Preview for Nuxt

This package allows you to display a nuxt.js website as Live Preview in Statamic

## Installation

### Add package to your nuxt app

`yarn add https://github.com/teamnovu/statamic-live-preview-nuxt.git`

### Add Plugin to your nuxt config

Create a file called 'live-preview.js' in the plugins folder.

Add following lines in `live-preview.js'
```
import livePreview from 'statamic-live-preview-nuxt'

export default livePreview
```

Add the plugin to your nuxt.config.js file

```
plugins: [
    ...
    '~/plugins/live-preview.js'
]
```