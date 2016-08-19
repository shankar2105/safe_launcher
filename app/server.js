import express from 'express'

export default () => {
  const app = express();

  app.get('/', function(req, res){
    res.send('hello world');
  });

  app.listen(8100);
}
