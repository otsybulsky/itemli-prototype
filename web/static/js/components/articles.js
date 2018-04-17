import React, { Component } from 'react'
import { connect } from 'react-redux'

class Articles extends Component {
  render() {
    const { articles } = this.props
    console.log(articles)
    return (
      <div className="articles-container">
        <h3>Articles of ...</h3>
        <p>{JSON.stringify(articles)}</p>
      </div>
    )
  }
}

function mapStateToProps(store) {
  return {
    articles: store.data.articles
  }
}

export default connect(mapStateToProps)(Articles)
