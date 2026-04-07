const { listarDevoluciones } = require('../scr/modulos/devoluciones/controlador'); 
// ajusta la ruta según tu proyecto

describe('Pruebas de listarDevoluciones', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn()
    };
  });

  test('devuelve arreglo vacío y mensaje', async () => {
    await listarDevoluciones(req, res);
    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      devoluciones: [],
      mensaje: 'Historial no disponible en este módulo'
    });
  });
});

