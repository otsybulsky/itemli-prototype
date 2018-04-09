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

  renderTags() {
    if (!this.props.socketConnected) {
      return <div />
    }
    return this.props.tags.map(tag => {
      return (
        <li className="tag" key={tag.id}>
          {tag.title}
        </li>
      )
    })
  }

  render() {
    return (
      <div>
        <h4>Hello from React !</h4>
        <ul>{this.renderTags()}</ul>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    tabs: state.data.tab_items,
    tags: state.data.tags,
    socketConnected: state.channel.socketConnected
  }
}

export default connect(mapStateToProps, { createSocket, fetchAllTags })(App)
