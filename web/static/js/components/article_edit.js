import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col, Input, Button, Tag } from 'react-materialize'
import { editArticleCancel } from '../actions'
import { editArticleApply } from '../socket'
import Textarea from 'react-textarea-autosize'

class ArticleEdit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      description: '',
      url: '',
      tag_ids: []
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
    this.props.editArticleApply(this.state)
  }
  onEditCancel() {
    this.props.editArticleCancel()
  }
  setLocalState(props) {
    if (props.article_for_edit) {
      const {
        article_for_edit: { id, title, description, url, tags },
        current_tag_id
      } = props

      const tag_ids = tags ? tags.map(item => item.id) : []

      this.setState({ id: id })
      this.setState({ title: title || '' })
      this.setState({ description: description || '' })
      this.setState({ url: url || '' })
      this.setState({ tag_ids: tag_ids })
    } else {
      const { current_tag_id } = props
      this.setState({ id: undefined })
      this.setState({ title: '' })
      this.setState({ description: '' })
      this.setState({ url: '' })
      this.setState({ tag_ids: current_tag_id ? [current_tag_id] : [] })
    }
  }

  componentDidMount() {
    this.setLocalState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setLocalState(nextProps)
  }

  renderTags() {
    const { tag_ids } = this.state
    const { tags } = this.props

    return tag_ids.map(id => {
      return <Tag key={id}>{tags[id].title}</Tag>
    })
  }

  render() {
    return (
      <div className="form-container">
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
                className="waves-effect waves-light btn-floating disabled"
                //onClick={() => this.onDelete()}
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
    article_for_edit: state.data.article_for_edit,
    current_tag_id: state.data.current_tag_id,
    tags: state.data.tags
  }
}

export default connect(mapStateToProps, {
  editArticleCancel,
  editArticleApply
})(ArticleEdit)
