import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'react-materialize'
import { editTagCancel } from '../actions'
import { editTagApply, deleteTag } from '../socket'
import Textarea from 'react-textarea-autosize'
import ReactTooltip from 'react-tooltip'

import confirmDialog from './dialogs/confirm'

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
  onDelete() {
    const { tag_for_edit, deleteTag, editTagCancel } = this.props
    if (tag_for_edit) {
      confirmDialog(`Delete tag ${this.props.tag_for_edit.title}?`).then(
        () => {
          //delete the tag confirmed
          editTagCancel()
          deleteTag(tag_for_edit)
        },
        () => {
          //console.log('delete cancel')
        }
      )
    }
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
          <Col s={4}>
            <a
              className="waves-effect waves-light"
              data-tip
              data-for="btnBack"
              onClick={() => this.onEditCancel()}
            >
              <i className="material-icons">close</i>
            </a>
            <ReactTooltip
              id="btnBack"
              type="info"
              place="right"
              effect="solid"
              delayShow={1000}
            >
              <span>Return to articles</span>
            </ReactTooltip>
          </Col>
          <Col s={8} className="right-align">
            <a
              className="waves-effect waves-light"
              onClick={() => this.onDelete()}
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
              placeholder="enter tag title"
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
        </Row>

        <Row>
          <Col s={12} className="right-align">
            <Button className="waves-effect waves-light" type="submit">
              Apply
            </Button>
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

export default connect(mapStateToProps, {
  editTagCancel,
  editTagApply,
  deleteTag
})(TagEdit)
