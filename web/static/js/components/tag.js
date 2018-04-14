import React, { Component } from 'react'
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'

import { dragElementStart, dragElementEnd, dropTag } from '../actions'
import DropInterfaceTag from './drop_interface_tag'

import Tags from './tags'

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
}

const itemSource = {
  beginDrag(props, monitor, component) {
    return {
      id: props.tag.id,
      index: props.index
    }
  }
  // endDrag(props, monitor) {
  //   const item = monitor.getItem()
  //   const dropResult = monitor.getDropResult()

  //   if (dropResult) {
  //     //console.log('---end drag', props.tag)
  //   }
  // }
}

const itemTarget = {
  hover(props, monitor, component) {
    return
    const source = monitor.getItem()
    const { id: source_id, index: dragIndex } = source
    const { tag: { id: target_id }, index: hoverIndex, dropTag } = props

    if (dragIndex === hoverIndex) {
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

    dropTag({ start_index: dragIndex, end_index: hoverIndex })
    monitor.getItem().index = hoverIndex
  },

  drop(props, monitor, component) {
    const source = monitor.getItem()
    const { id: source_id, index: start_index } = source
    const { tag: { id: target_id }, index: end_index, dropTag } = props

    if (target_id !== source_id) {
      //change items position
      dropTag({ start_index, end_index })
    }
  }
}

@DropTarget('TAG', itemTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource('TAG', itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
class Tag extends Component {
  componentDidMount() {
    const img = new Image()
    img.src = 'images/icons8-add-tag-48.png'
    img.onload = () => this.props.connectDragPreview(img)
  }

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
    const { tag, renderDropInterface } = this.props
    if (!renderDropInterface) {
      return null
    }

    return <DropInterfaceTag key={tag.id + '_add_subtag'} tag={tag} />
  }

  renderSubTags() {
    const { tag, sub_tags } = this.props
    if (!sub_tags || !sub_tags[0]) {
      return null
    }
    return <Tags key={tag.id + '_sub_tags'} tag_ids={sub_tags} />
  }

  render() {
    const { tag, isDragging, connectDragSource, connectDropTarget } = this.props
    const opacity = isDragging ? 0 : 1

    return connectDragSource(
      connectDropTarget(
        <div>
          <div style={{ ...style, opacity }} className="tag">
            <div>
              <h6>the tag - {tag.title}</h6>
            </div>
            {this.renderDropInterface()}
            {this.renderSubTags()}
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

export default connect(mapStateToProps, {
  dragElementStart,
  dragElementEnd,
  dropTag
})(Tag)
