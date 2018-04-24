import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { editTag } from '../actions'

class TagBody extends Component {
  constructor(props) {
    super(props)
    this.state = {
      onHover: false,
      hoverClass: ''
    }
  }

  renderEditInterface() {
    const { onHover } = this.state
    //if (!onHover) return null

    return (
      <div className="tag-body-interface" onClick={ev => this.onEditClick(ev)}>
        <i className="tiny material-icons">edit</i>
      </div>
    )
  }

  onEditClick(event) {
    const { tag, editTag } = this.props
    editTag(tag)
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
    const { tag } = this.props
    const classDiv = `tag-body ${this.state.hoverClass}`
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
  isDragOverCurrent: PropTypes.bool
}

export default connect(null, { editTag })(TagBody)
