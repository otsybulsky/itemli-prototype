import React, { Component } from 'react'
import { connect } from 'react-redux'
import hash from 'object-hash'
import { saveInterface } from '../socket'

class InterfaceProvider extends Component {
  componentWillReceiveProps(nextProps) {
    const { saveLayout, layout, hash_layout_source } = nextProps

    if (!this.props.saveLayout && saveLayout) {
      const hash_new = hash(layout)
      if (hash_new !== hash_layout_source) {
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
    },
    hash_layout_source: state.data.hash_layout_source
  }
}

export default connect(mapStateToProps, { saveInterface })(InterfaceProvider)
