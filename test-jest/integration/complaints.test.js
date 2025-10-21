// test/comments.integration.test.js
const request = require('supertest');
const express = require('express');
const router = require('../../routes/quejas');
const { Complaint, Entity } = require('../../models');

const app = express();
app.use(express.json());
app.use('/api', router);

describe('Integración completa GET /api/complaint/:id', () => {
  let testEntity;
  let testComplaint;
  beforeEach(async () => {
    await Complaint.destroy({ truncate: true, cascade: true, force: true });
    await Entity.destroy({ truncate: true, cascade: true, force: true });

    try {
      testEntity = await Entity.create({
        name: 'Entidad de prueba',
      });

      testComplaint = await Complaint.create({
        description: 'Queja de prueba',
        entity_id: testEntity.id,
      });
    } catch (error) {
      console.error('Error creating test data:', error);
      throw error;
    }
  });

  it('retorna quejas reales de la base de datos', async () => {
    const res = await request(app).get('/api/' + testComplaint.id);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('description', 'Queja de prueba');
  });

  it('retorna 400 si el ID no es numérico', async () => {
    const res = await request(app).get('/api/abc');

    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].message).toBe('ID de queja inválido');
  });
});
