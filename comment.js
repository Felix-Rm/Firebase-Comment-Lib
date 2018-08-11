class CommentSys {
  constructor(callback, firebase) {
    this.callback = callback
    this.firebase = firebase
    this.loadedComments = {}

    this.firebase.on('value', (x) => this.showComment(x))
  }



  newComment(info) {
    if (info.first_name.length == 0) {
      info.error_handler('no_first_name')
      return
    }
    if (info.last_name.length == 0) {
      info.error_handler('no_last_name')
      return
    }
    if (info.comment.length == 0) {
      info.error_handler('no_comment')
      return
    }

    var date = new Date()

    if (this.cnf.date_format == 1)
      info.date = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
    else
      info.date = (date.getMonth() + 1) + '.' + date.getDate() + '.' + date.getFullYear()

    var key = date.getFullYear() + ':' + (date.getMonth() + 1) + ':' + date.getDate() + '-' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds()
    info.key = key
    delete info.error_handler
    this.ref.child(key).set(info)

  }

  showComment(x) {
    var data = x.val()
    for (var comment in data) {
      if (this.loadedComments[comment] == null) {
        this.loadedComments[comment] = data[comment]
        this.callback(data[comment])
      }
    }
  }


}