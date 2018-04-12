import _ from 'lodash'
import hash from 'object-hash'

import { reorderList } from '../helpers'
import {
  TABS_ADDED,
  TAGS_FETCH_ALL_OK,
  DROP_TAG,
  DRAG_ELEMENT_START,
  DRAG_ELEMENT_END
} from '../constants'

const INIT_STATE = {
  saveLayout: null,
  hash_layout_source: null,
  tag_ids: [],
  tags: {},
  tab_items: []
}

export default function(store = INIT_STATE, { type, payload }) {
  switch (type) {
    case TABS_ADDED:
      return { ...store, tab_items: [...payload, ...store.tab_items] }
    case TAGS_FETCH_ALL_OK:
      return {
        ...store,
        tag_ids: payload.tag_ids,
        tags: _.mapKeys(payload.tags, 'id')
      }
    case DRAG_ELEMENT_START:
      return {
        ...store,
        saveLayout: false,
        hash_layout_source: hash({ tag_ids: store.tag_ids })
      }
    case DRAG_ELEMENT_END:
      return { ...store, saveLayout: true }
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
