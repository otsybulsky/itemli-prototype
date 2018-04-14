import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'

const itemTarget = {
  drop(props, monitor, component) {
    const source = monitor.getItem()
    const { id: source_id, index: start_index } = source
    const {
      tag: { id: target_id },
      index: end_index,
      dropTag,
      level_index
    } = props
    console.log(
      'drop target for create subtag in',
      props.tag,
      level_index,
      'source  - ',
      source
    )
  }
}

@DropTarget('TAG', itemTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
class DropInterfaceTag extends Component {
  render() {
    const { connectDropTarget } = this.props
    return connectDropTarget(<div className="drop-interface-tag">add sub</div>)
  }
}

export default connect()(DropInterfaceTag)
