module.exports = ({ app, query, $axios, $graphql }) => {
  console.log('LivePreview Token:', query.token)
  
  // axios interceptor
  if ($axios) {
    $axios.onRequest(config => {
      if (query.token) {
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

  // set graphql
  if ($graphql) {
    app.router.afterEach((to, from) => {
      if (to.query.token) {
        Object.keys($graphql).forEach(key => {
          $graphql[key].url = `${$graphql[key].url}?token=${to.query.token}`
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
