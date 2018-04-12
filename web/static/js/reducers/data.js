import { TABS_ADDED, TAGS_FETCH_ALL_OK } from '../constants'

const INIT_STATE = {
  saveLayout: null,
  tags: [],
  tab_items: []
}

export default function(store = INIT_STATE, { type, payload }) {
  switch (type) {
    case TABS_ADDED:
      return { ...store, tab_items: [...payload, ...store.tab_items] }
    case TAGS_FETCH_ALL_OK:
      return {
        ...store,
        tags: payload.tags,
        saveLayout: true
      }
    default:
      return store
  }
}
