import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class ArticlesUnbound extends Component {
  render() {
    const { articles_without_tag_count } = this.props
    return (
      <div className="articles-unbound">
        Articles unbound ({articles_without_tag_count})
      </div>
    )
  }
}

ArticlesUnbound.propTypes = {
  articles_without_tag_count: PropTypes.number.isRequired
}

export default connect()(ArticlesUnbound)
