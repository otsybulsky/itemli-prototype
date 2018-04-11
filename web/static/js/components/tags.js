import React, { Component } from 'react'
import { connect } from 'react-redux'

import { DragDropContext } from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'

import Tag from './tag'

class Tags extends Component {
  renderTags() {
    const { tags } = this.props
    if (!tags) {
      return null
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

Tags = DragDropContext(MultiBackend(HTML5toTouch))(Tags)

function mapStateToProps(state) {
  return {
    tags: state.data.tags
  }
}

export default connect(mapStateToProps)(Tags)
