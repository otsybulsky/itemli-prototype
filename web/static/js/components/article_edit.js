import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col, Autocomplete, Button, Tag } from 'react-materialize'
import {
  editArticleCancel,
  articleEditAddTag,
  articleEditRemoveTag,
  dragElementEnd
} from '../actions'
import { editArticleApply, deleteArticle } from '../socket'
import Textarea from 'react-textarea-autosize'
import confirmDialog from './dialogs/confirm'
import TagChip from './tag_chip'

import { DropTarget } from 'react-dnd'
import { DndTypes } from '../constants'

const itemTarget = {
  drop(props, monitor, component) {
    const source = monitor.getItem()
    const { id: new_tag, isAvailableDrop } = source

    const { tag_ids, articleEditAddTag, dragElementEnd } = props

    if (new_tag && !tag_ids.includes(new_tag)) {
      //add new tag for article
      articleEditAddTag(new_tag)
    }
    dragElementEnd()
  }
}

@DropTarget(DndTypes.TAG, itemTarget, (dnd_connect, monitor) => ({
  connectDropTarget: dnd_connect.dropTarget(),
  isOverCurrent: monitor.isOver({ shallow: true })
}))
class ArticleEdit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      description: '',
      url: '',
      showTagInput: false
    }

    this.onTitleChange = this.onTitleChange.bind(this)
    this.onDescriptionChange = this.onDescriptionChange.bind(this)
    this.onUrlChange = this.onUrlChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }

  onTitleChange(event) {
    this.setState({ title: event.target.value })
  }
  onDescriptionChange(event) {
    this.setState({ description: event.target.value })
  }
  onUrlChange(event) {
    this.setState({ url: event.target.value })
  }
  onFormSubmit(event) {
    event.preventDefault()
    const { tag_ids, editArticleApply } = this.props
    editArticleApply(this.state, tag_ids)
  }
  onEditCancel() {
    this.props.editArticleCancel()
  }
  onDelete(event) {
    const { article_for_edit, deleteArticle } = this.props
    if (article_for_edit) {
      confirmDialog(
        `Delete article ${this.props.article_for_edit.title}?`
      ).then(
        () => {
          this.onEditCancel()
          deleteArticle(article_for_edit)
        },
        () => {
          //console.log('delete cancel')
        }
      )
    }
  }

  setLocalState(props) {
    if (props.article_for_edit) {
      const {
        article_for_edit: { id, title, description, url },
        current_tag_id
      } = props

      this.setState({ id: id })
      this.setState({ title: title || '' })
      this.setState({ description: description || '' })
      this.setState({ url: url || '' })
    } else {
      const { current_tag_id, articleEditAddTag } = props
      this.setState({ id: undefined })
      this.setState({ title: '' })
      this.setState({ description: '' })
      this.setState({ url: '' })
      articleEditAddTag(current_tag_id)
    }
  }

  componentDidMount() {
    this.setLocalState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setLocalState(nextProps)
  }

  onClickNewTag = () => {
    this.setState({ showTagInput: true })
  }
  onTagInputKeyDown = event => {
    const keys = ['Enter', 'Escape']
    if (keys.includes(event.key)) {
      this.setState({ showTagInput: false })
      event.stopPropagation()
    }
  }
  onAutocomplete(value) {
    const { tags, tag_ids, articleEditAddTag } = this.props

    const data = Object.values(tags).reduce((obj, item) => {
      obj[item['title']] = item
      return obj
    }, {})

    this.setState({
      showTagInput: false
    })

    const new_tag = data[value].id
    if (new_tag && !tag_ids.includes(new_tag)) {
      //add new tag for article
      articleEditAddTag(new_tag)
    }
  }

  componentDidUpdate() {
    const { showTagInput } = this.state
    if (showTagInput) {
      document.getElementById('tagInput').focus()
    }
  }

  showTagInput() {
    const { showTagInput } = this.state
    const { tags } = this.props

    const data = Object.values(tags).reduce((obj, item) => {
      obj[item['title']] = null
      return obj
    }, {})

    if (showTagInput) {
      return (
        <Autocomplete
          data={data}
          title="Tape tag name ..."
          id="tagInput"
          onAutocomplete={value => this.onAutocomplete(value)}
          onKeyDown={event => this.onTagInputKeyDown(event)}
        />
      )
    } else {
      return <a onClick={this.onClickNewTag}>Add new tag...</a>
    }
  }

  removeTag = tag => {
    const { articleEditRemoveTag } = this.props
    articleEditRemoveTag(tag.id)
  }

  renderTags() {
    const { tags, tag_ids } = this.props

    const tags_view = tag_ids.map(id => {
      return (
        <TagChip
          key={'tagchip-' + id}
          tag={tags[id]}
          removeTag={this.removeTag}
        />
      )
    })

    return (
      <div>
        {this.showTagInput()}
        {tags_view}
      </div>
    )
  }

  render() {
    const { connectDropTarget, isOverCurrent } = this.props

    const formClass = isOverCurrent
      ? 'form-container article-edit-hover'
      : 'form-container'

    return connectDropTarget(
      <div className={formClass}>
        <form onSubmit={this.onFormSubmit}>
          <Row>
            <Col s={4}>
              <a
                className="waves-effect waves-light"
                data-tip
                data-for="btnBack"
                onClick={() => this.onEditCancel()}
              >
                <i className="material-icons">close</i>
              </a>
            </Col>
            <Col s={8} className="right-align">
              <a
                className="waves-effect waves-light"
                onClick={ev => this.onDelete(ev)}
              >
                <i className="material-icons">delete</i>
              </a>
            </Col>
          </Row>

          <Row>
            <Col s={12}>
              <h6>Title</h6>
              <Textarea
                className="tag-edit-input tag-edit-input-title"
                autoFocus
                placeholder="enter article title"
                label="Title"
                value={this.state.title || ''}
                onChange={this.onTitleChange}
              />
            </Col>
            <Col s={12}>
              <h6>Description</h6>
              <Textarea
                className="tag-edit-input"
                placeholder="enter description"
                label="Description"
                value={this.state.description || ''}
                onChange={this.onDescriptionChange}
              />
            </Col>
            <Col s={12}>
              <a href={this.state.url || ''} target="_blank">
                <i className="material-icons">link</i>
              </a>

              <Textarea
                className="tag-edit-input"
                placeholder="enter URL"
                label="URL"
                value={this.state.url || ''}
                onChange={this.onUrlChange}
              />
            </Col>
          </Row>

          <div className="article-tags">{this.renderTags()}</div>

          <Row>
            <Col s={12} className="right-align">
              <Button className="waves-effect waves-light" type="submit">
                Apply
              </Button>
            </Col>
          </Row>
        </form>
      </div>
    )
  }
}

ArticleEdit.propTypes = {}

function mapStateToProps(state) {
  return {
    tag_ids: state.interface.article_edit_tag_ids,
    article_for_edit: state.data.article_for_edit,
    current_tag_id: state.data.current_tag_id,
    tags: state.data.tags
  }
}

export default connect(mapStateToProps, {
  editArticleCancel,
  editArticleApply,
  deleteArticle,
  articleEditAddTag,
  articleEditRemoveTag,
  dragElementEnd
})(ArticleEdit)
