const hu = { 'Content-Type': 'text/html; charset=utf-8' };
const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE'
};

export default function appSrc(express, bodyParser, createReadStream, crypto, http, m, User) {
  const app = express();

  const LoginRouter = express.Router();
  const CodeRouter = express.Router();
  const SHA1Router = express.Router();
  const ReqRouter = express.Router();
  const InsertRouter = express.Router();

  LoginRouter
  .route('/')
  .all(r => r.res.end('sdimm'));

  CodeRouter
  .route('/')
  .all(r => {
    var data = '';
    var readStream = createReadStream(import.meta.url.substring(7), 'utf-8');
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
      var addr = r.body.addr;
      http.get(addr, (resp) => {
        resp.on('data', (chunk) => { data += chunk; });
        resp.on('end', () => { r.res.end(data)});
      })
    }
  )

  InsertRouter
  .route('/')
  .post(async r => {
    const { login, password, URL } = r.body;
    const newUser = new User({ login, password });
    console.log(URL);
    try {
        await m.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
          await newUser.save();
          r.res.status(201).json({'Добавлено: ': login});
      } catch (e) {
          r.res.status(400).json({'Ошибка при сохранении: ': e});
      }
    } catch (e) {
        r.res.status(400).json({'Ошибка при подключении: ': e});
    }


});

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
  .use('/insert', InsertRouter)
  .use(express.static('.'))
  .use((r, rs, n) => rs.status(200).set(hu) && n())
  .use(({ res: r }) => r.status(404).set(hu).send('sdimm'))
  .use((e, r, rs, n) => rs.status(500).set(hu).send(`Ошибка: ${e}`))
  .set('x-powered-by', false);

  return app;

  
  
}




