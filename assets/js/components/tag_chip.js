import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TagChip extends Component {
  onRemoveTag = () => {
    const { tag, removeTag } = this.props
    removeTag(tag)
  }

  render() {
    const { tag } = this.props
    return (
      <div className="chip">
        {tag.title}
        <i className="close material-icons" onClick={this.onRemoveTag}>
          close
        </i>
      </div>
    )
  }
}

export default TagChip
