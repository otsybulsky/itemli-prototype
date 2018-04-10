import React, { Component } from 'react'
import { connect } from 'react-redux'

class Tag extends Component {
  render() {
    const { tag } = this.props
    return (
      <div className="tag">
        <h6>the tag - {tag.title}</h6>
      </div>
    )
  }
}

export default connect()(Tag)
