import React, { Component } from 'react'
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'

import { dragElementStart, dragElementEnd } from '../actions'
import DropInterfaceTag from './drop_interface_tag'

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
}

const itemSource = {
  beginDrag(props, monitor, component) {
    //console.log('---begin drag from', props.tag, props)
    const item = { tag: props.tag }
    return item
  },
  endDrag(props, monitor) {
    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()

    if (dropResult) {
      //console.log('---end drag', props.tag)
    }
  }
}

const itemTarget = {
  drop(props, monitor, component) {
    const source = monitor.getItem()
    console.log('drop target', props.tag, source.tag)
  }
}

@DropTarget('TAG', itemTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource('TAG', itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
class Tag extends Component {
  componentDidMount() {
    const img = new Image()
    img.src = 'images/icons8-add-tag-48.png'
    img.onload = () => this.props.connectDragPreview(img)
  }

  componentWillReceiveProps(nextProps) {
    const { isDragging } = this.props
    if (nextProps.isDragging != isDragging) {
      switch (nextProps.isDragging) {
        case true:
          this.props.dragElementStart()
          break
        default:
          this.props.dragElementEnd()
          break
      }
    }
  }

  renderDropInterface() {
    const { tag, renderDropInterface } = this.props
    if (!renderDropInterface) {
      return null
    }

    return <DropInterfaceTag key={tag.id + '_1'} tag={tag} />
  }

  render() {
    const { tag, isDragging, connectDragSource, connectDropTarget } = this.props
    const opacity = isDragging ? 0 : 1

    return connectDragSource(
      connectDropTarget(
        <div>
          <div style={{ ...style, opacity }} className="tag">
            <div>
              <h6>the tag - {tag.title}</h6>
            </div>
            {this.renderDropInterface()}
          </div>
        </div>
      )
    )
  }
}

function mapStateToProps(state) {
  return {
    renderDropInterface: state.interface.renderDropInterface
  }
}

export default connect(mapStateToProps, { dragElementStart, dragElementEnd })(
  Tag
)
