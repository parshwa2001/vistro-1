const multer  = require('multer')
const path = require("path")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 5)
    //   req.file.key/ = uniqueSuffix
    // req.file.filename = uniqueSuffix
      cb(null, `${file.fieldname}${uniqueSuffix}${path.extname(file.originalname)}`)
    }
  })
  
  const upload = multer({ storage: storage })
  module.exports = upload