import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import './App.css'

function App() {
  const [utiles, setUtiles] = useState([])
  const [nuevoUtil, setNuevoUtil] = useState({
    nombre: '',
    categoria: '',
    stock: '',
    ubicacion: '',
    precio_venta: ''
  })

  useEffect(() => {
    fetchInventario()
  }, [])

  async function fetchInventario() {
    const { data, error } = await supabase
      .from('inventario_utiles')
      .select('*')
      .order('id', { ascending: false })
    if (error) console.log('Error cargando:', error)
    else setUtiles(data)
  }

  function handleChange(e) {
    setNuevoUtil({
      ...nuevoUtil,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nuevoUtil.nombre || !nuevoUtil.stock) {
      alert("El nombre y el stock son obligatorios")
      return
    }

    const { error } = await supabase
      .from('inventario_utiles')
      .insert([{
        nombre: nuevoUtil.nombre,
        categoria: nuevoUtil.categoria,
        stock: parseInt(nuevoUtil.stock),
        ubicacion: nuevoUtil.ubicacion,
        precio_venta: parseFloat(nuevoUtil.precio_venta)
      }])

    if (error) {
      alert('Error guardando: ' + error.message)
    } else {
      alert('¡Útil registrado exitosamente!')
      fetchInventario()
      setNuevoUtil({ nombre: '', categoria: '', stock: '', ubicacion: '', precio_venta: '' })
    }
  }

  // --- NUEVA FUNCIÓN: Generar PDF ---
  function exportarPDF() {
    const doc = new jsPDF()
    
    // Título del PDF
    doc.text("Reporte de Inventario - Útiles", 20, 10)

    // Configuración de la tabla
    const columnas = ["Nombre", "Categoría", "Ubicación", "Stock", "Precio"]
    const filas = utiles.map(item => [
      item.nombre,
      item.categoria,
      item.ubicacion,
      item.stock,
      `S/. ${item.precio_venta}`
    ])

    // Generar tabla automática
    doc.autoTable({
      head: [columnas],
      body: filas,
      startY: 20, // Empieza un poco más abajo del título
    })

    // Descargar archivo
    doc.save("reporte_inventario.pdf")
  }

  return (
    <div className="container">
      <h1>📚 Inventario de Útiles</h1>

      <div className="form-card">
        <h3>Agregar Nuevo Producto</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              name="nombre" 
              placeholder="Nombre del útil (ej. Lápiz 2B)" 
              value={nuevoUtil.nombre}
              onChange={handleChange} 
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <input 
                name="categoria" 
                placeholder="Categoría" 
                value={nuevoUtil.categoria}
                onChange={handleChange} 
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <input 
                name="ubicacion" 
                placeholder="Ubicación" 
                value={nuevoUtil.ubicacion}
                onChange={handleChange} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <input 
                type="number" 
                name="stock" 
                placeholder="Stock" 
                value={nuevoUtil.stock}
                onChange={handleChange} 
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <input 
                type="number" 
                step="0.01" 
                name="precio_venta" 
                placeholder="Precio Venta (S/.)" 
                value={nuevoUtil.precio_venta}
                onChange={handleChange} 
              />
            </div>
          </div>

          <button type="submit">Guardar Producto</button>
        </form>
      </div>

      {/* Cabecera de la tabla con botón de descarga */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
        <h3>Listado Actual</h3>
        {utiles.length > 0 && (
          <button 
            onClick={exportarPDF}
            style={{ 
              backgroundColor: '#28a745', 
              width: 'auto', 
              padding: '10px 15px' 
            }}
          >
            📄 Descargar PDF
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Ubicación</th>
            <th>Stock</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {utiles.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{item.categoria}</td>
              <td>{item.ubicacion}</td>
              <td style={{ fontWeight: 'bold' }}>{item.stock}</td>
              <td>S/. {item.precio_venta}</td>
            </tr>
          ))}
          {utiles.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No hay útiles registrados aún.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App