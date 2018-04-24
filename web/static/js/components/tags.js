import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Tag from './tag'

class Tags extends Component {
  renderTags() {
    const { tag_ids, tags } = this.props

    if (!tags) {
      return null
    }

    return tag_ids.map((tag_meta, i) => {
      return (
        <Tag
          key={tag_meta.id}
          tag={tags[tag_meta.id]}
          sub_tags={tag_meta.sub_tags}
          collapsed={tag_meta.collapsed || false}
          forceRefresh={Date.now()}
        />
      )
    })
  }

  render() {
    return <div className="tags">{this.renderTags()}</div>
  }
}

function mapStateToProps(state) {
  return {
    tags: state.data.tags
  }
}

Tags.propTypes = {
  forceRefresh: PropTypes.number.isRequired,
  tags: PropTypes.object.isRequired,
  tag_ids: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(Tags)
