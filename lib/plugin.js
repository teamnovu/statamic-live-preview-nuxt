module.exports = ({ app, query, $axios, $graphql, enablePreview }) => {
  // Add token to new route query when changing route
  if (query.token) {
    app.router.beforeEach((to, from, next) => {
      if (!from?.query?.token) {
        // No token in from-query
        return next()
      }

      if (to.query?.token) {
        // Already a token in to-query
        return next()
      }

      return next({
        ...to,
        query: {
          ...(to.query || {}),
          ...{
            token: from.query.token,

            // live-preview is used to prevent caching: https://github.com/statamic/cms/blob/33a9cd1b4f71c435cfd703f17f497f8eef582d8e/src/Http/Controllers/CP/PreviewController.php#L48
            'live-preview': from.query['live-preview'],
          }
        },
      })
    })
  }

  // Add Axios interceptor
  if ($axios) {
    $axios.onRequest(config => {
      if (!query.token) {
        return config
      }

      config.params = {
        ...(config.params || {}),
        ...{
          token: query.token,
        }
      }
    })
  }

  // Update GraphQL endpoints
  if ($graphql) {
    app.router.afterEach((to, from) => {
      if (!to.query.token) {
        return
      }

      Object.keys($graphql).forEach(key => {
        $graphql[key].url = `${$graphql[key].url}?token=${to.query.token}`
      })
    })
  }

  // Enable preview mode for static sites
  if (process.client && query.token) {
    enablePreview?.()
  }
}
