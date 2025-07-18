import { useState, useEffect, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from './Authcontext';
import Resultado from './Resultado';
import './App.css';

function App() {
  // Estados para manejar ingresos, gastos y cálculos
  const [gastos, setGastos] = useState(() => JSON.parse(localStorage.getItem('misGastos')) || []);
  const [ingresos, setIngresos] = useState(() => Number(localStorage.getItem('misIngresos')) || 0);
  const [razon, setRazon] = useState('');
  const [importe, setImporte] = useState(0);
  const [total, setTotal] = useState(0);
  const [restante, setRestante] = useState(0);
  const { setResultado } = useContext(AuthContext);
  const navigate = useNavigate();

  const COHERE_API_KEY = 'mnCMHvzBouRWUkJxAfO8yvhv6WpykDsqfhiSR9Z0';

  // aca uso useEffect para guardar los gastos en localStorage y calcular los totales
  useEffect(() => {
    localStorage.setItem('misGastos', JSON.stringify(gastos));
    const suma = gastos.reduce((acc, gasto) => acc + gasto.importe, 0);
    setTotal(suma);
    setRestante(ingresos - suma);
  }, [gastos, ingresos]);

  // se va agregando  un gasto nuevo a la lista
  const agregar = () => {
    if (!razon || importe <= 0) return;
    const nuevoGasto = { razon, importe: Number(importe) };
    setGastos([...gastos, nuevoGasto]);
    setRazon('');
    setImporte(0);
  };

  // aca guardo los ingresos que se vayan agregando en localStorage
  const guardarIngresos = () => {
    localStorage.setItem('misIngresos', ingresos);
    setIngresos(Number(ingresos));
  };
  const generarConsejos = async () => {
    // aca agarro la lista de gastos y la paso a string
    const textoGastos = gastos
      .map((gasto, i) => `Gasto ${i + 1}: ${gasto.razon} | Monto: $${gasto.importe}`)
      .join('\n');

    const prompt = `
Responde únicamente en español.
Tengo la siguiente lista de gastos:
${textoGastos}
Por favor, generá consejos prácticos para administrar gastos.
    `;

    // aca intento hacer fetch a la API con try también pongo que el método es POST y le paso la clave de la api
    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        // aca le paso la configuración que va a tener la respuesta
        body: JSON.stringify({
          model: 'command',
          prompt,
          max_tokens: 500,
          temperature: 0.3,
        }),
      });

      // guardo el resultado en el estado 
      const data = await response.json();
      setResultado(data.generations[0]?.text || 'No se recibió texto.');
      navigate('/resultado');
    } catch (err) {
      setResultado('Error al generar el resumen: ' + err.message);
      navigate('/resultado');
    }
  };

  // componente donde muestro cada gasto en un parrafo
  const GastoItem = ({ razon, importe }) => (
    <p>{razon}: -${importe}</p>
  );
  //aca hago la funcion que va a hacer que cuando se toque el boton de eliminar los valores vuelvan a 0
const reiniciarTodo = () => {
  localStorage.clear();
  setGastos([]);
  setIngresos(0);
  setTotal(0);
  setRestante(0);
};
  return (
    <>
      <h1>Mi control de gastos</h1>
      <p className='subtitulo'>
        Acá vas a poder tener un control de tus gastos y también vas a poder pedir asesoría para administrar tus gastos.
      </p>
      <div className='container'>
        <div className='container1'>
          <h2>Ingrese su total de ingresos:</h2>
          {/* aca uso onChange para actualizar el estado cada vez que hay un cambio */}
          <input
            type='number'
            placeholder='Ej: 1000'
            className='input'
            value={ingresos}
            onChange={(e) => setIngresos(e.target.value)}
          />
          <br />
          <button onClick={guardarIngresos}>Guardar</button>
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
          {/* aca uso map para mostrar cada gasto */}
          {gastos.length === 0 ? (
            <p>La lista está vacía, ingresá un gasto</p>
          ) : (
            gastos.map((gasto, index) => (
              <GastoItem key={index} razon={gasto.razon} importe={gasto.importe} />
            ))
          )}
          <button onClick={ reiniciarTodo}>eliminar</button>
        </div>

        <div className='container4'>
          <h2>Resumen:</h2>
          <h3>Total del presupuesto: ${Number(ingresos).toFixed(2)}</h3>
          <h3>Total de gastos: ${total.toFixed(2)}</h3>
          <h3>Total restante: ${restante.toFixed(2)}</h3>
          {/* aca llamo a la función para generar asesoramiento */}
          <button onClick={generarConsejos}>Asesorarme</button>
        </div>
      </div>

      {/* aca pongo la ruta que va a mostrar el resultado o sea el texto de asesoramiento */}
      <Routes>
        <Route path="/resultado" element={<Resultado />} />
      </Routes>
    </>
  );
}

export default App;