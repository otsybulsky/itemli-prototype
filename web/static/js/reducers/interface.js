import {
  DRAG_ELEMENT_START,
  DRAG_ELEMENT_END,
  ARTICLE_EDIT,
  ARTICLE_EDIT_ADD_TAG,
  ARTICLE_EDIT_REMOVE_TAG
} from '../constants'

const INIT_STATE = {
  renderDropInterface: null,
  article_edit_tag_ids: []
}

export default function(store = INIT_STATE, { type, payload }) {
  switch (type) {
    case ARTICLE_EDIT:
      const { tags } = payload
      return {
        ...store,
        article_edit_tag_ids: tags ? tags.map(item => item.id) : []
      }
    case ARTICLE_EDIT_ADD_TAG:
      return {
        ...store,
        article_edit_tag_ids: [...store.article_edit_tag_ids, payload]
      }
    case DRAG_ELEMENT_START:
      return { ...store, renderDropInterface: true }
    case DRAG_ELEMENT_END:
      return { ...store, renderDropInterface: false }
    default:
      return store
  }
}
