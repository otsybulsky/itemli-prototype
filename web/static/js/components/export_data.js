import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Textarea from 'react-textarea-autosize'
import { Row, Col, Button } from 'react-materialize'
import { connect } from 'react-redux'

class ExportData extends Component {
  onFormSubmit = event => {
    event.preventDefault()
  }

  render() {
    const className = 'form-export'

    return (
      <div className={className}>
        <h5>Export all data</h5>
        <form onSubmit={this.onFormSubmit}>
          <h6>Layout</h6>
          <Textarea minRows={10} />
          <Row>
            <Col s={12} className="right-align">
              <Button className="waves-effect waves-light" type="submit">
                Export data
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
  {}
)(ExportData)
