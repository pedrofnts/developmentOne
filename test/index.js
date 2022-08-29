const app = require("../src/index.js");

const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const chaiJson = require("chai-json-schema");

chai.use(chaiHttp);
chai.use(chaiJson);

const expect = chai.expect;

const { userSchema } = require("../src/db/fakeDb");
const { runInThisContext } = require("vm");

//Inicio dos testes

//este teste é simplesmente pra enteder a usar o mocha/chai
describe("Um simples conjunto de testes", function () {
  it("deveria retornar -1 quando o valor não esta presente", function () {
    assert.equal([1, 2, 3].indexOf(4), -1);
  });
});

//testes da aplicação
describe("Testes da aplicaçao", () => {
  it("o servidor esta online", function (done) {
    chai
      .request(app)
      .get("/")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("deveria ser uma lista vazia de usuarios", function (done) {
    chai
      .request(app)
      .get("/users")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.eql([]);
        done();
      });
  });

  it("deveria criar o usuario 1", function (done) {
    chai
      .request(app)
      .post("/users")
      .send({ name: "raupp", email: "jose.raupp@devoz.com.br", age: 35 })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.jsonSchema(userSchema.properties);
        done();
      });
  });

  it(`deveria criar 5 usuários`, function () {
    [
      { name: "Clara", email: "clara@devoz.com.br", age: 30 },
      { name: "Pedro", email: "pedro@devoz.com.br", age: 25 },
      { name: "Carlos", email: "carlos@devoz.com.br", age: 55 },
      { name: "Manoel", email: "manoel@devoz.com.br", age: 18 },
      { name: "Leticia", email: "leticia@devoz.com.br", age: 24 },
    ].forEach((value) => {
      chai
        .request(app)
        .post("/users")
        .send(value)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.be.jsonSchema(userSchema.properties);
        });
    });
  });

  it("deveria não permitir a criação de usuário com menos de 18 anos", function (done) {
    chai
      .request(app)
      .post("/users")
      .send({ name: "pedro", email: "pedro@devoz.com.br", age: 17 })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("deveria não permitir a criação de usuário com cadastro incompleto", function (done) {
    chai
      .request(app)
      .post("/users")
      .send({ name: "pedro" })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("deveria não permitir a atualização de usuário com cadastro incompleto", function (done) {
    chai
      .request(app)
      .put("/users/1")
      .send({ name: "pedro" })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("deveria não permitir a atualização de usuário para idade menor que 18 anos", function (done) {
    chai
      .request(app)
      .post("/users")
      .send({ name: "pedro", email: "pedro@devoz.com.br", age: 17 })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("o usuário 10 não existe no sistema", function (done) {
    chai
      .request(app)
      .get("/users/10")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });

  it("o usuario 1 existe e é valido", function (done) {
    chai
      .request(app)
      .get("/users/1")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.jsonSchema(userSchema.properties);
        done();
      });
  });

  it("deveria excluir o usuario 1", function (done) {
    chai
      .request(app)
      .delete("/users/1")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("o usuario 1 não deve existir mais no sistema", function (done) {
    chai
      .request(app)
      .get("/users/1")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });

  it("impossível excluir usuário que não existe", function (done) {
    chai
      .request(app)
      .delete("/users/10")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });

  it("deveria ser uma lista com pelo menos 5 usuarios", function (done) {
    chai
      .request(app)
      .get("/users")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.length).to.be.above(4);
        done();
      });
  });
});
