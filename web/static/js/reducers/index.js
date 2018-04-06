import { combineReducers } from 'redux'
import TabsReducer from './tabs'
const rootReducer = combineReducers({
  tabs: TabsReducer
})

export default rootReducer
