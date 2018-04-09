import { Socket } from 'phoenix'
import {
  TABS_ADDED,
  SOCKET_CONNECTED,
  SOCKET_ERROR,
  TAGS_FETCH_ALL
} from './constants'

let socket = null
let channel = null

export function fetchAllTags() {
  return dispatch => {
    if (channel) {
      dispatch({ type: TAGS_FETCH_ALL })
      channel
        .push('tags:fetch')
        .receive('ok', tags => {
          console.log(tags)
        })
        .receive('error', err => {
          dispatch({
            type: SOCKET_ERROR,
            payload: err
          })
        })
    }
  }
}

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
