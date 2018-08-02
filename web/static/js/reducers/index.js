import { combineReducers } from 'redux'
import DataReducer from './data'
import ChannelReducer from './channel'
import InterfaceReducer from './interface'

const rootReducer = combineReducers({
  data: DataReducer,
  channel: ChannelReducer,
  interface: InterfaceReducer
})

export default rootReducer
