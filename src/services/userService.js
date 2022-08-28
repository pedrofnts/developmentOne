const { users } = require("../db/fakeDb");

function service() {
  return {
    getAllUsers(ctx) {
      ctx.body = users;
    },
    getUser(ctx) {
      let userById = users.filter((user) => {
        if (user.id == ctx.params.id) {
          return true;
        }
      });

      if (userById.length) {
        ctx.body = getUser[0];
      } else {
        ctx.response.status = 404;
        ctx.body = "Erro: usuário não encontrado.";
      }
    },
    createUser(ctx) {
      if (
        !ctx.request.body.name ||
        !ctx.request.body.email ||
        !ctx.request.body.age
      ) {
        ctx.response.status = 400;
        ctx.body = "Erro: Preencha todos os campos.";
      } else {
        let newId = users[users.length - 1].id + 1;

        users.push({
          id: newId,
          name: ctx.request.body.name,
          email: ctx.request.body.email,
          age: ctx.request.body.age,
        });
        ctx.response.status = 201;
        ctx.body = `O usuário ${ctx.request.body.name} foi adicionado. Seu ID é ${newId}.`;
      }
    },
    updateUser(ctx) {
      if (
        !ctx.request.body.name ||
        !ctx.request.body.email ||
        !ctx.request.body.age
      ) {
        ctx.response.status = 400;
        ctx.body = "Erro: Preencha todos os campos.";
      }
      const mapId = users.map((user) => user.id);
      const updateIndex = mapId.indexOf(parseInt(ctx.params.id));

      if (updateIndex === -1) {
        ctx.response.status = 404;
        ctx.body = `Erro: Usuário não encontrado.`;
      } else {
        users[updateIndex] = {
          id: Number(ctx.params.id),
          name: ctx.request.body.name,
          email: ctx.request.body.email,
          age: ctx.request.body.age,
        };
        ctx.body = `Usuário ID ${ctx.params.id} atualizado`;
      }
    },
    deleteUser(ctx) {
      const userById = users.find((user) => user.id === Number(ctx.params.id));
      if (!userById) {
        ctx.response.status = 404;
        ctx.body = `Erro: Usuário não encontrado.`;
      } else {
        for (const index in users) {
          if (users[index].id === Number(ctx.params.id)) {
            users.splice(index, 1);
          }
        }
        ctx.response.status = 200;
        ctx.body = `Usuário ${ctx.params.id} foi removido`;
      }
    },
  };
}

module.exports = { service };
