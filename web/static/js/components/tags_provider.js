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
import { editTag, editArticle } from '../actions'
import { Row, Col } from 'react-materialize'

class TagsProvider extends Component {
  action_add_tag(event) {
    this.props.editTag()
  }

  action_open_import(event) {
    this.props.history.push('/app/import')
  }

  action_add_article(event) {
    const { current_tag_id, tags, editArticle } = this.props

    const current_tag = []
    if (current_tag_id) {
      current_tag.push(tags[current_tag_id])
    }

    editArticle({
      tags: current_tag
    })
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
        <div className="fixed-action-btn vertical">
          <a className="btn-floating btn-large red">
            <i className="large material-icons">add</i>
          </a>
          <ul>
            <li>
              <a
                className="btn-floating blue"
                onClick={ev => this.action_open_import(ev)}
              >
                <i className="material-icons">cloud_upload</i>
              </a>
            </li>
            <li>
              <a
                className="btn-floating green"
                onClick={ev => this.action_add_tag(ev)}
              >
                <i className="material-icons">create_new_folder</i>
              </a>
            </li>
            <li>
              <a
                className="btn-floating red"
                onClick={ev => this.action_add_article(ev)}
              >
                <i className="material-icons">link</i>
              </a>
            </li>
          </ul>
        </div>

        <Row>
          <Col s={4} className="tags-container">
            {this.renderUnbounds()}

            <Tags tag_ids={this.props.tag_ids} forceRefresh={Date.now()} />
          </Col>
          <Col s={8}>{this.renderBody()}</Col>
        </Row>
      </div>
    )
  }
}

TagsProvider = DragDropContext(MultiBackend(HTML5toTouch))(TagsProvider)

function mapStateToProps(state) {
  return {
    tag_ids: state.data.tag_ids,
    tag_edit_flag: state.data.tag_edit_flag || false,
    articles_without_tag_count: state.data.articles_without_tag_count || 0,

    current_tag_id: state.data.current_tag_id,
    tags: state.data.tags
  }
}

TagsProvider.propTypes = {
  tag_ids: PropTypes.array.isRequired,
  editTag: PropTypes.func.isRequired,
  tag_edit_flag: PropTypes.bool.isRequired,
  articles_without_tag_count: PropTypes.number.isRequired,
  current_tag_id: PropTypes.string,
  tags: PropTypes.array
}

export default connect(
  mapStateToProps,
  { editTag, editArticle }
)(TagsProvider)
