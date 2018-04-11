import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'

const itemTarget = {
  drop(props, monitor, component) {
    const source = monitor.getItem()
    console.log('drop target for create subtag', props.tag, source.tag)
  }
}

@DropTarget('TAG', itemTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
class DropInterfaceTag extends Component {
  render() {
    const { connectDropTarget } = this.props
    return connectDropTarget(<div className="drop-interface-tag">add sub</div>)
  }
}

export default connect()(DropInterfaceTag)
