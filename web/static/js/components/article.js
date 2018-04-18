import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragSource, DropTarget } from 'react-dnd'
import { dropArticle } from '../actions'

const itemSource = {
  beginDrag(props, monitor, component) {
    return {
      id: props.article.id,
      index: props.index
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
    const { id: source_id, index: source_index } = source
    const {
      article: { id: target_id },
      index: target_index,
      articles,
      dropArticle
    } = props
    if (source_index !== target_index) {
      dropArticle({ articles, source_index, target_index })
    }
  }
}

@DropTarget('ARTICLE', itemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOverCurrent: monitor.isOver({ shallow: true })
}))
@DragSource('ARTICLE', itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Article extends Component {
  render() {
    const {
      article: { title, favicon, url },
      isDragging,
      isOverCurrent,
      connectDragSource,
      connectDropTarget
    } = this.props
    const opacity = isDragging ? 0.25 : 1
    return connectDragSource(
      connectDropTarget(
        <div style={{ opacity }}>
          <img className="favicon" src={favicon} />
          <h6>{title}</h6>
        </div>
      )
    )
  }
}

function mapStateToProps(store) {
  return {
    articles: store.data.articles
  }
}

export default connect(mapStateToProps, { dropArticle })(Article)
