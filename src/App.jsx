import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [utiles, setUtiles] = useState([]) // Aquí guardamos la lista de útiles
  const [nuevoUtil, setNuevoUtil] = useState({
    nombre: '',
    categoria: '',
    stock: '',
    ubicacion: '',
    precio_venta: ''
  })

  // 1. Cargar inventario al iniciar
  useEffect(() => {
    fetchInventario()
  }, [])

  async function fetchInventario() {
    const { data, error } = await supabase
      .from('inventario_utiles')
      .select('*')
      .order('id', { ascending: false }) // Los más nuevos primero

    if (error) console.log('Error cargando:', error)
    else setUtiles(data)
  }

  // 2. Manejar cambios en el formulario
  function handleChange(e) {
    setNuevoUtil({
      ...nuevoUtil,
      [e.target.name]: e.target.value
    })
  }

  // 3. Guardar en Supabase
  async function handleSubmit(e) {
    e.preventDefault()
    
    // Validación simple
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
      fetchInventario() // Recargar la lista
      // Limpiar formulario
      setNuevoUtil({ nombre: '', categoria: '', stock: '', ubicacion: '', precio_venta: '' })
    }
  }

  return (
    <div className="container">
      <h1>📚 Inventario de Útiles</h1>

      {/* Formulario de Registro */}
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

      {/* Tabla de Resultados */}
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