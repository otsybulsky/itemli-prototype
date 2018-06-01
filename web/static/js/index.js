// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import reducers from './reducers'
import App from './components/app'
import LayoutProvider from './components/layout_provider'
import { BrowserRouter } from 'react-router-dom'

const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore)

ReactDOM.render(
  <BrowserRouter>
    <Provider
      store={createStoreWithMiddleware(
        reducers,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__() //for dev only
      )}
    >
      <LayoutProvider>
        <App />
      </LayoutProvider>
    </Provider>
  </BrowserRouter>,
  document.querySelector('.application')
)
