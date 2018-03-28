import { combineReducers } from 'redux'

const testReducer = () => { return null }

const rootReducer = combineReducers({
    test: testReducer
})

export default rootReducer