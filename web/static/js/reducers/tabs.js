import { TABS_ADDED } from '../constants'

const INIT_STATE = {
  tab_items: []
}

export default function(store = INIT_STATE, { type, payload }) {
  switch (type) {
    case TABS_ADDED:
      return { ...store, tab_items: [...payload, ...store.tab_items] }
    default:
      return store
  }
}
