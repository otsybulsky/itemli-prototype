import { Socket } from 'phoenix'
import {
  TABS_ADDED,
  SOCKET_CONNECTED,
  SOCKET_ERROR,
  TAGS_FETCH_ALL,
  TAGS_FETCH_ALL_OK
} from './constants'

let socket = null
let channel = null

function socketError(err) {
  return { type: SOCKET_ERROR, payload: { error: err } }
}

export function saveInterface(params) {
  return dispatch => {
    if (channel) {
      channel.push('interface:save', params)
    }
  }
}

export function fetchAllTags() {
  return dispatch => {
    if (channel) {
      dispatch({ type: TAGS_FETCH_ALL })
      channel
        .push('tags:fetch')
        .receive('ok', tags => {
          dispatch({ type: TAGS_FETCH_ALL_OK, payload: tags })
        })
        .receive('error', err => {
          dispatch(socketError(err))
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
        dispatch(socketError(err))
      })

    channel.onError(err => {
      dispatch(socketError(err))
    })

    channel.on('tabs:added', msg =>
      dispatch({ type: TABS_ADDED, payload: [msg.content] })
    )
  }
}
