import { Socket } from 'phoenix'
import {
  TABS_ADDED,
  SOCKET_CONNECTED,
  SOCKET_ERROR,
  TAGS_FETCH_ALL,
  TAGS_FETCH_ALL_OK,
  SAVE_LAYOUT,
  FETCH_LAYOUT,
  FETCH_LAYOUT_OK,
  FETCH_ARTICLES,
  FETCH_ARTICLES_OK
} from './constants'

let socket = null
let channel = null

function socketError(err) {
  return { type: SOCKET_ERROR, payload: { error: err } }
}

export function saveLayoutToServer(params) {
  return dispatch => {
    if (channel) {
      dispatch({ type: SAVE_LAYOUT, payload: params })
      channel
        .push('layout:save', params)
        .receive('ok', message => {})
        .receive('error', err => {
          dispatch(socketError(err))
        })
    }
  }
}

export function fetchLayout() {
  return dispatch => {
    if (channel) {
      dispatch({ type: FETCH_LAYOUT })
      channel.push('layout:fetch').receive('ok', response => {
        dispatch({ type: FETCH_LAYOUT_OK, payload: response })
      })
    }
  }
}

export function fetchArticles(params) {
  return dispatch => {
    if (channel) {
      dispatch({ type: FETCH_ARTICLES, payload: params })
      channel.push('articles:fetch', params).receive('ok', response => {
        dispatch({ type: FETCH_ARTICLES_OK, payload: response })
      })
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
      dispatch({ type: TABS_ADDED, payload: msg.content })
    )

    channel.on('layout:updated', () => {
      console.log('LY updated')
      dispatch(fetchLayout())
    })
  }
}
