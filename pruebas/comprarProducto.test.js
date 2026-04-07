
const { comprar } = require('../scr/modulos/ventas/controlador'); // ajusta la ruta según tu proyecto

describe('Pruebas de comprar', () => {
  let req, res, conexion, carrito;

  beforeEach(() => {
    req = {}; // no usa req.body
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    conexion = { query: jest.fn() };
    carrito = [];

    global.conexion = conexion;
    global.carrito = carrito;
  });

  test('realiza compra con éxito y vacía carrito', async () => {
    carrito.push({ id: 1, cantidad: 2 });
    conexion.query.mockResolvedValue([{}]); // simula actualización exitosa

    await comprar(req, res);

    expect(conexion.query).toHaveBeenCalledWith(
      'UPDATE productos SET stock = stock - ? WHERE id=?',
      [2, 1]
    );
    expect(carrito).toEqual([]); // carrito vacío después de comprar
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Compra realizada con éxito' });
  });

  test('maneja error de base de datos', async () => {
    carrito.push({ id: 1, cantidad: 2 });
    conexion.query.mockRejectedValue(new Error('DB error'));

    await comprar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
  });

  test('compra sin productos en carrito', async () => {
    // carrito vacío
    await comprar(req, res);

    expect(conexion.query).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Compra realizada con éxito' });
  });
});

