const app = require('./app');

const port = process.env.PORT || 3001;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`TurboFit360 API rodando em http://localhost:${port}`);
});
