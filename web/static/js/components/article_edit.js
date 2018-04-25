import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Input, Button } from 'react-materialize'
import { editArticleCancel } from '../actions'

class ArticleEdit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      description: '',
      url: ''
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
    //this.props.editTagApply(this.state)
  }
  onEditCancel() {
    this.props.editArticleCancel()
  }
  setLocalState(props) {
    if (props.article_for_edit) {
      const {
        article_for_edit: { id, title, description, url }
      } = props
      this.setState({ id: id })
      this.setState({ title: title || '' })
      this.setState({ description: description || '' })
      this.setState({ url: url || '' })
    } else {
      this.setState({ id: undefined })
      this.setState({ title: '' })
      this.setState({ description: '' })
      this.setState({ url: '' })
    }
  }

  componentDidMount() {
    this.setLocalState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setLocalState(nextProps)
  }

  render() {
    return (
      <div className="form-container">
        <div>
          <Button onClick={() => this.onEditCancel()}>Back</Button>
          <h5>Edit article</h5>
        </div>
        <form onSubmit={this.onFormSubmit}>
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
            label="Description"
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
    article_for_edit: state.data.article_for_edit
  }
}

export default connect(mapStateToProps, { editArticleCancel })(ArticleEdit)
