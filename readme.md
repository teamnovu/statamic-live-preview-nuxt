# Statamic Live Preview for Nuxt

This package allows you to use a Nuxt website as Live Preview in Statamic.

## Installation

### Add package to your nuxt app

`yarn add @teamnovu/statamic-live-preview-nuxt`

If you are migrating from the previous statamic live preview provided by our fork, please also remove the old statamic live preview module:

`yarn remove statamic-live-preview-nuxt`

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

### Statamic 3.3 Fork using `window.postMessage()`

If you are using our Statamic 3.3 fork you can set the CMS to update the live preview without having it refresh the page after every change.
To do so set the config `post_message_data` in `config/statamic/live_preview.php` to `live-preview-update`.
This will tell the CMS to use `window.postMessage()` to notify this plugin to refresh the page.

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
