import { useState } from "react";

function Modalidades() {
  return (
      <fieldset>
        <legend>Modalidad</legend>

        <label>
          <input type="radio" name="modalidad" value="PRESENCIAL" />
          Presencial
        </label>
        <label>
          <input type="radio" name="modalidad" value="VIRTUAL" />
          Virtual
        </label>
        <label>
          <input type="radio" name="modalidad" value="HIBRIDO" />
          Híbrido
        </label>
      </fieldset>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <header>
        <h3>Registro de participantes</h3>
      </header>
      <p>Participantes registrados</p>
      <form>
        <input type="text" name="nombre" id="nombre" placeholder="Nombre" />
        <input type="email" name="email" id="email" placeholder="Email" />
        <input type="number" name="edad" id="edad" placeholder="Edad" />
        <select name="pais" id="pais">
          <option value="ar" selected>
            Argentina
          </option>
          <option value="cl">Chile</option>
          <option value="ur">Uruguay</option>
          <option value="mx">México</option>
          <option value="es">España</option>
        </select>
        
        <Modalidades/>

        <fieldset>
          <legend>Tecnologías</legend>
          <label>
            <input type="checkbox" name="tecnologias" value="REACT" />
            React
          </label>
          <label>
            <input type="checkbox" name="tecnologias" value="ANGULAR" />
            Angular
          </label>
          <label>
            <input type="checkbox" name="tecnologias" value="VUE" />
            Vue.js
          </label>
          <label>
            <input type="checkbox" name="tecnologias" value="NODE" />
            Node.js
          </label>
          <label>
            <input type="checkbox" name="tecnologias" value="PYTHON" />
            Python
          </label>
          <label>
            <input type="checkbox" name="tecnologias" value="JAVA" />
            Java
          </label>
        </fieldset>
        <select name="nivel" id="nivel">
          <option value="PRINCIPIANTE">Principiante</option>
          <option value="INTERMEDIO">Intermedio</option>
          <option value="AVANZADO">Avanzado</option>
        </select>
        <label>
          <input type="checkbox" name="terminos" id="terminos" />
          Acepto términos
        </label>
        <button type="submit">Registrar</button>
      </form>
      <div className="filtros">
        <input
          type="text"
          name="filtro-nombre"
          id="filtro-nombre"
          placeholder="Nombre"
        />
        <select name="filtro-modalidad" id="filtro-modalidad"></select>
      </div>
    </>
  );
}

export default App;
