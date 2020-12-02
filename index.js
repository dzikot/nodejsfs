const [{ Server: h1 }, x] = [require('http'), require('express')];

const [Router, SummerRouter] = [x.Router(), x.Router()];
const PORT = 4321;
const { log } = console;
const hu = { 'Content-Type': 'text/html; charset=utf-8' };
const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers':'cors,my,Content-Type,Accept,Access-Control-Allow-Headers'
};
const app = x();
function summer(r, sum) {
      if ('cors' in r.query) r.res.set(CORS);
      r.res.format({
        'text/html': () => r.res.send(`<h2>Результат от 01.11.2020:<i>${sum}</i></h2>`),
        'application/json': () => r.res.json({"Результат от 01.11.2020:": sum})
      });  
}
Router
  .route('/')
  .get(r => r.res.end('Привет мир!'));
SummerRouter
  .route('/')
  .all(r => {
      const sum = Number(r.query.n1) + Number(r.query.n2);
      return summer(r, sum);
  });
SummerRouter
  .route('/:n1/:n2')
  .all(r => {
      const sum = Number(r.params.n1) + Number(r.params.n2);
      return summer(r, sum);
  });
app
  .use('/summer', SummerRouter)
  .use((r, rs, n) => rs.status(200).set(hu) && n())
  .use(x.static('.'))
  .use('/', Router)
  .use(({ res: r }) => r.status(404).set(hu).send('Пока нет!'))
  .use((e, r, rs, n) => rs.status(500).set(hu).send(`Ошибка: ${e}`))
  /* .set('view engine', 'pug') */
  .set('x-powered-by', false);
module.exports = h1(app)
  .listen(process.env.PORT || PORT, () => log(process.pid));
