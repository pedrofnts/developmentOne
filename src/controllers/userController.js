const Router = require("koa-router");
const { service } = require("../services/userService");

const userService = service();

const router = new Router({
  prefix: "/users",
});

// Listar todos os usuários

router.get("/", (ctx, next) => {
  userService.getAllUsers(ctx);
  next();
});

// Listar usuários por ID

router.get("/:id", (ctx, next) => {
  userService.getUser(ctx);
  next();
});

// Criar usuário

router.post("/", (ctx, next) => {
  userService.createUser(ctx);
  next();
});

// Editar usuário

router.put("/:id", (ctx) => {
  userService.updateUser(ctx);
});

// Apagar Usuário

router.delete("/:id", (ctx) => {
  userService.deleteUser(ctx);
});

module.exports = router;
