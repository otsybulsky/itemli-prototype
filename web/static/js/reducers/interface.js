import { DRAG_ELEMENT_START, DRAG_ELEMENT_END } from '../constants'

const INIT_STATE = {
  renderDropInterface: null
}

export default function(store = INIT_STATE, { type, payload }) {
  switch (type) {
    case DRAG_ELEMENT_START:
      return { ...store, renderDropInterface: true }
    case DRAG_ELEMENT_END:
      return { ...store, renderDropInterface: false }
    default:
      return store
  }
}
