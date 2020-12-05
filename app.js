const hu = { 'Content-Type': 'text/html; charset=utf-8' };
const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE'
};

export default function appSrc(express, bodyParser, fs, crypto, http) {
  const app = express();

  const LoginRouter = express.Router();
  const CodeRouter = express.Router();
  const SHA1Router = express.Router();
  const ReqRouter = express.Router();

  LoginRouter
  .route('/')
  .all(r => r.res.end('sdimm'));

  CodeRouter
  .route('/')
  .all(r => {
    var data = '';
    var readStream = fs.createReadStream('./app.js', 'utf8');
    readStream.on('data', function(chunk) {
        data += chunk;
      }).on('end', function() {
        r.res.end(data);
      });
    });

  SHA1Router
  .route('/:input')
  .all(r => {
    r.res.end(crypto.createHash('sha1').update(r.params.input, 'utf8').digest('hex'));
  }); 

  ReqRouter
  .route('/')
  .get(
    r => {
      var data = ''
      var addr = r.query.addr;
      http.get(addr, (resp) => {
        resp.on('data', (chunk) => { data += chunk; });
        resp.on('end', () => { r.res.end(data)});
      })
    }
  )

  ReqRouter
  .route('/')
  .post(
    r => {
      var data = ''
      console.log(r.body);
      var addr = r.body.addr;
      console.log(addr);
      http.get(addr, (resp) => {
        resp.on('data', (chunk) => { data += chunk; });
        resp.on('end', () => { r.res.end(data)});
      })
    }
  )

  app
  .use(function(req, res, next) {
    res.set(CORS);
    next();
  })
  .use( bodyParser.json() )
  .use('/login', LoginRouter)
  .use('/code', CodeRouter)
  .use('/sha1', SHA1Router)
  .use('/req', ReqRouter)
  .use(express.static('.'))
  .use((r, rs, n) => rs.status(200).set(hu) && n())
  .use(({ res: r }) => r.status(404).set(hu).send('sdimm'))
  .use((e, r, rs, n) => rs.status(500).set(hu).send(`Ошибка: ${e}`))
  .set('x-powered-by', false);

  return app;

  
  
}




