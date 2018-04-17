import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import { dragElementEnd, dropTag } from '../actions'
import { searchTagInSubTags } from '../helpers'

const style = {
  backgroundColor: 'gray',
  cursor: 'move'
}

const itemTarget = {
  hover(props, monitor, component) {
    const { id: source_id, sub_tags } = monitor.getItem()
    const {
      tag: { id: target_id }
    } = props

    monitor.getItem().isAvailableDrop = !searchTagInSubTags(target_id, sub_tags)
  },

  drop(props, monitor, component) {
    const hasDroppedOnChild = monitor.didDrop()
    if (hasDroppedOnChild) {
      return
    }

    const source = monitor.getItem()
    const { id: source_id, isAvailableDrop } = source
    const {
      tag: { id: target_id },
      dropTag,
      dragElementEnd
    } = props
    if (isAvailableDrop) {
      if (target_id !== source_id) {
        //change items position
        dropTag({
          source_id,
          target_id,
          createSubTag: true
        })
      }
    }
    dragElementEnd()
  }
}

@DropTarget('TAG', itemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  itemSource: monitor.getItem()
}))
class DropInterfaceTag extends Component {
  render() {
    const { connectDropTarget, isOverCurrent, opacity, itemSource } = this.props
    const isAvailableDrop = itemSource ? itemSource.isAvailableDrop : false
    const backgroundColor = isAvailableDrop && isOverCurrent ? 'red' : 'gray'
    return connectDropTarget(
      <div
        style={{ ...style, backgroundColor, opacity }}
        className="drop-interface-tag"
      >
        ++
      </div>
    )
  }
}

export default connect(null, { dragElementEnd, dropTag })(DropInterfaceTag)
