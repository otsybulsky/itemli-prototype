import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import { dragElementEnd, dropTag } from '../actions'
import { searchTagInSubTags } from '../helpers'
import { DndTypes } from '../constants'

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

@DropTarget(DndTypes.TAG, itemTarget, (connect, monitor) => ({
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
        <i className="tiny material-icons white-text">playlist_add</i>
      </div>
    )
  }
}

DropInterfaceTag.propTypes = {
  tag: PropTypes.object.isRequired,
  isDragging: PropTypes.bool.isRequired,
  opacity: PropTypes.number.isRequired
}

export default connect(null, { dragElementEnd, dropTag })(DropInterfaceTag)
