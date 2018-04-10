import React, { Component } from 'react'
import { connect } from 'react-redux'

class Tags extends Component {
  render() {
    return (
      <div>
        <h5>Current tags</h5>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    tags: state.data.tags
  }
}

export default connect(mapStateToProps)(Tags)
