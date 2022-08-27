//Voce deve rodar os testes usando:  npm test
//Para testar a aplicação, rode: npm run dev

//mais infos
//https://github.com/ZijianHe/koa-router

// todas as configuraçoes devem ser passadas via environment variables
const PORT = process.env.PORT || 3000;

const Koa = require("koa");
const Router = require("koa-router");
const koaBody = require("koa-body");

const koa = new Koa();
var router = new Router();

koa.use(koaBody());

let users = require("./controllers/userController");
//rota simples pra testar se o servidor está online

router.get("/", async (ctx) => {
  ctx.body = `Seu servidor esta rodando em http://localhost:${PORT}`; //http://localhost:3000/
});

koa.use(users.routes());
//koa.use(router.routes()).use(router.allowedMethods());

const server = koa.listen(PORT);

module.exports = server;
