import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Textarea from 'react-textarea-autosize'
import { Row, Col, Button } from 'react-materialize'
import { connect } from 'react-redux'
import { sendTabs } from '../socket'

import { parseUrlsList } from '../helpers'

class ImportData extends Component {
  state = {
    urls: ''
  }

  fileReader = null

  saveTabs = (tag, tabs) => {
    const request_body = {
      tag: tag,
      tabs: tabs
    }
    this.props.sendTabs(request_body, this.props.history)
  }

  handleFileRead = e => {
    const { req_type, tags, unbound_articles } = JSON.parse(
      this.fileReader.result
    )
    if (req_type === 'itemli-layout') {
      if (unbound_articles.length > 0) {
        this.saveTabs({ title: 'import itemli - unbound' }, unbound_articles)
      }
      tags.reverse().forEach(tag => {
        this.saveTabs(
          { title: tag.title, description: tag.description },
          tag.articles
        )
      })
    }
  }

  handleFileChosen = file => {
    this.fileReader = new FileReader()
    this.fileReader.onloadend = this.handleFileRead
    this.fileReader.readAsText(file)
  }

  onFormSubmit = event => {
    event.preventDefault()

    const data = parseUrlsList(this.state.urls)

    data.forEach(list => {
      if (list.urls.length > 0) {
        const request_body = {
          tag: { title: list.title },
          tabs: list.urls.map(tab => {
            return { url: tab.url, title: tab.title }
          })
        }
        // console.log(request_body)
        this.props.sendTabs(request_body, this.props.history)
      }
    })
  }

  onUrlsChange = event => {
    this.setState({ urls: event.target.value })
  }

  render() {
    const className = 'form-import'

    return (
      <div className={className}>
        <h5>Import data manual</h5>

        <input
          type="file"
          id="file"
          className="input-file"
          accept=".txt"
          onChange={e => this.handleFileChosen(e.target.files[0])}
        />

        <form onSubmit={this.onFormSubmit}>
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
                Import from url`s list
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
