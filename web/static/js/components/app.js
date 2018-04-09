import React, { Component } from 'react'
import { connect } from 'react-redux'
import uuidv1 from 'uuid/v1'

import { createSocket, fetchAllTags } from '../socket'

class App extends Component {
  componentDidMount() {
    this.props.createSocket()
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.socketConnected) {
      if (nextProps.socketConnected) {
        this.props.fetchAllTags()
      }
    }
  }

  renderTabs() {
    if (!this.props.socketConnected) {
      return <div />
    }
    return this.props.tabs.map(tab => {
      return <li key={uuidv1()}>{tab.title}</li>
    })
  }

  render() {
    return (
      <div>
        <h4>Hello from React !</h4>
        <ul>{this.renderTabs()}</ul>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    tabs: state.tabs.tab_items,
    socketConnected: state.channel.socketConnected
  }
}

export default connect(mapStateToProps, { createSocket, fetchAllTags })(App)
