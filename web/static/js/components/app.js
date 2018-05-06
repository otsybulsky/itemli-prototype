import React, { Component } from 'react'
import { connect } from 'react-redux'
import TagsProvider from './tags_provider'

import { createSocket, fetchLayout } from '../socket'

class App extends Component {
  componentDidMount() {
    this.props.createSocket()
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.socketConnected) {
      if (nextProps.socketConnected) {
        this.props.fetchLayout()
      }
    }
  }

  render() {
    return (
      <div>
        <TagsProvider />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    socketConnected: state.channel.socketConnected
  }
}

export default connect(mapStateToProps, { createSocket, fetchLayout })(App)
