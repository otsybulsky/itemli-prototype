import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'
import Tags from './tags'
import Articles from './articles'
import ArticlesUnbound from './articles_unbound'
import TagEdit from './tag_edit'
import { editTag } from '../actions'

class TagsProvider extends Component {
  action_add_tag(event) {
    this.props.editTag()
  }

  renderBody() {
    if (this.props.tag_edit_flag) {
      return (
        <div>
          <TagEdit />
        </div>
      )
    }
    return <Articles />
  }

  renderUnbounds() {
    const { articles_without_tag_count } = this.props
    if (articles_without_tag_count == 0) return null

    return (
      <ArticlesUnbound
        articles_without_tag_count={articles_without_tag_count}
      />
    )
  }

  render() {
    return (
      <div>
        <div className="tags-container">
          <a
            className="btn-floating btn-small red"
            onClick={ev => this.action_add_tag(ev)}
          >
            <i className="material-icons">add</i>
          </a>
          {this.renderUnbounds()}
          <hr />
          <Tags tag_ids={this.props.tag_ids} forceRefresh={Date.now()} />
        </div>

        {this.renderBody()}
      </div>
    )
  }
}

TagsProvider = DragDropContext(MultiBackend(HTML5toTouch))(TagsProvider)

function mapStateToProps(state) {
  return {
    tag_ids: state.data.tag_ids,
    tag_edit_flag: state.data.tag_edit_flag || false,
    articles_without_tag_count: state.data.articles_without_tag_count || 0
  }
}

TagsProvider.propTypes = {
  tag_ids: PropTypes.array.isRequired,
  editTag: PropTypes.func.isRequired,
  tag_edit_flag: PropTypes.bool.isRequired,
  articles_without_tag_count: PropTypes.number.isRequired
}

export default connect(mapStateToProps, { editTag })(TagsProvider)
