import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Input, Button } from 'react-materialize'
import { editTagCancel } from '../actions'
import { editTagApply } from '../socket'

class TagEdit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      description: ''
    }

    this.onTitleChange = this.onTitleChange.bind(this)
    this.onDescriptionChange = this.onDescriptionChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }
  onTitleChange(event) {
    this.setState({ title: event.target.value })
  }
  onDescriptionChange(event) {
    this.setState({ description: event.target.value })
  }
  onFormSubmit(event) {
    event.preventDefault()
    this.props.editTagApply(this.state)
  }
  onEditCancel() {
    this.props.editTagCancel()
  }

  setLocalState(props) {
    if (props.tag_for_edit) {
      const {
        tag_for_edit: { id, title, description }
      } = props
      this.setState({ id: id })
      this.setState({ title: title || '' })
      this.setState({ description: description || '' })
    } else {
      this.setState({ id: undefined })
      this.setState({ title: '' })
      this.setState({ description: '' })
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
        </div>
        <form onSubmit={this.onFormSubmit}>
          <Row>
            <Input
              s={6}
              name="tag-title"
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
          </Row>
          <Button type="submit">Apply</Button>
        </form>
      </div>
    )
  }
}

TagEdit.propTypes = {}

function mapStateToProps(state) {
  return {
    tag_for_edit: state.data.tag_for_edit
  }
}

export default connect(mapStateToProps, { editTagCancel, editTagApply })(
  TagEdit
)
