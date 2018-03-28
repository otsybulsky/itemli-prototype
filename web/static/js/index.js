// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware} from 'redux'
import reducers from './reducers'

const createStoreWithMiddleware = applyMiddleware()(createStore)

const App = () => {
    return <div><h4>Hello from React !</h4></div>
}

ReactDOM.render(
    <Provider store={
            createStoreWithMiddleware(reducers,
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //for dev only
        )}>
        <App />
    </Provider>
    , document.querySelector('.application')
)