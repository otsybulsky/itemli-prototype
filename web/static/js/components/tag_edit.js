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

  render() {
    return (
      <div className="form-container">
        <div>
          <Button onClick={() => this.onEditCancel()}>Back</Button>
          <h5>Edit tag</h5>
        </div>
        <form onSubmit={this.onFormSubmit}>
          <Input
            name="title"
            placeholder="enter title a tag"
            s={4}
            label="Title"
            value={this.state.title}
            onChange={this.onTitleChange}
          />
          <Input
            name="description"
            placeholder="enter description"
            s={6}
            label="Description"
            type="textarea"
            value={this.state.description}
            onChange={this.onDescriptionChange}
          />
          <Button type="submit">Apply</Button>
        </form>
      </div>
    )
  }
}

TagEdit.propTypes = {}

export default connect(null, { editTagCancel, editTagApply })(TagEdit)
