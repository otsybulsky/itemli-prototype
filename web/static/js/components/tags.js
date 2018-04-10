import React, { Component } from 'react'
import { connect } from 'react-redux'
import Tag from './tag'

class Tags extends Component {
  renderTags() {
    const { tags } = this.props
    if (!tags) {
      return <div />
    }

    return tags.map(tag => {
      return <Tag key={tag.id} tag={tag} />
    })
  }

  render() {
    return (
      <div className="tags">
        <h5>Current tags</h5>
        {this.renderTags()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    tags: state.data.tags
  }
}

export default connect(mapStateToProps)(Tags)
