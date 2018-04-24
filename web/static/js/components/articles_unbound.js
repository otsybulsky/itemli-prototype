import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchArticlesUnbound } from '../socket'

class ArticlesUnbound extends Component {
  onFetchUnboundArticles() {
    this.props.fetchArticlesUnbound()
    event.stopPropagation()
  }

  render() {
    const { articles_without_tag_count } = this.props
    return (
      <div
        className="articles-unbound"
        onClick={ev => this.onFetchUnboundArticles(ev)}
      >
        Articles unbound ({articles_without_tag_count})
      </div>
    )
  }
}

ArticlesUnbound.propTypes = {
  articles_without_tag_count: PropTypes.number.isRequired
}

export default connect(null, { fetchArticlesUnbound })(ArticlesUnbound)
