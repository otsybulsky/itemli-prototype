import React, { Component } from 'react'
import { connect } from 'react-redux'
import Article from './article'

class Articles extends Component {
  renderArticles() {
    const { articles } = this.props
    return articles.map(article => {
      return <Article article={article} />
    })
  }

  render() {
    const { articles } = this.props
    return <div className="articles-container">{this.renderArticles()}</div>
  }
}

function mapStateToProps(store) {
  return {
    articles: store.data.articles
  }
}

export default connect(mapStateToProps)(Articles)
