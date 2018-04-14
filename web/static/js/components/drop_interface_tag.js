import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import { dropTag } from '../actions'

const itemTarget = {
  hover(props, monitor, component) {
    monitor.getItem().createSubTag = true
  },

  drop(props, monitor, component) {
    const source = monitor.getItem()

    const {
      id: source_id,
      index: start_index,
      level_index: start_level_index,
      createSubTag
    } = source
    const {
      tag: { id: target_id },
      index: end_index,
      level_index: end_level_index,
      dropTag,
      dragElementEnd
    } = props
    // console.log(
    //   'drop target for create subtag in',
    //   start_level_index,
    //   end_level_index
    // )
    if (target_id !== source_id) {
      //change items position
      dropTag({ start_level_index, end_level_index, createSubTag })
    }
    dragElementEnd()
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

export default connect(null, { dropTag })(DropInterfaceTag)
