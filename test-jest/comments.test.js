/* eslint-env jest */
const express = require('express');
const request = require('supertest');

jest.mock('../services/comment.service.js', () => ({
  getCommentsByComplaintId: jest.fn(),
  createCommentByComplaintId: jest.fn(),
}));

const {
  getCommentsByComplaintId,
  createCommentByComplaintId,
} = require('../services/comment.service.js');

const router = require('../routes/comments.js');

const app = express();
app.use(express.json());
app.use(router);

describe('Rutas de comentarios', () => {
  describe('POST /complaint/:id', () => {
    it('debería crear un comentario válido', async () => {
      createCommentByComplaintId.mockResolvedValue({ id: 1, message: 'ok' });

      const res = await request(app)
        .post('/complaint/1')
        .send({ message: 'Comentario de prueba' });

      expect(res.status).toBe(201);
      expect(res.text).toBe(JSON.stringify({ id: 1, message: 'ok' }));
    });

    it('debería devolver 400 si falta el mensaje', async () => {
      const res = await request(app).post('/complaint/1').send({});
      expect(res.status).toBe(400);
      expect(res.text).toBe('ID de queja inválido o contenido vacío');
    });

    it('debería devolver 400 si el ID no es numérico', async () => {
      const res = await request(app)
        .post('/complaint/abc')
        .send({ message: 'Comentario inválido' });
      expect(res.status).toBe(400);
      expect(res.text).toBe('ID de queja inválido o contenido vacío');
    });
  });

  describe('GET /complaint/:id', () => {
    it('debería devolver comentarios para un ID válido', async () => {
      getCommentsByComplaintId.mockResolvedValue([
        { id: 1, message: 'comentario test' },
      ]);

      const res = await request(app).get('/complaint/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, message: 'comentario test' }]);
    });

    it('debería devolver 400 para un ID inválido', async () => {
      const res = await request(app).get('/complaint/abc');
      expect(res.status).toBe(400);
      expect(res.text).toBe('ID de queja inválido');
    });
  });
});
