const mongoose = require('mongoose')
const feedingSchema = new mongoose.Schema({
  memberid : String,
  ga: {
    solan: {
      type: Number,
      default: 0
    },
    timechoan: {
      type: Number,
      default: 0
    },
    timechoangannhat: {
      type: Number,
      default: 0
    },
    luutrusanpham: {
      type: Number,
      default: 0
    }
  },
  bo: {
    solan: {
      type: Number,
      default: 0
    },
    timechoan: {
      type: Number,
      default: 0
    },
    timechoangannhat: {
      type: Number,
      default: 0
    },
    luutrusanpham: {
      type: Number,
      default: 0
    }
  },
  heo: {
    solan: {
      type: Number,
      default: 0
    },
    timechoan: {
      type: Number,
      default: 0
    },
    timechoangannhat: {
      type: Number,
      default: 0
    },
    luutrusanpham: {
      type: Number,
      default: 0
    }
  }
})
module.exports = mongoose.model('feedingSchema', feedingSchema);