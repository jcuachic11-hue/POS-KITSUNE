
const { agregarCarrito } = require('../scr/modulos/ventas/controlador.js'); // ajusta la ruta según dónde tengas tu función

describe('Pruebas de agregarCarrito', () => {
  let req, res, conexion, carrito;

  beforeEach(() => {
    // Simulamos req y res
    req = { body: { idProducto: 1, cantidad: '2' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Simulamos la conexión y el carrito
    conexion = { query: jest.fn() };
    carrito = [];

    // Inyectamos mocks globales
    global.conexion = conexion;
    global.carrito = carrito;
  });

  test('devuelve error si cantidad es inválida', async () => {
    req.body.cantidad = '0';
    await agregarCarrito(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Cantidad inválida' });
  });

  test('devuelve error si producto no existe', async () => {
    conexion.query.mockResolvedValue([[]]); // sin filas
    await agregarCarrito(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Producto no encontrado' });
  });

  test('agrega producto al carrito si existe', async () => {
    conexion.query.mockResolvedValue([[{ id: 1, nombre: 'Laptop', precio: 1000 }]]);
    await agregarCarrito(req, res);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Producto agregado al carrito',
      carrito: [{ id: 1, nombre: 'Laptop', precio: 1000, cantidad: 2 }]
    });
  });

  test('maneja error de base de datos', async () => {
    conexion.query.mockRejectedValue(new Error('DB error'));
    await agregarCarrito(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
  });
});

