import React, { Component } from 'react'
import { connect } from 'react-redux'
import hash from 'object-hash'
import { saveInterface } from '../socket'

class InterfaceProvider extends Component {
  componentWillReceiveProps(nextProps) {
    const { saveLayout, layout } = nextProps
    if (saveLayout) {
      const hash_new = hash(layout)
      if (hash(this.props.layout) !== hash_new) {
        this.props.saveInterface({
          interface: layout,
          hash: hash_new
        })
      }
    }
  }
  render() {
    return <div>{this.props.children}</div>
  }
}

function mapStateToProps(state) {
  return {
    saveLayout: state.data.saveLayout,
    layout: {
      tag_ids: state.data.tag_ids
    }
  }
}

export default connect(mapStateToProps, { saveInterface })(InterfaceProvider)
