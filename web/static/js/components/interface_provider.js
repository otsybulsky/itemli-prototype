import React, { Component } from 'react'
import { connect } from 'react-redux'

class InterfaceProvider extends Component {
  render() {
    console.log('INTERFACE PROVIDER', this.props)
    return <div>{this.props.children}</div>
  }
}

function mapStateToProps(state) {
  return {
    tags: state.data.tags_three
  }
}

export default connect(mapStateToProps)(InterfaceProvider)
