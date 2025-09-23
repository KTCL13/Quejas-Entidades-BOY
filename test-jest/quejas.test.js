/* eslint-env jest */

const express = require("express");
const request = require("supertest");
process.env.ADMIN_PASS = "admin123";

const router = require("../routes/quejas.js");
const { getEntitiesCache } = require("../config/cache.js");
const { createQueja, getQuejasPaginadasForEntity, deleteComplaint } = require("../services/quejas.service.js");

const sequelize = require("../config/database");

jest.mock("../config/cache.js");
jest.mock("../services/quejas.service.js");

const app = express();
app.use(express.json());
app.use(router);

describe("Rutas de quejas", () => {
  describe("GET /registrar", () => {
    it("debería renderizar con las entidades del cache", async () => {
      getEntitiesCache.mockReturnValue([
        { id_entidad: 1, nombre_entidad: "Entidad A" },
      ]);

      const app = express();
      app.use((req, res, next) => {
        res.render = jest.fn((view, options) => {
          res.json({ view, options });
        });
        next();
      });
      app.use(router);

      const res = await request(app).get("/registrar");

      expect(res.body.view).toBe("registrar");
      expect(res.body.options.entidades).toEqual([
        { id_entidad: 1, nombre_entidad: "Entidad A" },
      ]);
    });
  });

  describe("POST /", () => {
    it("debería crear una queja válida", async () => {
      createQueja.mockResolvedValue({
        id: 1,
        description: "Texto de prueba",
        entity_id: 1,
      });

      const res = await request(app)
        .post("/")
        .send({ texto: "Texto de prueba", entity_id: 1 });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "Queja registrada");
      expect(res.body.data).toEqual({
        id: 1,
        description: "Texto de prueba",
        entity_id: 1,
      });
    });

    it("debería rechazar texto corto", async () => {
      const res = await request(app)
        .post("/")
        .send({ texto: "corto", entity_id: 1 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "La queja debe tener entre 10 y 2000 caracteres."
      );
    });

    it("debería rechazar entity_id inválido", async () => {
      const res = await request(app)
        .post("/")
        .send({
          texto: "Texto válido con más de 10 caracteres",
          entity_id: "abc",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Debe seleccionar una entidad válida."
      );
    });
  });

  describe("GET /", () => {
    it("debería retornar error si no hay entidadId", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Debe seleccionar una entidad válida."
      );
    });

    it("debería retornar quejas paginadas", async () => {
      getQuejasPaginadasForEntity.mockResolvedValue({
        page: 1,
        limit: 10,
        total: 1,
        data: [{ id: 1, description: "Queja test", entity_id: 1 }],
        totalPages: 1,
      });

      const res = await request(app)
        .get("/")
        .query({ entidadId: 1, page: 1, limit: 10 })
        .set("x-recaptcha-token", "fake-token");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        data: [{ id: 1, description: "Queja test", entity_id: 1 }],
        totalPages: 1,
      });
    });
  });

  describe("DELETE /:id", () => {
    it("debería eliminar una queja con la contraseña correcta (200)", async () => {
      deleteComplaint.mockResolvedValue(true);

      const res = await request(app)
        .delete("/1")
        .set("x-admin-pass", process.env.ADMIN_PASS || "admin123");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Queja eliminada correctamente."
      );
    });


    it("después de eliminar una queja, no debería aparecer en el listado", async () => {
      deleteComplaint.mockResolvedValue(true);

      await request(app)
        .delete("/1")
        .set("x-admin-pass", process.env.ADMIN_PASS || "admin123");

      getQuejasPaginadasForEntity.mockResolvedValue({
        page: 1,
        limit: 10,
        total: 0,
        data: [],
        totalPages: 0,
      });

      const res = await request(app)
        .get("/")
        .query({ entidadId: 1, page: 1, limit: 10 })
        .set("x-recaptcha-token", "fake-token");

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it("debería devolver 401 si la contraseña es incorrecta", async () => {
      const res = await request(app)
        .delete("/1")
        .set("x-admin-pass", "clave_invalida");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty(
        "error",
        "Acceso denegado. Credenciales inválidas."
      );
    });

    it("debería devolver 404 si la queja no existe", async () => {
      deleteComplaint.mockResolvedValue(false);

      const res = await request(app)
        .delete("/9999")
        .set("x-admin-pass", process.env.ADMIN_PASS || "admin123");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Queja no encontrada.");
    });
  });
});

afterAll(async () => {
  await sequelize.close();
});
