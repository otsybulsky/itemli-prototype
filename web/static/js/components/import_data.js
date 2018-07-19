import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Textarea from 'react-textarea-autosize'
import { Row, Col, Button } from 'react-materialize'
import { connect } from 'react-redux'
import { sendTabs } from '../socket'

import { parseUrlsList } from '../helpers'

class ImportData extends Component {
  state = {
    title: '',
    urls: ''
  }

  onFormSubmit = event => {
    event.preventDefault()

    const data = parseUrlsList(this.state.urls)

    if (data.urls) {
      const request_body = {
        tag_title: this.state.title,
        tabs: data.urls.map(tab => {
          return { url: tab }
        })
      }

      this.props.sendTabs(request_body, this.props.history)
    }
  }
  onTitleChange = event => {
    this.setState({ title: event.target.value })
  }
  onUrlsChange = event => {
    this.setState({ urls: event.target.value })
  }

  render() {
    const className = 'form-import'

    return (
      <div className={className}>
        <h5>Import data manual</h5>
        <form onSubmit={this.onFormSubmit}>
          <h6>Tag title</h6>
          <Textarea
            autoFocus
            placeholder="type title new tag for url's list"
            value={this.state.title || ''}
            onChange={this.onTitleChange}
          />
          <h6>URL's list</h6>
          <Textarea
            minRows={10}
            placeholder="add url's list"
            value={this.state.urls || ''}
            onChange={this.onUrlsChange}
          />
          <Row>
            <Col s={12} className="right-align">
              <Button className="waves-effect waves-light" type="submit">
                Import data
              </Button>
            </Col>
          </Row>
        </form>
      </div>
    )
  }
}

export default connect(
  null,
  { sendTabs }
)(ImportData)
