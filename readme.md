# Statamic Live Preview for Nuxt

This package allows you to use a Nuxt website as Live Preview in Statamic

## Requirements
This package is designed to be used in conjunction with GraphQL, utilizing the [nuxt-graphql-client](https://nuxt-graphql-client.web.app/getting-started/quick-start) package.

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

### Statamic 3.4.8 or higher

To use the live preview without refreshing the page after every change, disable "Refresh" on the preview targets of your collection.

### Statamic 3.3 Fork using `window.postMessage()`

If you are using our Statamic 3.3 fork you can set the CMS to update the live preview without having it refresh the page after every change.
To do so set the config `post_message_data` in `config/statamic/live_preview.php` to `live-preview-update`.
This will tell the CMS to use `window.postMessage()` to notify this plugin to refresh the page.

### ScrollTo Element Behavior (Optional)

For better user experience you can add scroll to element behavior when the user focuses an input element. However **not all** editable fields are supported.

To enable this behavior set the `scrollToElement` in the nuxt-config runtime config to true as follows:

```javascript
export default {
  runtimeConfig: {
    statamicLivePreview: {
      scrollToElement: true
    }
  }
}
```

Define the Vue Directive `v-editor-target` to enable ScrollTo Element behavior.

```html
<h2 v-editor-target="'title'">This is a headline</h2>
```

Nested Example:

```html
<!-- pages/_.vue -->

<ComponentsLoader
  :components="page.replicator_product_components"
  v-editor-target="'replicator_product_components'"
/>
```

All values used with `v-editor-target` must match the corresponding field `handle` of the CMS.
Then within your ComponentsLoader.vue:

```html
<!-- components/ComponentsLoader.vue -->

<Component
  ...
  v-editor-target="index"
/>
```

If you nest `v-editor-target` their values will be concatenated. For Example: `replicator_product_components.0.title`.

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
