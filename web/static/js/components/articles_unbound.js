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
    const { articles_without_tag_count, selectedTagId } = this.props
    const selectedClass = !selectedTagId ? 'tag-body-selected' : ''
    const classDiv = `articles-unbound ${selectedClass}`
    return (
      <div className={classDiv} onClick={ev => this.onFetchUnboundArticles(ev)}>
        <h6>Articles unbound ({articles_without_tag_count})</h6>
      </div>
    )
  }
}

ArticlesUnbound.propTypes = {
  selectedTagId: PropTypes.string.isRequired,
  articles_without_tag_count: PropTypes.number.isRequired
}

function mapStateToProps(state) {
  return {
    selectedTagId: state.data.current_tag_id
  }
}

export default connect(mapStateToProps, { fetchArticlesUnbound })(
  ArticlesUnbound
)
