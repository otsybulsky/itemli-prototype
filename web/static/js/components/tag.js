import React, { Component } from 'react'
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'

import {
  dragElementStart,
  dragElementEnd,
  dropTag,
  collapseTag
} from '../actions'
import DropInterfaceTag from './drop_interface_tag'

import { searchTagInSubTags } from '../helpers'
import Tags from './tags'
import { fetchArticles } from '../socket'
import { DndTypes } from '../constants'

const style = {
  color: 'black',
  backgroundColor: 'white'
}
const style_sub_tags = {
  marginLeft: '20px'
}

const itemSource = {
  beginDrag(props, monitor, component) {
    return {
      id: props.tag.id,
      sub_tags: props.sub_tags,
      isAvailableDrop: false
    }
  }
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
        dropTag({ source_id, target_id, createSubTag: false })
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
@DragSource(DndTypes.TAG, itemSource, (connect, monitor) => ({
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

  changeCollapsible(event) {
    const { tag, collapseTag } = this.props
    collapseTag({ tag_id: tag.id })
    event.stopPropagation()
  }

  renderCollapsibleInterface() {
    const { tag, sub_tags, collapsed } = this.props
    if (!sub_tags || sub_tags.length == 0) {
      return null
    }

    let arrow_type = 'keyboard_arrow_down'
    if (collapsed) {
      arrow_type = 'keyboard_arrow_right'
    }

    return (
      <div
        className="tag-collapsible"
        onClick={ev => this.changeCollapsible(ev)}
      >
        <i className="material-icons left">{arrow_type}</i>
      </div>
    )
  }

  renderDropInterface(opacity) {
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
        opacity={opacity}
      />
    )
  }

  renderSubTags() {
    const { tag, sub_tags, collapsed } = this.props
    if (collapsed || !sub_tags || !sub_tags[0]) {
      return null
    }

    // time for force render, react view change props for 1 objects level
    return (
      <div style={style_sub_tags}>
        <Tags key={tag.id + '_sub_tags'} tag_ids={sub_tags} time={Date.now()} />
      </div>
    )
  }

  showArticles(event) {
    const { tag, fetchArticles } = this.props
    fetchArticles(tag.id)
    event.stopPropagation()
  }

  render() {
    const {
      tag,
      isDragging,
      isOverCurrent,
      connectDragSource,
      connectDropTarget,
      itemSource
    } = this.props
    const opacity = isDragging ? 0.25 : 1
    const isAvailableDrop = itemSource ? itemSource.isAvailableDrop : false
    const backgroundColor =
      isAvailableDrop && isOverCurrent ? 'lightgreen' : 'white'

    return connectDragSource(
      connectDropTarget(
        <div
          className="tag-container"
          style={{ opacity }}
          onClick={ev => this.showArticles(ev)}
        >
          {this.renderCollapsibleInterface()}
          {this.renderDropInterface(opacity)}
          <div style={{ ...style, backgroundColor }} className="tag">
            <h6>
              {tag.title} ({tag.articles_count})
            </h6>
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
  dropTag,
  collapseTag,
  fetchArticles
})(Tag)
