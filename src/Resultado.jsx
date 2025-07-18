import { useContext } from 'react';
import { AuthContext } from './Authcontext';

// aca hago que se permita usar el estado resultado que imprte desde authcontext para poder mostrarlo
const Resultado = () => { 
  const { resultado } = useContext(AuthContext);

  return (
    <div className='container5'>
      {resultado && (
        <div className='resultado'>
          <h3>Consejos de asesoramiento:</h3>
          <p>{resultado}</p>
        </div>
      )}
    </div>
  );
};

export default Resultado;