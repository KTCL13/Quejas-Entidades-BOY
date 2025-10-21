// test/comments.test.js
const request = require('supertest');
const app = require('../../app');
const { Comment, Complaint, Entity, sequelize } = require('../../models');

describe('API de Comentarios - Pruebas de Integración', () => {
  let testEntity;
  let testComplaint;

  beforeEach(async () => {
    await Comment.destroy({ where: {} });
    await Complaint.destroy({ where: {} });
    await Entity.destroy({ where: {} });

    testEntity = await Entity.create({ name: 'Entidad Dinámica' });
    testComplaint = await Complaint.create({
      description: 'Queja Dinámica de Prueba',
      entity_id: testEntity.id,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/comments/complaint/:id', () => {
    it('debe crear un nuevo comentario para una queja válida', async () => {
      const newCommentData = {
        message: 'Este es un comentario totalmente nuevo',
      };

      const res = await request(app)
        .post(`/api/comments/complaint/${testComplaint.id}`)
        .send(newCommentData);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe(newCommentData.message);
      expect(res.body.complaint_id).toBe(testComplaint.id);
    });

    it('debe retornar 400 si el mensaje del comentario está vacío', async () => {
      const invalidCommentData = { message: '' };

      const res = await request(app)
        .post(`/api/comments/complaint/${testComplaint.id}`)
        .send(invalidCommentData);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/comments/complaint/:id', () => {
    it('debe retornar los comentarios de una queja específica', async () => {
      await Comment.create({
        message: 'Comentario específico para la prueba GET',
        complaint_id: testComplaint.id,
      });

      const res = await request(app).get(
        `/api/comments/complaint/${testComplaint.id}`
      );

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].message).toBe(
        'Comentario específico para la prueba GET'
      );
    });
  });
});
