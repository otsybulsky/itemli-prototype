import { SOCKET_CONNECTED, SOCKET_ERROR } from '../constants'

const INIT_STATE = {
  socketConnected: null,
  lastError: null
}

export default function(store = INIT_STATE, { type, payload }) {
  switch (type) {
    case SOCKET_CONNECTED:
      return { ...store, socketConnected: true }
    case SOCKET_ERROR:
      return { ...store, socketConnected: false, lastError: payload.error }
    default:
      return store
  }
}
