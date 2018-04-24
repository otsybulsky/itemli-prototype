import _ from 'lodash'

import {
  reorderTagsList,
  reorderList,
  collapseTag,
  checkTagIds
} from '../helpers'
import {
  TABS_ADDED,
  TAGS_FETCH_ALL_OK,
  DROP_TAG,
  DROP_ARTICLE,
  DRAG_ELEMENT_START,
  DRAG_ELEMENT_END,
  FETCH_LAYOUT_OK,
  FETCH_ARTICLES_OK,
  SAVE_LAYOUT_OK,
  SAVE_ARTICLES_INDEX,
  UPDATED_ARTICLES_INDEX,
  TAG_COLLAPSE,
  TAG_EDIT,
  TAG_EDIT_CANCEL,
  TAG_EDIT_APPLY_OK
} from '../constants'

const INIT_STATE = {
  saveLayout: null,
  current_tag_id: null,
  tag_ids: [],
  tags: {},
  articles: null,
  save_articles_index: null,
  tag_edit_flag: null,
  tag_for_edit: null,
  articles_without_tag_count: null
}

export default function(store = INIT_STATE, { type, payload }) {
  switch (type) {
    case TAG_EDIT_APPLY_OK:
      return {
        ...store,
        tag_edit_flag: false,
        tag_for_edit: null
      }
    case TAG_EDIT_CANCEL:
      return {
        ...store,
        tag_edit_flag: false,
        tag_for_edit: null
      }
    case TAG_EDIT:
      return {
        ...store,
        tag_edit_flag: true,
        tag_for_edit: payload
      }
    case SAVE_LAYOUT_OK:
      return {
        ...store,
        saveLayout: false
      }
    case UPDATED_ARTICLES_INDEX:
      if (payload === store.current_tag_id) {
        return {
          ...store,
          articles: null
        }
      } else {
        return store
      }

    case FETCH_ARTICLES_OK:
      const { articles, tag_id } = payload
      return {
        ...store,
        articles: articles,
        current_tag_id: tag_id,
        saveLayout: store.current_tag_id === tag_id ? false : true
      }
    case TABS_ADDED:
      const tag = payload
      return {
        ...store,
        tag_ids: [{ id: tag.id, sub_tags: [] }, ...store.tag_ids],
        tags: { ...{ [tag.id]: tag }, ...store.tags },
        current_tag_id: tag.id,
        articles: null,
        saveLayout: true
      }

    case FETCH_LAYOUT_OK:
      const {
        layout: { tag_ids, current_tag_id },
        tags,
        articles_without_tag_count
      } = payload

      return {
        ...store,
        tag_ids: checkTagIds(tag_ids),
        tags: _.mapKeys(tags, 'id'),
        articles_without_tag_count: articles_without_tag_count,
        current_tag_id: current_tag_id,
        articles: null,
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
    case DROP_ARTICLE:
      const { article, source_index, target_index } = payload
      return {
        ...store,
        articles: reorderList([...store.articles], source_index, target_index),
        save_articles_index: true
      }
    case SAVE_ARTICLES_INDEX:
      return {
        ...store,
        save_articles_index: false
      }
    case TAG_COLLAPSE:
      return {
        ...store,
        tag_ids: collapseTag([...store.tag_ids], payload.tag_id),
        saveLayout: true
      }
    default:
      return store
  }
}
