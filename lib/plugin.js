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
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
  })
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

  const ancestorIdentifier = getParentIdentifierRecursively(
    element.parentElement
  )

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

  const matchingTarget = targets.find(
    (target) => elementIdentifier === target.identifier
  )

  if (matchingTarget) {
    return matchingTarget
  }

  if (!elementIdentifier.includes('.')) {
    return null
  }

  return findMatchingTargetRecursively(
    targets,
    elementIdentifier.split('.').slice(0, -1).join('.')
  )
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
    const ancestorIdentifier = getParentIdentifierRecursively(
      target.parentElement
    )

    // the target might be nested within another target
    // when that is the case, we need to concatenate the ancestor identifier with the element identifier
    if (ancestorIdentifier) {
      identifier = `${ancestorIdentifier}.${identifier}`
    }

    return {
      identifier,
      element: target,
    }
  })


  // filter out the ones that don't match the given identifier
  const matchingTarget = findMatchingTargetRecursively(
    targets,
    elementIdentifier
  )

  return matchingTarget?.element
}

export default defineNuxtPlugin((app) => {
  const config = useRuntimeConfig()
  const graphqlEndpoint = config.public.GQL_HOST
  const { query } = app.$router.currentRoute.value

  if (!graphqlEndpoint) {
    return log(
      'Warning: GraphQL endpoint is not configured! Make sure GQL_HOST is published in your runtime config.'
    )
  }

  // Refresh Nuxt data
  if (process.client && query.token) {
    log('Enabling preview mode...')

    // Add query parameters to the preconfigured host
    useGqlHost(`${graphqlEndpoint}?token=${query.token}`)

    // Add live preview update event handler
    window.onmessage = async ({ data }) => {

      if (!(typeof data === 'object')) return

      if (data.name === 'statamic.preview.updated') {
        if (data.token && data.token !== query.token) {
          log('Using new token:', data.token)
          query.token = data.token
        }

        log('Refreshing page...')
        await refreshNuxtData()
      } else if (data.focusedElement) {

        const element = getElement(data.focusedElement)

        if (!element) return

        scrollTo(element)
      }
    }
  }
  Directive(app)
})

/**
 * Register Vue directive
 * This will be used to set the element's data attribute
 */
export const Directive = (app) => {
    app.vueApp.directive(targetIdentifier, {
        beforeMount(el, { value }) {
        el.setAttribute(`data-${targetIdentifier}`, value)
        },
    })
}
