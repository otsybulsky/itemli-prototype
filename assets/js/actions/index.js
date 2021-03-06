import {
  DRAG_ELEMENT_START,
  DRAG_ELEMENT_END,
  DROP_TAG,
  DROP_ARTICLE,
  TAG_COLLAPSE,
  TAG_EDIT,
  TAG_EDIT_CANCEL,
  ARTICLE_EDIT,
  ARTICLE_EDIT_CANCEL,
  ARTICLE_EDIT_ADD_TAG,
  ARTICLE_EDIT_REMOVE_TAG,
  TAGS_LIST_SHOW
} from '../constants'

export function testEvent() {
  return dispatch => {
    console.log('actions - test event')
    dispatch({ type: 'TEST' })
  }
}

export function showTagsList() {
  return {
    type: TAGS_LIST_SHOW
  }
}

export function editArticle(params) {
  return {
    type: ARTICLE_EDIT,
    payload: params
  }
}
export function articleEditAddTag(tag_id) {
  return {
    type: ARTICLE_EDIT_ADD_TAG,
    payload: tag_id
  }
}
export function articleEditRemoveTag(tag_id) {
  return {
    type: ARTICLE_EDIT_REMOVE_TAG,
    payload: tag_id
  }
}
export function editArticleCancel(params) {
  return {
    type: ARTICLE_EDIT_CANCEL,
    payload: params
  }
}

export function editTag(params) {
  return {
    type: TAG_EDIT,
    payload: params
  }
}
export function editTagCancel(params) {
  return {
    type: TAG_EDIT_CANCEL,
    payload: params
  }
}

export function collapseTag(params) {
  return {
    type: TAG_COLLAPSE,
    payload: params
  }
}

export function dragElementStart() {
  return { type: DRAG_ELEMENT_START }
}

export function dragElementEnd() {
  return { type: DRAG_ELEMENT_END }
}

export function dropTag(params) {
  return {
    type: DROP_TAG,
    payload: params
  }
}

export function dropArticle(params) {
  return {
    type: DROP_ARTICLE,
    payload: params
  }
}
