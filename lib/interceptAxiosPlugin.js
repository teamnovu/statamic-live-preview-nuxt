let interval = null

const addIntercepter = (context) => {
  if (context.$axios) {
    clearInterval(interval)
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
  }
}

export default function (context) {
  // add interval because context.axios is otherwise undefided
  interval = setInterval(addIntercepter, 1, context)
}
