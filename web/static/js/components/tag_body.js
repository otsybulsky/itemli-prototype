import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { editTag } from '../actions'

class TagBody extends Component {
  constructor(props) {
    super(props)
    this.state = { onHover: false }
  }

  renderEditInterface() {
    const { onHover } = this.state
    if (!onHover) return null

    return (
      <i
        className="tiny material-icons blue-text"
        onClick={ev => this.onEditClick(ev)}
      >
        edit
      </i>
    )
  }

  onEditClick(event) {
    const { tag, editTag } = this.props
    editTag(tag)
    event.stopPropagation()
  }

  onMouseEnter(event) {
    this.setState({ onHover: true })
  }
  onMouseLeave(event) {
    this.setState({ onHover: false })
  }

  render() {
    const { tag } = this.props
    return (
      <div
        className="tag-body"
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
  tag: PropTypes.object.isRequired
}

export default connect(null, { editTag })(TagBody)
