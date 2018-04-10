import { DRAG_ELEMENT_START, DRAG_ELEMENT_END } from '../constants'

export function testEvent() {
  return dispatch => {
    console.log('actions - test event')
    dispatch({ type: 'TEST' })
  }
}

export function dragElementStart() {
  return { type: DRAG_ELEMENT_START }
}

export function dragElementEnd() {
  return { type: DRAG_ELEMENT_END }
}
