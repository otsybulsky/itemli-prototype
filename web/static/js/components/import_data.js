import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Textarea from 'react-textarea-autosize'
import { Row, Col, Button } from 'react-materialize'

class ImportData extends Component {
  state = {
    title: '',
    urls: ''
  }

  onFormSubmit = event => {
    event.preventDefault()
    //parse urls
    //send data to server
    //receive answer from server
    //if ok - redirect to view the new data
    //else show error message
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

export default ImportData
