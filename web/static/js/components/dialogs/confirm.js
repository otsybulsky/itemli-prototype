import { createConfirmation } from 'react-confirm'
import ConfirmDialog from './confirm-dialog'

const confirm = createConfirmation(ConfirmDialog)

export default function(title, option = {}) {
  return confirm({ title, ...option })
}
