import React, { Component } from 'react'
import { connect } from 'react-redux'
import uuidv1 from 'uuid/v1'

import { createSocket } from '../socket'

class App extends Component {
  componentDidMount() {
    this.props.createSocket()
  }

  renderTabs() {
    if (!this.props.tabs) {
      return <div />
    }
    return this.props.tabs.map(tab => {
      return <li key={uuidv1()}>{tab.title}</li>
    })
  }

  render() {
    console.log(this.props)
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
    tabs: state.tabs.tab_items
  }
}

export default connect(mapStateToProps, { createSocket })(App)
