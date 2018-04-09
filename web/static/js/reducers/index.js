import { combineReducers } from 'redux'
import TabsReducer from './tabs'
import ChannelReducer from './channel'

const rootReducer = combineReducers({
  tabs: TabsReducer,
  channel: ChannelReducer
})

export default rootReducer
