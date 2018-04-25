import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Input, Button, Tag } from 'react-materialize'
import { editArticleCancel } from '../actions'
import { editArticleApply } from '../socket'

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
        <div>
          <Button onClick={() => this.onEditCancel()}>Back</Button>
          <h5>Edit article</h5>
        </div>
        <form onSubmit={this.onFormSubmit}>
          {this.renderTags()}
          <Input
            name="title"
            placeholder="enter title article"
            s={4}
            label="Title"
            value={this.state.title || ''}
            onChange={this.onTitleChange}
          />
          <Input
            name="description"
            placeholder="enter description"
            s={6}
            label="Description"
            type="textarea"
            value={this.state.description || ''}
            onChange={this.onDescriptionChange}
          />
          <Input
            name="url"
            placeholder="enter url"
            s={6}
            label="Url"
            type="textarea"
            value={this.state.url || ''}
            onChange={this.onUrlChange}
          />
          <Button type="submit">Apply</Button>
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
