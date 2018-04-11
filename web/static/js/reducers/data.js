import { TABS_ADDED, TAGS_FETCH_ALL_OK } from '../constants'

const INIT_STATE = {
  tags_three: {
    current_tag: null
  },
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
        tags_three: { current_tag: payload.tags[0] } //emulate change interface
      }
    default:
      return store
  }
}
