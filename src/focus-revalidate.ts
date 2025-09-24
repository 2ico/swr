import { SWRGlobalState } from './_internal/utils/global-state'
import * as revalidateEvents from './_internal/events'
import { cache as defaultCache } from './_internal/utils/config'

import type { Cache, GlobalState } from './_internal/types'

/**
 * Triggers focus revalidation for all SWR hooks using the same internal
 * mechanism as SWR's built-in revalidateOnFocus, ensuring proper deduplication
 * with ongoing requests.
 */
export const triggerFocusRevalidation = (cache: Cache = defaultCache) => {
  if (!SWRGlobalState.has(cache)) {
    return
  }

  const [EVENT_REVALIDATORS] = SWRGlobalState.get(cache) as GlobalState

  // Trigger revalidation for all registered keys using the same mechanism
  // as SWR's internal focus handling
  for (const key in EVENT_REVALIDATORS) {
    if (EVENT_REVALIDATORS[key][0]) {
      EVENT_REVALIDATORS[key][0](revalidateEvents.FOCUS_EVENT)
    }
  }
}

/**
 * Triggers focus revalidation for a specific key, ensuring proper deduplication
 * with ongoing requests.
 */
export const triggerKeyFocusRevalidation = (
  key: string,
  cache: Cache = defaultCache
) => {
  if (!SWRGlobalState.has(cache)) {
    return
  }

  const [EVENT_REVALIDATORS] = SWRGlobalState.get(cache) as GlobalState

  // Trigger revalidation for the specific key
  if (EVENT_REVALIDATORS[key] && EVENT_REVALIDATORS[key][0]) {
    EVENT_REVALIDATORS[key][0](revalidateEvents.FOCUS_EVENT)
  }
}
