import _ from 'lodash'

import { reorderList } from '../helpers'
import {
  TABS_ADDED,
  TAGS_FETCH_ALL_OK,
  DROP_TAG,
  DRAG_ELEMENT_START,
  DRAG_ELEMENT_END,
  FETCH_LAYOUT_OK
} from '../constants'

const INIT_STATE = {
  saveLayout: null,
  tag_ids: [],
  tags: {},
  tab_items: []
}

export default function(store = INIT_STATE, { type, payload }) {
  switch (type) {
    case TABS_ADDED:
      return { ...store, tab_items: [...payload, ...store.tab_items] }
    case FETCH_LAYOUT_OK:
      return {
        ...store,
        tag_ids: payload.layout.tag_ids,
        tags: _.mapKeys(payload.tags, 'id'),
        saveLayout: false
      }
    case DRAG_ELEMENT_START:
      return {
        ...store,
        saveLayout: false
      }
    case DRAG_ELEMENT_END:
      return { ...store, saveLayout: false } //temporary
    case DROP_TAG:
      const { start_index, end_index } = payload
      return {
        ...store,
        tag_ids: reorderList([...store.tag_ids], start_index, end_index)
      }

    default:
      return store
  }
}
