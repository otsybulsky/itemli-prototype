import React, { Component } from 'react'
import { connect } from 'react-redux'
import Article from './article'
import { fetchArticles, fetchArticlesUnbound } from '../socket'

import { DragDropContext } from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'

import { editArticle, editTag } from '../actions'
import ArticleEdit from './article_edit'

import { Button } from 'react-materialize'

class Articles extends Component {
  renderArticles() {
    const { articles } = this.props
    if (!articles) {
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
    articles.map(article => {
      if (article.url) {
        window.open(article.url, '_blank')
      }
    })
  }

  renderInterface() {
    return (
      <div>
        <h6>Articles interface</h6>
        <Button onClick={ev => this.onAddArticle(ev)} floating icon="add" />
        <Button
          onClick={ev => this.onOpenArticles(ev)}
          floating
          icon="open_in_browser"
        />
        <hr />
      </div>
    )
  }

  renderArticleEdit() {
    const { article_edit_flag } = this.props
    if (!article_edit_flag) {
      return null
    }
    return <ArticleEdit />
  }

  onActionTag(event) {
    const { tag_id, tags, editTag } = this.props
    editTag(tags[tag_id])
    event.stopPropagation()
  }

  renderTag() {
    const { tag_id, tags } = this.props
    if (!tag_id) {
      return null
    }
    const menuInterface = (
      <div className="tag-body-interface">
        <i className="material-icons">menu</i>
      </div>
    )

    return (
      <div className="tag-header">
        <div className="tag-body-toolbar" onClick={ev => this.onActionTag(ev)}>
          {menuInterface}
          <h5 className="tag-body-interface">{tags[tag_id].title}</h5>
        </div>
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
        {this.renderInterface()}
        {this.renderArticleEdit()}
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
  editTag
})(Articles)
