// test/complaints.integration.test.js
const request = require('supertest');
const app = require('../../app');
const { Complaint, Entity, Comment, sequelize } = require('../../models');

describe('API de Quejas - Pruebas de Integración', () => {
  let testEntity;
  let testComplaint;

  beforeEach(async () => {
    await Comment.destroy({ where: {} });
    await Complaint.destroy({ where: {} });
    await Entity.destroy({ where: {} });

    testEntity = await Entity.create({ name: 'Entidad Dinámica de Prueba' });
    testComplaint = await Complaint.create({
      description: 'Queja Dinámica de Prueba',
      entity_id: testEntity.id,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/complaints/:id', () => {
    it('debe retornar una queja específica', async () => {
      const res = await request(app).get(`/api/complaints/${testComplaint.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty(
        'description',
        'Queja Dinámica de Prueba'
      );
    });

    it('debe retornar 400 si el ID no es un entero válido', async () => {
      const res = await request(app).get('/api/complaints/texto-invalido');

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].message).toBe('ID de queja inválido');
    });
  });

  describe('POST /api/complaints', () => {
    it('debe crear una nueva queja con datos válidos', async () => {
      const newComplaintData = {
        description: 'Esta es una queja completamente nueva y válida.',
        entity_id: testEntity.id,
      };

      const res = await request(app)
        .post('/api/complaints')
        .send(newComplaintData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty(
        'description',
        newComplaintData.description
      );
      expect(res.body).toHaveProperty('entity_id', testEntity.id);
    });

    it('debe retornar 400 si la descripción es demasiado corta', async () => {
      const newComplaintData = {
        description: 'Corta',
        entity_id: testEntity.id,
      };

      const res = await request(app)
        .post('/api/complaints')
        .send(newComplaintData);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].message).toBe(
        'La descripción debe tener entre 10 y 2000 caracteres'
      );
    });

    it('debe retornar 400 si la entity_id no es un número', async () => {
      const newComplaintData = {
        description: 'Esta es una queja válida.',
        entity_id: 'texto-invalido',
      };

      const res = await request(app)
        .post('/api/complaints')
        .send(newComplaintData);

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].message).toBe('Entity_id debe ser un entero');
    });
  });
});
