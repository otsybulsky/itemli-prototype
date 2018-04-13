import React, { Component } from 'react'
import { connect } from 'react-redux'
import Tags from './tags'

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
        <Tags />
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
