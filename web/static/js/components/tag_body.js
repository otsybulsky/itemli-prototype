import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { editTag } from '../actions'
import { deleteTag } from '../socket'

class TagBody extends Component {
  constructor(props) {
    super(props)
    this.state = {
      onHover: false,
      hoverClass: ''
    }
  }

  renderEditInterface() {
    return null
    const { onHover } = this.state
    if (!onHover) return null

    const editInterface = (
      <div className="tag-body-interface" onClick={ev => this.onEditClick(ev)}>
        <i className="small material-icons">edit</i>
      </div>
    )

    const deleteInterface = (
      <div
        className="tag-body-interface"
        onClick={ev => this.onDeleteClick(ev)}
      >
        <i className="small material-icons">delete</i>
      </div>
    )

    return (
      <div>
        {editInterface}
        {deleteInterface}
      </div>
    )
  }

  onEditClick(event) {
    const { tag, editTag } = this.props
    editTag(tag)
    event.stopPropagation()
  }
  onDeleteClick(event) {
    const { tag, deleteTag } = this.props
    deleteTag(tag)
    event.stopPropagation()
  }

  onMouseEnter(event) {
    this.setState({ onHover: true, hoverClass: 'hover-tag-body' })
  }
  onMouseLeave(event) {
    this.setState({ onHover: false, hoverClass: '' })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isDragOverCurrent != this.props.isDragOverCurrent) {
      if (nextProps.isDragOverCurrent) {
        this.setState({ hoverClass: 'hover-tag-body' })
      } else {
        this.setState({ hoverClass: '' })
      }
    }
  }

  render() {
    const { tag, isTagSelected } = this.props
    const selectedClass = isTagSelected ? 'tag-body-selected' : ''
    const classDiv = `tag-body ${this.state.hoverClass} ${selectedClass}`
    return (
      <div
        className={classDiv}
        onMouseEnter={ev => this.onMouseEnter(ev)}
        onMouseLeave={ev => this.onMouseLeave(ev)}
      >
        <h6>
          {tag.title} ({tag.articles_count})
        </h6>
        {this.renderEditInterface()}
      </div>
    )
  }
}

TagBody.propTypes = {
  tag: PropTypes.object.isRequired,
  isTagSelected: PropTypes.bool.isRequired,
  isDragOverCurrent: PropTypes.bool
}

export default connect(null, { editTag, deleteTag })(TagBody)
