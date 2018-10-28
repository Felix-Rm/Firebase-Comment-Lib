class CommentSys {
  constructor(config) {
    this.config = config
    this.loadedComments = {}
    this.config.reference.on('value', (x) => this.displayComment(x.val()))
  }

  displayComment(data) {
    for (var i = data.at + 1; i < this.config.maxStorage; i++) {
      if (this.loadedComments[data[i].id] == null) {
        this.loadedComments[data[i].id] = true
        this.config.addCallback(data[i])
      }
    }
    for (var i = 0; i <= data.at; i++) {
      if (this.loadedComments[data[i].id] == null) {
        this.loadedComments[data[i].id] = true
        this.config.addCallback(data[i])
      }
    }
  }

  async newComment(data) {
    //test if any of the propertys are empty
    if (!data.firstName || !data.firstName.length > 0) {
      this.config.errCallback('no_first_name')
      return
    }
    if (!data.lastName || !data.lastName.length > 0) {
      this.config.errCallback('no_last_name')
      return
    }
    if (!data.text || !data.text.length > 0) {
      this.config.errCallback('no_text')
      return
    }

    //escape '<' and '>' to eliminate html-injections
    data.text = data.text.split('>').join('&gt;').split('<').join('&lt;')
    data.firstName = data.firstName.split('>').join('&gt;').split('<').join('&lt;')
    data.lastName = data.lastName.split('>').join('&gt;').split('<').join('&lt;')

    //create date in the right format
    var date = new Date()
    switch (this.config.dateFormat) {
    case 'de':
      data.date = this.nf(date.getDate(), 2) + '.' + this.nf(date.getMonth() + 1, 2) + '.' + this.nf(date.getFullYear(), 4)
      break;
    default:
      data.date = this.nf(date.getMonth() + 1, 2) + '.' + this.nf(date.getDate(), 2) + '.' + this.nf(date.getFullYear(), 4)
    }

    data.id = Date.now()

    var curBucket = (await this.config.reference.child('at').once('value')).val() || 0
    var newBucket = curBucket + 1 < this.config.maxStorage ? curBucket + 1 : 0
    await this.config.reference.child('at').set(newBucket)
    await this.config.reference.child(newBucket).set(data)
  }

  nf(text, chars) {
    text = text.toString()
    var add = chars - text.length
    for (var i = 0; i < add; i++) {
      text = "0" + text
    }
    return text
  }
}