import _ from 'lodash'

import { reorderTagsList } from '../helpers'
import {
  TABS_ADDED,
  TAGS_FETCH_ALL_OK,
  DROP_TAG,
  DRAG_ELEMENT_START,
  DRAG_ELEMENT_END,
  FETCH_LAYOUT_OK,
  FETCH_ARTICLES_OK
} from '../constants'

const INIT_STATE = {
  saveLayout: null,
  tag_ids: [],
  tags: {},
  articles: []
}

export default function(store = INIT_STATE, { type, payload }) {
  switch (type) {
    case FETCH_ARTICLES_OK:
      return {
        ...store,
        articles: payload.articles
      }
    case TABS_ADDED:
      return {
        ...store,
        tag_ids: [{ id: payload.id, sub_tags: [] }, ...store.tag_ids],
        tags: { ...{ [payload.id]: payload }, ...store.tags },
        saveLayout: true
      }

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
      return { ...store, saveLayout: true }
    case DROP_TAG:
      const { source_id, target_id, createSubTag } = payload
      return {
        ...store,
        tag_ids: reorderTagsList(
          [...store.tag_ids],
          source_id,
          target_id,
          createSubTag
        )
      }

    default:
      return store
  }
}
