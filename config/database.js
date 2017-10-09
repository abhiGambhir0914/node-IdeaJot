if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://abhi:illberichoneday@ds113775.mlab.com:13775/node-ideajot'}
}else {
  module.exports = {mongoURI: 'mongodb://localhost/vididea-dev'}
}
