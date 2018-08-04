import React, { Component } from 'react'
import { connect } from 'react-redux'
import hash from 'object-hash'
import { saveLayoutToServer } from '../socket'

class LayoutProvider extends Component {
  componentWillReceiveProps(nextProps) {
    const { saveLayout, layout } = nextProps

    if (!this.props.saveLayout && saveLayout) {
      this.props.saveLayoutToServer({
        layout: layout,
        hash: hash(layout)
      })
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
      tag_ids: state.data.tag_ids,
      current_tag_id: state.data.current_tag_id
    }
  }
}

export default connect(mapStateToProps, { saveLayoutToServer })(LayoutProvider)
