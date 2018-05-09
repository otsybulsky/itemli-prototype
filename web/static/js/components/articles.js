import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Article from './article'
import { fetchArticles, fetchArticlesUnbound } from '../socket'

import { DragDropContext } from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'

import { editArticle, editTag } from '../actions'
import { deleteTag } from '../socket'
import ArticleEdit from './article_edit'

import { Button } from 'react-materialize'

import confirmDialog from './dialogs/confirm'

class Articles extends Component {
  renderArticles() {
    const { articles, article_edit_flag } = this.props
    if (!articles || article_edit_flag) {
      return null
    }
    return articles.map((article, i) => {
      return <Article index={i} key={article.id} article={article} />
    })
  }

  onAddArticle(event) {
    this.props.editArticle()
  }
  onOpenArticles(event) {
    const { articles } = this.props
    if (articles && articles.length > 0) {
      confirmDialog(`Open ${articles.length} tabs in your browser?`).then(
        () => {
          articles.map(article => {
            if (article.url) {
              window.open(article.url, '_blank')
            }
          })
        },
        () => {}
      )
    }
  }

  renderInterface(tag) {
    if (!_.isEmpty(tag.title)) {
      return null
    } else {
      return (
        <div>
          <ul className="tag-toolbar">
            <li className="waves-effect waves-light" onClick={this.onAddTag}>
              <a>
                <i className="material-icons">add</i>
              </a>
            </li>
            <li
              className="waves-effect waves-light"
              onClick={ev => this.onActionTag(ev)}
            >
              <a>
                <i className="material-icons">edit</i>
              </a>
            </li>

            <li className="waves-effect waves-light" onClick={this.onDeleteTag}>
              <a>
                <i className="material-icons">delete</i>
              </a>
            </li>
          </ul>
        </div>
      )
    }
  }

  renderArticleEditForm() {
    const { article_edit_flag } = this.props
    if (!article_edit_flag) {
      return null
    }
    return <ArticleEdit />
  }

  onAddTag = () => {
    this.props.editTag()
  }
  onDeleteTag = () => {
    const { tag_id, tags, deleteTag } = this.props
    const tag = tags[tag_id]
    if (tag) {
      confirmDialog(`Delete tag ${tag.title}?`).then(
        () => {
          //delete the tag confirmed
          deleteTag(tag)
        },
        () => {
          //console.log('delete cancel')
        }
      )
    }
  }

  onActionTag(event) {
    const { tag_id, tags, editTag } = this.props
    editTag(tags[tag_id])
    event.stopPropagation()
  }

  renderTag() {
    const { tag_id, tags, article_edit_flag } = this.props
    if (!tag_id || article_edit_flag) {
      return null
    }
    const menuInterface = (
      <div className="right">
        <a className="tag-body-interface waves-effect waves-light btn-floating blue">
          <i
            className="material-icons medium "
            onClick={ev => this.onOpenArticles(ev)}
          >
            open_in_browser
          </i>
        </a>
      </div>
    )

    return (
      <div className="tag-header">
        <div className="tag-body-toolbar">
          {menuInterface}
          <h5
            className="tag-body-interface"
            onClick={ev => this.onActionTag(ev)}
          >
            {tags[tag_id].title}
          </h5>
        </div>
        {this.renderInterface(tags[tag_id])}
        <p>{tags[tag_id].description}</p>
      </div>
    )
  }

  componentWillReceiveProps(nextProps) {
    const { tag_id, articles, fetchArticles, fetchArticlesUnbound } = nextProps
    if (!articles) {
      if (tag_id) {
        fetchArticles(tag_id)
      } else {
        fetchArticlesUnbound()
      }
    }
  }

  render() {
    const { articles } = this.props
    return (
      <div className="articles-container">
        {this.renderArticleEditForm()}
        {this.renderTag()}
        {this.renderArticles()}
      </div>
    )
  }
}

function mapStateToProps(store) {
  return {
    articles: store.data.articles,
    tags: store.data.tags,
    tag_id: store.data.current_tag_id,
    article_edit_flag: store.data.article_edit_flag
  }
}

export default connect(mapStateToProps, {
  fetchArticles,
  fetchArticlesUnbound,
  editArticle,
  editTag,
  deleteTag
})(Articles)
