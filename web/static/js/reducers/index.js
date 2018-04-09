import { combineReducers } from 'redux'
import DataReducer from './data'
import ChannelReducer from './channel'

const rootReducer = combineReducers({
  data: DataReducer,
  channel: ChannelReducer
})

export default rootReducer
