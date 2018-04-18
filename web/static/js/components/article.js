import React, { Component } from 'react'
import { connect } from 'react-redux'

class Article extends Component {
  render() {
    const {
      article: { title, favicon, url }
    } = this.props
    return (
      <div>
        <img className="favicon" src={favicon} />
        <h6>{title}</h6>
        <p>{url}</p>
      </div>
    )
  }
}

export default connect()(Article)
