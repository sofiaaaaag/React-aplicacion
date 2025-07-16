import { useState } from 'react';
import './App.css';
import Resultado from './Resultado';
import { Routes, Route, useLocation,useNavigate,Link } from 'react-router-dom' 
import { AuthContext } from './AuthContext'
import { useContext,useEffect } from 'react'
function App() {
  const [gastos, setGastos] = useState([]);
  const [ingresos, setIngresos] = useState(0);
  const [razon, setRazon] = useState('');
  const [importe, setImporte] = useState(0);
  const [total, setTotal] = useState(0);
  const [restante, setRestante] = useState(0);
  const {resultado, setResultado} =useContext(AuthContext)
  const COHERE_API_KEY = 'mnCMHvzBouRWUkJxAfO8yvhv6WpykDsqfhiSR9Z0';

  function agregar() {
    const nuevoGasto = {
      razon: razon,
      importe: Number(importe)
    };

    const nuevaListaGastos = [...gastos, nuevoGasto];
    setGastos(nuevaListaGastos);

    const suma = nuevaListaGastos.reduce((acumulador, gasto) => acumulador + gasto.importe, 0);
    setTotal(suma);
    setRestante(Number(ingresos) - suma);

    setRazon('');
    setImporte(0);
  }

  const generarConsejos = async () => {
    const textoGastos = gastos
      .map((gasto, i) => `Gasto ${i + 1}: ${gasto.razon} | Monto: $${gasto.importe}`)
      .join('\n');

    const prompt = `
Responde únicamente en español.
Tengo la siguiente lista de gastos:
${textoGastos}
Por favor, generá consejos prácticos para administrar gastos.
    `;

    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt,
          max_tokens: 500,
          temperature: 0.3
        })
      });

      const data = await response.json();
      setResultado(data.generations[0]?.text || 'No se recibió texto.');
    } catch (err) {
      setResultado('Error al generar el resumen: ' + err);
    }
  };

  return (
    <>
      <h1>Mi control de gastos</h1>
      <p className='subtitulo'>
        Acá vas a poder tener un control de tus gastos y también vas a poder pedir asesoría para optimizar tus gastos.
      </p>
      <div className='container'>
        <div className='container1'>
          <h2>Ingrese su total de ingresos:</h2>
          <input
            type='number'
            placeholder='Ej: 1000'
            className='input'
            onChange={(e) => setIngresos(e.target.value)}
          />
          <br />
          <button>Guardar</button>
        </div>

        <div className='container2'>
          <h2>Ingrese sus gastos:</h2>
          <p>Razón del gasto:</p>
          <input
            type='text'
            placeholder='Ej: Alquiler'
            className='input'
            value={razon}
            onChange={(e) => setRazon(e.target.value)}
          />
          <p>Importe del gasto:</p>
          <input
            type='number'
            placeholder='Ej: 200'
            className='input'
            value={importe}
            onChange={(e) => setImporte(e.target.value)}
          />
          <br />
          <button onClick={agregar}>Agregar</button>
        </div>

        <div className='container3'>
          <h2>Lista de gastos:</h2>
          {gastos.length === 0 ? (
            <p>La lista está vacía, ingresá un gasto</p>
          ) : (
            gastos.map((gasto, index) => (
              <div key={index}>
                <p>{gasto.razon}: -${gasto.importe}</p>
              </div>
            ))
          )}
        </div>

        <div className='container4'>
          <h2>Resumen:</h2>
          <h3>Total del presupuesto: ${Number(ingresos).toFixed(2)}</h3>
          <h3>Total de gastos: ${total.toFixed(2)}</h3>
          <h3>Total restante: ${restante.toFixed(2)}</h3>
          <Link to="/resultado" onClick={generarConsejos}>Asesorarme</Link>
        </div>

      </div>

  <Routes>
   
          <Route path="resultado" element={<Resultado />} />
   
  </Routes>
    </>
  );
}

export default App;
