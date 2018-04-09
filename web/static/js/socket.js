import { Socket } from 'phoenix'
import { TABS_ADDED } from './constants'

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
        console.log('Joined successfully', resp)
      })
      .receive('error', resp => {
        console.log('Unable to join', resp)
      })
    channel.on('tabs:added', msg =>
      dispatch({ type: TABS_ADDED, payload: [msg.content] })
    )
  }
}
