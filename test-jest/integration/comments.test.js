// test/comments.integration.test.js
const request = require('supertest');
const express = require('express');
const router = require('../../routes/comments');
const { Comment, Complaint, Entity } = require('../../models');
const sequelize = require('../../config/database');

const app = express();
app.use(express.json());
app.use('/api', router);

describe('Integración completa GET /api/complaint/:id', () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: true });
    } catch (error) {
      console.error('Error connecting to the database:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    await Entity.destroy({ truncate: true, cascade: true, force: true });
    await Comment.destroy({ truncate: true, cascade: true, force: true });
    await Complaint.destroy({ truncate: true, cascade: true, force: true });

    try {
      const entity = await Entity.create({
        id: 1,
        name: 'Entidad de prueba',
      });

      const complaint = await Complaint.create({
        id: 123,
        description: 'Queja de prueba',
        entity_id: entity.id,
      });

      await Comment.create({
        complaint_id: complaint.id,
        message: 'Comentario de prueba',
      });
    } catch (error) {
      console.error('Error creating test data:', error);
      throw error;
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('retorna comentarios reales de la base de datos', async () => {
    const res = await request(app).get('/api/complaint/123');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('message', 'Comentario de prueba');
  });

  it('retorna 400 si el ID no es numérico', async () => {
    const res = await request(app).get('/api/complaint/abc');

    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].message).toBe('ID de queja inválido');
  });
});
