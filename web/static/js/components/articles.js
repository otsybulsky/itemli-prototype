import React, { Component } from 'react'
import { connect } from 'react-redux'
import Article from './article'
import { fetchArticles, fetchArticlesUnbound } from '../socket'

import { DragDropContext } from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'

import { editArticle } from '../actions'
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
        <h5>Articles interface</h5>
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

  renderTag() {
    const { tag_id, tags } = this.props
    if (!tag_id) {
      return null
    }
    return <h5>{tags[tag_id].title}</h5>
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
  editArticle
})(Articles)
