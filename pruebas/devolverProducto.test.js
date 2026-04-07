
const { devolverProducto } = require('../scr/modulos/devoluciones/controlador'); 
// ajusta la ruta según tu proyecto

describe('Pruebas de devolverProducto', () => {
  let req, res, conexion;

  beforeEach(() => {
    req = { body: { productoId: 1, cantidad: 3 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    conexion = { query: jest.fn() };
    global.conexion = conexion; // tu función usa conexion global
  });

  test('devuelve error si faltan datos', async () => {
    req.body = {}; // sin productoId ni cantidad
    await devolverProducto(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Faltan datos: productoId o cantidad' });
  });

  test('actualiza stock y confirma devolución', async () => {
    conexion.query.mockResolvedValue([{}]); // simula query exitosa
    await devolverProducto(req, res);
    expect(conexion.query).toHaveBeenCalledWith(
      'UPDATE productos SET stock = stock + ? WHERE id = ?',
      [3, 1]
    );
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      productoId: 1,
      cantidad: 3,
      mensaje: 'Devolución registrada (sin historial en BD)'
    });
  });

  test('maneja error de base de datos', async () => {
    conexion.query.mockRejectedValue(new Error('DB error'));
    await devolverProducto(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ ok: false, error: expect.any(String) });
  });
});

