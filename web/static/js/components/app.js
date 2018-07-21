import React, { Component } from 'react'
import { connect } from 'react-redux'
import TagsProvider from './tags_provider'
import ImportData from './import_data'
import ExporttData from './export_data'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { createSocket, fetchLayout } from '../socket'

class App extends Component {
  componentDidMount() {
    this.props.createSocket()
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.socketConnected) {
      if (nextProps.socketConnected) {
        this.props.fetchLayout()
      }
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div className="container-app">
          <Switch>
            <Route exact path="/app" component={TagsProvider} />
            <Route exact path="/app/import" component={ImportData} />
            <Route exact path="/app/export" component={ExporttData} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

function mapStateToProps(state) {
  return {
    socketConnected: state.channel.socketConnected
  }
}

export default connect(
  mapStateToProps,
  { createSocket, fetchLayout }
)(App)
