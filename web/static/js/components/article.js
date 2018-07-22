import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragSource, DropTarget } from 'react-dnd'
import { dropArticle } from '../actions'
import { saveArticlesIndex } from '../socket'
import { DndTypes } from '../constants'
import { editArticle } from '../actions'
import { deleteArticle } from '../socket'

import { Row, Col } from 'react-materialize'

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

@DropTarget(DndTypes.ARTICLE, itemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOverCurrent: monitor.isOver({ shallow: true })
}))
@DragSource(DndTypes.ARTICLE, itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Article extends Component {
  constructor(props) {
    super(props)
    this.state = {
      onHover: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      save_articles_index,
      tag_id,
      articles,
      saveArticlesIndex
    } = nextProps
    if (!this.props.save_articles_index && save_articles_index) {
      saveArticlesIndex({ tag_id, articles })
    }
  }

  onMouseEnter(event) {
    this.setState({ onHover: true })
  }
  onMouseLeave(event) {
    this.setState({ onHover: false })
  }
  renderEditInterface() {
    // const { onHover } = this.state
    // if (!onHover) return null

    return (
      <i
        className="material-icons small waves-effect waves-light article-item-more"
        onClick={ev => this.onEditClick(ev)}
      >
        content_paste
      </i>
    )

    // const deleteInterface = (
    //   <div
    //     className="tag-body-interface"
    //     onClick={ev => this.onDeleteClick(ev)}
    //   >
    //     <i className="small material-icons">delete</i>
    //   </div>
    // )

    // return (
    //   <div>
    //     {editInterface}
    //     {deleteInterface}
    //   </div>
    // )
  }

  onEditClick(event) {
    const { article, editArticle } = this.props
    editArticle(article)
    event.stopPropagation()
    event.preventDefault()
  }
  onDeleteClick(event) {
    const { article, deleteArticle } = this.props
    deleteArticle(article)
    event.stopPropagation()
  }

  render() {
    const {
      article: { title, favicon, url, description },
      isDragging,
      isOverCurrent,
      connectDragSource,
      connectDropTarget
    } = this.props

    const descr = description ? `description: ${description}` : ''

    const articleClass = isOverCurrent ? 'article-drag-hover' : 'article'
    const opacity = isDragging ? 0.25 : 1
    return connectDragSource(
      connectDropTarget(
        <div
          className={articleClass}
          onMouseEnter={ev => this.onMouseEnter(ev)}
          onMouseLeave={ev => this.onMouseLeave(ev)}
          style={{ opacity }}
        >
          <Row className="article-item">
            <Col s={12}>
              <a href={url} className="article-item-title" target="_blank">
                <div className="article-item-body">
                  <div className="article-item-title">
                    {this.renderEditInterface()}
                    <img className="favicon" src={favicon} />
                    {title}
                    <div className="truncate">{descr}</div>
                  </div>
                </div>
              </a>
            </Col>
          </Row>
        </div>
      )
    )
  }
}

//{this.renderEditInterface()}

function mapStateToProps(store) {
  return {
    articles: store.data.articles,
    save_articles_index: store.data.save_articles_index,
    tag_id: store.data.current_tag_id
  }
}

export default connect(
  mapStateToProps,
  {
    dropArticle,
    saveArticlesIndex,
    editArticle,
    deleteArticle
  }
)(Article)
