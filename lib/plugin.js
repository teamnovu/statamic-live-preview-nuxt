module.exports = ({ app, query, $axios, $graphql }) => {
  // axios interceptor
  if ($axios) {
    $axios.onRequest(config => {
      if (query.preview) {
        if (config.params) {
          config.params.preview = query.preview
        } else {
          config.params = {
            preview: query.preview
          }
        }
      }
      return config
    })
  }

  // set graphql
  if ($graphql) {
    app.router.afterEach((to, from) => {
      if (to.query.preview) {
        Object.keys($graphql).forEach(key => {
          $graphql[key].url = `${$graphql[key].url}?preview=${to.query.preview}`
        })
      }
    })
  }

  // live update event handler
  if (process.client) {
    window.onmessage = function (e) {
      if (e.data === 'liveUpdate') {
        window.$nuxt.refresh()
      }
    }
  }
}
