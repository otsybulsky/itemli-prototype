import React, { Component } from 'react'
import { connect } from 'react-redux'
import hash from 'object-hash'
import { saveInterface } from '../socket'

class InterfaceProvider extends Component {
  componentWillReceiveProps(nextProps) {
    const { tags } = nextProps
    const hash_new = hash(tags)
    if (hash(this.props.tags) !== hash_new) {
      this.props.saveInterface({
        interface: tags,
        hash: hash_new
      })
    }
  }
  render() {
    return <div>{this.props.children}</div>
  }
}

function mapStateToProps(state) {
  return {
    tags: state.data.tags_three
  }
}

export default connect(mapStateToProps, { saveInterface })(InterfaceProvider)
