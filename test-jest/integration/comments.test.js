// test/comments.integration.test.js
const request = require('supertest');
const express = require('express');
const router = require('../../routes/comments');
const { Comment, Complaint, Entity } = require('../../models');

const app = express();
app.use(express.json());
app.use('/api', router);

describe('Integración completa GET /api/complaint/:id', () => {
  let testEntity;
  let testComplaint;

  beforeEach(async () => {
    await Comment.destroy({ truncate: true, cascade: true, force: true });
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

      await Comment.create({
        complaint_id: testComplaint.id,
        message: 'Comentario de prueba',
      });
    } catch (error) {
      console.error('Error creating test data:', error);
      throw error;
    }
  });

  it('retorna comentarios reales de la base de datos', async () => {
    const res = await request(app).get('/api/complaint/' + testComplaint.id);

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

describe('Integración completa POST /api/complaint/:id', () => {
  let testEntity;
  let testComplaint;

  beforeEach(async () => {
    await Comment.destroy({ truncate: true, cascade: true, force: true });
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

  it('crea un comentario válido', async () => {
    const res = await request(app)
      .post('/api/complaint/' + testComplaint.id)
      .send({ message: 'Nuevo comentario de prueba' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Nuevo comentario de prueba');

    const commentInDb = await Comment.findOne({
      where: {
        complaint_id: testComplaint.id,
        message: 'Nuevo comentario de prueba',
      },
    });
    expect(commentInDb).not.toBeNull();
  });

  it('retorna 400 si el ID no es numérico', async () => {
    const res = await request(app)
      .post('/api/complaint/abc')
      .send({ message: 'Comentario inválido' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].message).toBe('ID de queja inválido');
  });

  it('retorna 400 si el mensaje está vacío', async () => {
    const res = await request(app)
      .post('/api/complaint/' + testComplaint.id)
      .send({ message: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].message).toBe('El mensaje no puede estar vacío');
  });
});
