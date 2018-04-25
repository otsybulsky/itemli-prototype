import React, { Component } from 'react'
import { connect } from 'react-redux'
import Article from './article'
import { fetchArticles } from '../socket'

import { DragDropContext } from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'

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

  renderInterface() {
    return (
      <div>
        <h5>Articles interface</h5>
        <Button floating icon="add" />
        <hr />
      </div>
    )
  }

  renderTag() {
    const { tag_id, tags } = this.props
    if (!tag_id) {
      return null
    }
    return <h5>{tags[tag_id].title}</h5>
  }

  componentWillReceiveProps(nextProps) {
    const { tag_id, articles, fetchArticles } = nextProps
    if (!articles && tag_id) {
      fetchArticles(tag_id)
    }
  }

  render() {
    const { articles } = this.props
    return (
      <div className="articles-container">
        {this.renderInterface()}
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
    tag_id: store.data.current_tag_id
  }
}

export default connect(mapStateToProps, {
  fetchArticles
})(Articles)
