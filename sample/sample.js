const {detectFaces} = require('../facedetection')
const path = require('path')

const image = path.normalize(`${__dirname}\\sample.jpg`)

detectFaces(image)
  .then(faces => console.log(`We found ${faces} face${faces > 1 ? 's' : ''}!`))
