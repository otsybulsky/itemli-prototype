import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'react-materialize'
import { editTagCancel } from '../actions'
import { editTagApply } from '../socket'
import Textarea from 'react-textarea-autosize'

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
      <form className="form-container" onSubmit={this.onFormSubmit}>
        <Row>
          <Col>
            <Button onClick={() => this.onEditCancel()}>Back</Button>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <Textarea
              autoFocus
              placeholder="enter tag title"
              label="Title"
              value={this.state.title || ''}
              onChange={this.onTitleChange}
            />
          </Col>
          <Col s={12}>
            <Textarea
              placeholder="enter description"
              label="Description"
              value={this.state.description || ''}
              onChange={this.onDescriptionChange}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Button type="submit">Apply</Button>
          </Col>
        </Row>
      </form>
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
