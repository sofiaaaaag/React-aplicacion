import { AuthContext } from './AuthContext'
import { useContext } from 'react'
const Resultado = () => {
      const {resultado, setResultado} =useContext(AuthContext)
  return (
              <div className='container5'>
                    {resultado && (
            <div className='resultado'>
              <h3>Consejos:</h3>
              <p>{resultado}</p>
            </div>
          )}
        </div>
  );
};

export default Resultado;   