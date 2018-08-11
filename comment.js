class CommentSys {
  constructor(config) {
    this.cnf = config
    this.ref = config.ref

    if (config.use_built_in) {
      this.addUi()
      this.loadCommentsBuidIn()
    }
  }

  newCommentFromBuiltInUI(x) {
    var info = {
      first_name: document.getElementById('cmsys-input1').value,
      last_name: document.getElementById('cmsys-input2').value,
      comment: document.getElementById('cmsys-textarea').value,
      error_handler: this.errorFromBuildInUI
    }

    document.getElementById('cmsys-input1').lang = ''
    document.getElementById('cmsys-input2').lang = ''
    document.getElementById('cmsys-textarea').lang = ''
    this.newComment(info)
  }

  errorFromBuildInUI(error) {
    switch (error) {
    case 'no_first_name':
      document.getElementById('cmsys-input1').lang = 'error'
      break;
    case 'no_last_name':
      document.getElementById('cmsys-input2').lang = 'error'
      break;
    case 'no_comment':
      document.getElementById('cmsys-textarea').lang = 'error'
      break;
    }
  }

  getCommentList() {
    var ref = this.ref
    return new Promise(function (resolve, reject) {
      ref.once('value')
        .then((x) => {
          resolve(x.val())
        })
        .catch((x) => {
          reject(x)
        })
    });
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
    delete info.error_handler
    this.ref.child(key).set(info)

    location.reload()
  }

  async loadCommentsBuidIn() {
    var wrapper = document.createElement('div')
    wrapper.id = 'cmsys-comment-wrapper'
    this.cnf.comment_wrapper.appendChild(wrapper)

    var list = await this.getCommentList()
    for (var comment in list) {
      var current = list[comment]
      this.addComment(current, wrapper)
    }
  }

  addComment(current, wrapper) {
    var main = document.createElement('div')
    main.className = 'cmsys-comment'
    main.innerHTML = `
    <b>${current.first_name + ' ' + current.last_name + ' (' + current.date + ')'}</b>
    <p>${current.comment}</p>
    `
    wrapper.appendChild(main)
  }

  addUi() {
    var mtbl = document.createElement('table')
    var mtr1 = document.createElement('tr')
    var mtr2 = document.createElement('tr')
    var mtd1 = document.createElement('td')
    var mtd2 = document.createElement('td')
    var mtd3 = document.createElement('td')
    var mtd4 = document.createElement('td')
    var inp1 = document.createElement('input')
    var inp2 = document.createElement('input')
    var txta = document.createElement('textarea')
    var mbtn = document.createElement('button')

    mtbl.id = 'cmsys-ui-wrapper'
    mtr1.id = 'cmsys-row1'
    mtr2.id = 'cmsys-row2'

    mtd1.id = 'cmsys-td1'
    mtd2.id = 'cmsys-td2'
    mtd3.id = 'cmsys-td3'
    mtd4.id = 'cmsys-td4'

    inp1.className = 'cmsys-ui'
    inp1.id = 'cmsys-input1'
    inp2.className = 'cmsys-ui'
    inp2.id = 'cmsys-input2'
    txta.className = 'cmsys-ui'
    txta.id = 'cmsys-textarea'
    mbtn.className = 'cmsys-ui'
    mbtn.id = 'cmsys-button'

    mbtn.onclick = () => this.newCommentFromBuiltInUI(mbtn)

    mtd3.colSpan = "3"

    inp1.placeholder = this.cnf.ui.placeholder1
    inp2.placeholder = this.cnf.ui.placeholder2
    txta.placeholder = this.cnf.ui.placeholder3
    mbtn.innerHTML = this.cnf.ui.submit

    mtd1.appendChild(inp1)
    mtd2.appendChild(inp2)
    mtd3.appendChild(txta)
    mtd4.appendChild(mbtn)

    mtr1.appendChild(mtd1)
    mtr1.appendChild(mtd2)
    mtr1.appendChild(mtd4)
    mtr2.appendChild(mtd3)

    mtbl.appendChild(mtr1)
    mtbl.appendChild(mtr2)


    this.cnf.ui_wrapper.appendChild(mtbl)
  }


}