// pruebas/crearProducto.test.js
const { crearProducto } = require('../scr/modulos/productos/controlador'); 
// ajusta la ruta según tu proyecto

describe('Pruebas de crearProducto', () => {
  let req, res, conexion;

  beforeEach(() => {
    req = {
      body: {
        nombre: 'Producto A',
        descripcion: 'Descripción A',
        precio: '100.50',
        stock: 10,
        categoria: 'General'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    conexion = { query: jest.fn() };
    global.conexion = conexion; // tu función usa conexion importada
  });

  test('inserta producto y devuelve datos', async () => {
    conexion.query.mockResolvedValue([{ insertId: 1 }]); // simula insert exitoso

    await crearProducto(req, res);

    expect(conexion.query).toHaveBeenCalledWith(
      'INSERT INTO productos (nombre, descripcion, precio, stock, categoria) VALUES (?, ?, ?, ?, ?)',
      ['Producto A', 'Descripción A', 100.5, 10, 'General']
    );
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      nombre: 'Producto A',
      descripcion: 'Descripción A',
      precio: 100.5,
      stock: 10,
      categoria: 'General'
    });
  });

  test('maneja error de base de datos', async () => {
    conexion.query.mockRejectedValue(new Error('DB error'));

    await crearProducto(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
  });
});

