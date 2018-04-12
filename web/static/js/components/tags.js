import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { DragDropContext } from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'

import Tag from './tag'

class Tags extends Component {
  renderTags() {
    const { tag_ids, tags } = this.props
    if (!tags) {
      return null
    }
    return tag_ids.map(tag => {
      return <Tag key={tag.id} tag={tags[tag.id]} />
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
    tags: state.data.tags,
    tag_ids: state.data.tag_ids
  }
}

export default connect(mapStateToProps)(Tags)
