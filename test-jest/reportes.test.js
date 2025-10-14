const request = require('supertest');
const express = require('express');
const reportsRouter = require('../routes/reportes');

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue('mockEmailSent'),
    }),
  };
});

describe('Reports Router', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.set('view engine', 'pug');
    app.set('views', './views');

    app.response.render = jest.fn(function (view, options) {
      this.status(200).json({ view, ...options });
    });

    app.use('/api/reports', reportsRouter);
  });

  it('GET /api/reports debe renderizar la vista reportes', async () => {
    const res = await request(app).get('/api/reports');
    expect(res.status).toBe(200);
    expect(res.body.view).toBe('reportes');
    expect(res.body.activePage).toBe('reportes');
  });

  it('GET /api/reports/ver debe enviar correo y renderizar con mensaje de éxito', async () => {
    const res = await request(app).get('/api/reports/ver');
    expect(res.status).toBe(200);
    expect(res.body.view).toBe('reportes');
    expect(res.body.mensaje).toContain('Se envió el correo correctamente');
  });
});
