module.exports = (context) => {
    // axios interceptor
    context.$axios.onRequest(config => {
        if (context.query.preview) {
          if (config.params) {
            config.params.preview = context.query.preview
          } else {
            config.params = {
              preview: context.query.preview
            }
          }
        }
        return config
    })

    // live update event handler
    if (process.client) {
        window.onmessage = function(e){
            if (e.data === 'liveUpdate') {
                window.$nuxt.refresh()
            }
        }
   }
}
