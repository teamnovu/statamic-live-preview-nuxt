/**
 * The identifier that will be used to 
 * set the element's data attribute via the Vue directive
 */
const targetIdentifier = 'editor-target'

function log(...message) {
  console.log(
    '%cLive Preview',
    'color: white; background-color: #ff269e; padding: 2px 4px; border-radius: 2px;',
    ...message
  )
}

/**
 * Scroll to the given element in the DOM
 */
function scrollTo(element) {
  element.scrollIntoView({ 
    behavior: "smooth", 
    block: "center", 
    inline: "nearest" 
  });
}


/**
 * Look for the closest ancestor with the target identifier
 * of the given element
 */
function getParentIdentifierRecursively(element) {
  if (!element) return null

  const attrValue = element.getAttribute(`data-${targetIdentifier}`)

  if (!attrValue) {
    return getParentIdentifierRecursively(element.parentElement)
  }

  const ancestorIdentifier = getParentIdentifierRecursively(element.parentElement)

  if (!ancestorIdentifier) {
    return attrValue
  }

  return `${ancestorIdentifier}.${attrValue}`
}

/**
 * Find the closest ancestor that matches the given identifier
 */
function findMatchingTargetRecursively(targets, elementIdentifier) {
  if (targets.length === 0) return null

  const matchingTarget = targets.find((target) => elementIdentifier === target.identifier)
  
  if (matchingTarget) {
    return matchingTarget
  }

  if (!elementIdentifier.includes('.')) {
    return null
  }

  return findMatchingTargetRecursively(targets, elementIdentifier.split('.').slice(0, -1).join('.'))
}

/**
 * Get the element that matches the given identifier
 * Ultimately, this will be the element that we want to scroll to
 */
function getElement(elementIdentifier) {
  // get all nodes with the target identifier
  let targets = [...document.querySelectorAll(`[data-${targetIdentifier}]`)]

  targets = targets.map((target) => {
    let identifier = target.getAttribute(`data-${targetIdentifier}`)
    const ancestorIdentifier = getParentIdentifierRecursively(target.parentElement)
    
    // the target might be nested within another target
    // when that is the case, we need to concatenate the ancestor identifier with the element identifier
    if (ancestorIdentifier) {
      identifier = `${ancestorIdentifier}.${identifier}`
    }

    return {
      identifier,
      element: target
    }
  })

  // filter out the ones that don't match the given identifier
  const matchingTarget = findMatchingTargetRecursively(targets, elementIdentifier)

  return matchingTarget?.element
}

/**
 * Listen for iframe post messages and handle them
 */
export default ({ app, query, $axios, $graphql, enablePreview, ...context }) => {
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
          },
        },
      })
    })
  }

  // Add Axios interceptor
  if ($axios) {
    $axios.onRequest((config) => {
      if (!query.token) {
        return config
      }

      config.params = {
        ...(config.params || {}),
        ...{
          token: query.token,
        },
      }
    })
  }

  // Update GraphQL endpoints
  if ($graphql) {
    app.router.afterEach((to, from) => {
      if (!to.query.token) {
        return
      }

      Object.keys($graphql).forEach((key) => {
        $graphql[key].url = `${$graphql[key].url}?token=${to.query.token}`
      })
    })
  }

  if (process.client && query.token) {
    log('Enabling preview mode...')

    // Enable preview mode for static sites
    enablePreview?.()

    // Add live preview update event handler
    window.onmessage = ({ data }) => {
      if (data.focusedElement) {
        const element = getElement(data.focusedElement)

        if (!element) return

        scrollTo(element)
  
      } else if (data === 'live-preview-update') {
        log('Refreshing page...')
        window.$nuxt?.refresh()
      }
    }
  }
}

/**
 * Register Vue directive
 * This will be used to set the element's data attribute
 */
export const Directive = {
    install(Vue) {
      Vue.directive(targetIdentifier, {
        bind: (el, { value }) => {
          // Set the element's data attribute
          el.setAttribute(`data-${targetIdentifier}`, value);
        },
      });
    }
}
