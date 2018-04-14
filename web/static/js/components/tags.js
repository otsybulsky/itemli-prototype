import React, { Component } from 'react'
import { connect } from 'react-redux'

import Tag from './tag'

class Tags extends Component {
  renderTags() {
    const { tag_ids, tags, level_index } = this.props
    if (!tags) {
      return null
    }
    return tag_ids.map((tag_meta, i) => {
      return (
        <Tag
          key={tag_meta.id}
          index={i}
          tag={tags[tag_meta.id]}
          sub_tags={tag_meta.sub_tags}
          level_index={[...level_index, i]}
        />
      )
    })
  }

  render() {
    console.log('TAGS level index - ', this.props.level_index)
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
