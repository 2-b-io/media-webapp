import mongoose from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  provider: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  settings: {
    type: mongoose.Schema.Types.Mixed
  }
})


export default mongoose.model('Infrastructure', schema)
