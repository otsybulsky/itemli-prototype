import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import { dropTag } from '../actions'

const style = {
  backgroundColor: 'gray',
  cursor: 'move'
}

const itemTarget = {
  drop(props, monitor, component) {
    const hasDroppedOnChild = monitor.didDrop()
    if (hasDroppedOnChild) {
      return
    }

    const source = monitor.getItem()
    const { id: source_id } = source
    const {
      tag: { id: target_id },
      dropTag,
      dragElementEnd
    } = props
    if (target_id !== source_id) {
      //change items position
      dropTag({
        source_id,
        target_id,
        createSubTag: true
      })
    }
    dragElementEnd()
  }
}

@DropTarget('TAG', itemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOverCurrent: monitor.isOver({ shallow: true })
}))
class DropInterfaceTag extends Component {
  render() {
    const { connectDropTarget, isOverCurrent } = this.props
    const backgroundColor = isOverCurrent ? 'red' : 'gray'
    return connectDropTarget(
      <div style={{ ...style, backgroundColor }} className="drop-interface-tag">
        add sub
      </div>
    )
  }
}

export default connect(null, { dropTag })(DropInterfaceTag)
