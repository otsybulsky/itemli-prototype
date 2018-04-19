import {
  DRAG_ELEMENT_START,
  DRAG_ELEMENT_END,
  DROP_TAG,
  DROP_ARTICLE,
  TAG_COLLAPSE
} from '../constants'

export function testEvent() {
  return dispatch => {
    console.log('actions - test event')
    dispatch({ type: 'TEST' })
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
