import { Socket } from 'phoenix'
import { TABS_ADDED, SOCKET_CONNECTED, SOCKET_ERROR } from './constants'

let socket = null
let channel = null

export function createSocket() {
  return dispatch => {
    socket = new Socket('/socket', { params: { token: window.userToken } })
    socket.connect()

    channel = socket.channel(`room:${window.channelId}`, {})

    channel
      .join()
      .receive('ok', resp => {
        dispatch({ type: SOCKET_CONNECTED })
      })
      .receive('error', err => {
        dispatch({
          type: SOCKET_ERROR,
          payload: err
        })
      })

    channel.onError(err => {
      dispatch({
        type: SOCKET_ERROR,
        payload: err
      })
    })

    channel.on('tabs:added', msg =>
      dispatch({ type: TABS_ADDED, payload: [msg.content] })
    )
  }
}
