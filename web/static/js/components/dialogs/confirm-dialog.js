import React, { Component } from 'react'
import { confirmable } from 'react-confirm'
import Button from 'material-ui/Button'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'

class ConfirmDialog extends Component {
  state = {
    open: true
  }

  closeDialog = () => {
    this.setState({ open: false })
  }

  handleCancel = () => {
    this.closeDialog()
    this.props.cancel()
  }
  handleOk = () => {
    this.closeDialog()
    this.props.proceed()
  }

  render() {
    const { title, message, proceed, cancel } = this.props

    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary" autoFocus>
              Cancel
            </Button>
            <Button onClick={this.handleOk} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default confirmable(ConfirmDialog)
