module.exports = ({ app, query, $axios, $graphql, enablePreview }) => {
  // Add Axios interceptor
  if ($axios) {
    $axios.onRequest(config => {
      if (query.preview && query.token) {
        if (config.params) {
          config.params.token = query.token
        } else {
          config.params = {
            token: query.token
          }
        }
      }

      return config
    })
  }

  // Update GraphQL endpoints
  if ($graphql) {
    app.router.afterEach((to, from) => {
      if (to.query.preview && to.query.token) {
        Object.keys($graphql).forEach(key => {
          $graphql[key].url = `${$graphql[key].url}?token=${to.query.token}`
        })
      }
    })
  }

  // Enable preview mode for static sites
  if (process.client && query.preview) {
    enablePreview?.()
  }
}
