import React, { Component } from 'react'
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'

import { dragElementStart, dragElementEnd, dropTag } from '../actions'
import DropInterfaceTag from './drop_interface_tag'

import Tags from './tags'

const style = {
  color: 'black',
  backgroundColor: 'white',
  cursor: 'move'
}
const style_sub_tags = {
  marginLeft: '20px'
}

const itemSource = {
  beginDrag(props, monitor, component) {
    return {
      id: props.tag.id
    }
  }
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
      dropTag({ source_id, target_id, createSubTag: false })
    }
    dragElementEnd()
  }
}

@DropTarget('TAG', itemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOverCurrent: monitor.isOver({ shallow: true })
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
      if (nextProps.isDragging) {
        this.props.dragElementStart()
      }
    }
  }

  renderDropInterface() {
    const {
      tag,
      renderDropInterface,
      isDragging,
      dragElementEnd,
      isOverCurrent
    } = this.props
    if (!renderDropInterface) {
      return null
    }
    // if (!isOverCurrent) {
    //   return null
    // }

    return (
      <DropInterfaceTag
        key={tag.id + '_add_subtag'}
        tag={tag}
        isDragging={isDragging}
        dragElementEnd={dragElementEnd}
      />
    )
  }

  renderSubTags() {
    const { tag, sub_tags } = this.props
    if (!sub_tags || !sub_tags[0]) {
      return null
    }

    return (
      <div style={style_sub_tags}>
        <Tags
          key={tag.id + '_sub_tags'}
          tag_ids={sub_tags}
          tab_ids_size={sub_tags.length}
        />
      </div>
    )
  }

  render() {
    const {
      tag,
      isDragging,
      isOverCurrent,
      connectDragSource,
      connectDropTarget,
      sub_tags
    } = this.props
    const opacity = isDragging ? 0.5 : 1
    const backgroundColor = isOverCurrent ? 'lightgreen' : 'white'

    return connectDragSource(
      connectDropTarget(
        <div>
          <div style={{ ...style, opacity, backgroundColor }} className="tag">
            <div>
              <h5>{tag.title}</h5>
            </div>
            {this.renderSubTags()}
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

export default connect(mapStateToProps, {
  dragElementStart,
  dragElementEnd,
  dropTag
})(Tag)
