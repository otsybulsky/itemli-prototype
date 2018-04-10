import React, { Component } from 'react'
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'

import { dragElementStart, dragElementEnd } from '../actions'

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
}

const itemSource = {
  beginDrag(props) {
    console.log('---begin drag from', props.tag, props)
    return {}
  },
  endDrag(props, monitor) {
    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()

    if (dropResult) {
      console.log('---end drag', props.tag)
    }
  }
}

const itemTarget = {
  drop(props, monitor, component) {
    console.log('drop', props.tag, props)
  },
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index || 0
    const hoverIndex = props.index

    const dragGroup = monitor.getItem().groupId
    const hoverGroup = props.groupId

    if (dragGroup !== hoverGroup) {
      return
    }

    if (dragIndex === hoverIndex && dragGroup === hoverGroup) {
      return
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    const clientOffset = monitor.getClientOffset()
    const hoverClientY = clientOffset.y - hoverBoundingRect.top
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }

    monitor.getItem().index = hoverIndex
    monitor.getItem().groupId = hoverGroup
  }
}

@DropTarget('TAG', itemTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource('TAG', itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Tag extends Component {
  componentWillReceiveProps(nextProps) {
    const { isDragging } = this.props
    if (nextProps.isDragging != isDragging) {
      switch (nextProps.isDragging) {
        case true:
          this.props.dragElementStart()
          break
        default:
          this.props.dragElementEnd()
          break
      }
    }
  }

  renderDropInterface() {
    const { renderDropInterface } = this.props
    if (!renderDropInterface) {
      return <div />
    }

    return <div>DROP INTERFACE</div>
  }

  render() {
    const { tag, isDragging, connectDragSource, connectDropTarget } = this.props
    const opacity = isDragging ? 0 : 1
    return connectDragSource(
      connectDropTarget(
        <div>
          <div style={{ ...style, opacity }} className="tag">
            <h6>the tag - {tag.title}</h6>
            {this.renderDropInterface()}
          </div>
        </div>
      )
    )
  }
}

function mapStateToProps(state) {
  return {
    renderDropInterface: state.interface.renderDropInterface
  }
}

export default connect(mapStateToProps, { dragElementStart, dragElementEnd })(
  Tag
)
