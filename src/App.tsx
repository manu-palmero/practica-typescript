import {
  useEffect,
  useState,
  type FormEvent,
  type SyntheticEvent,
} from "react";

type Pais = "ARGENTINA" | "CHILE" | "URUGUAY" | "MEXICO" | "ESPANA";

type Modalidad = "PRESENCIAL" | "VIRTUAL" | "HIBRIDO";

type Tecnologia = "REACT" | "ANGULAR" | "VUE" | "NODE" | "PYTHON" | "JAVA";

type Nivel = "PRINCIPIANTE" | "INTERMEDIO" | "AVANZADO";

interface Participante {
  id: string;
  nombre: string;
  email: string;
  edad: number;
  pais: Pais;
  modalidad: Modalidad;
  tecnologias: Tecnologia[];
  nivel: Nivel;
  aceptaTerminos: boolean;
}

function Participantes({ lista }: { lista: Participante[] }) {
  return (
    <>
      <ul className="participante">
        {lista.map((p) => (
          <div key={p.id}>
            <li>{p.nombre}</li>
            <li>{p.pais}</li>
            <p></p>
            <li>Modalidad: {p.modalidad}</li>
            <li>Nivel: {p.nivel}</li>
            <p>Tecnologías</p>
            <li>{p.tecnologias.join(" - ")}</li>
          </div>
        ))}
      </ul>
    </>
  );
}

function App() {

  // DEFINIR PARTICIPANTES CON USESTATE
  const [participantes, setParticipantes] = useState<Participante[]>(() => {
    return obtenerParticipantes();
  });

  // FILTRADO
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroModalidad, setFiltroModalidad] = useState("ALL");
  const [filtroNivel, setFiltroNivel] = useState("ALL");

  const participantesFiltrados = participantes.filter((p) => {
    // 1. Comprobar el nombre, lo convierte todo a minúsculas
    const coincideNombre = p.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    if (coincideNombre === false) {
      return false;
    }

    // 2. Comprobar modalidad: si el filtro no es "Todas" Y es distinto al del participante, se descarta
    if (filtroModalidad !== "ALL" && p.modalidad !== filtroModalidad) {
      return false;
    }

    // 3. Comprobar nivel: si el filtro no es "Todas" Y es distinto al del participante, se descarta
    if (filtroNivel !== "ALL" && p.nivel !== filtroNivel) {
      return false;
    }

    // Si el código llega aquí, es porque superó todos los filtros anteriores
    return true;
  });

  // GUARDAR PARTICIPANTES
  function guardarParticipantes(participantes: Participante[]) {
    const serializado = JSON.stringify(participantes);
    console.log("usuario nuevo: ", serializado);
    localStorage.setItem("participantes", serializado);
  }

  // OBTENER PARTICIPANTES
  function obtenerParticipantes() {
    const participantesGuardados = localStorage.getItem("participantes");
    if (participantesGuardados && participantesGuardados.length > 0) {
      return JSON.parse(participantesGuardados);
    } else {
      return [];
    }
  }

  // GUARDAR FORMULARIO
  function enviarFormulario(evento: SyntheticEvent<HTMLFormElement>) {
    evento.preventDefault();
    const form = evento.currentTarget;
    const datos = new FormData(form);

    const nuevo: Participante = {
      id: crypto.randomUUID(),
      nombre: datos.get("nombre") as string,
      email: datos.get("email") as string,
      edad: Number(datos.get("edad")),
      pais: datos.get("pais") as Pais,
      modalidad: datos.get("modalidad") as Modalidad,
      nivel: datos.get("nivel") as Nivel,
      tecnologias: datos.getAll("tecnologias") as Tecnologia[],
      aceptaTerminos: datos.get("terminos") === "on",
    };

    setParticipantes([...participantes, nuevo]);
    guardarParticipantes(participantes);
    form.reset();
  }

  return (
    <>
      <header>
        <h3>Registro de participantes</h3>
      </header>

      <p>Participantes registrados: {participantes.length}</p>

      <form onSubmit={enviarFormulario}>
        <input required name="nombre" placeholder="Nombre" />
        <input required name="email" type="email" placeholder="Email" />
        <input required name="edad" type="number" placeholder="Edad" />

        <select name="pais" defaultValue="ARGENTINA">
          <option value="ARGENTINA">Argentina</option>
          <option value="CHILE">Chile</option>
          <option value="URUGUAY">Uruguay</option>
          <option value="MEXICO">México</option>
          <option value="ESPANA">España</option>
        </select>

        <fieldset>
          <legend>Modalidad</legend>
          <label>
            <input
              type="radio"
              name="modalidad"
              value="PRESENCIAL"
              defaultChecked
            />{" "}
            Presencial
          </label>
          <label>
            <input type="radio" name="modalidad" value="VIRTUAL" /> Virtual
          </label>
          <label>
            <input type="radio" name="modalidad" value="HIBRIDO" /> Híbrido
          </label>
        </fieldset>

        <fieldset>
          <legend>Tecnologías</legend>
          <label>
            <input type="checkbox" name="tecnologias" value="REACT" /> React
          </label>
          <label>
            <input type="checkbox" name="tecnologias" value="ANGULAR" /> Angular
          </label>
          <label>
            <input type="checkbox" name="tecnologias" value="VUE" /> Vue.js
          </label>
          <label>
            <input type="checkbox" name="tecnologias" value="NODE" /> Node.js
          </label>
          <label>
            <input type="checkbox" name="tecnologias" value="PYTHON" /> Python
          </label>
          <label>
            <input type="checkbox" name="tecnologias" value="JAVA" /> Java
          </label>
        </fieldset>

        <select name="nivel">
          <option value="PRINCIPIANTE">Principiante</option>
          <option value="INTERMEDIO">Intermedio</option>
          <option value="AVANZADO">Avanzado</option>
        </select>

        <label>
          <input required type="checkbox" name="terminos" /> Acepto términos
        </label>
        <button type="submit">Registrar</button>
      </form>

      <div className="filtros">
        <input
          type="text"
          name="filtro-nombre"
          id="filtro-nombre"
          placeholder="Nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
        <select 
          name="filtro-modalidad" 
          id="filtro-modalidad"
          value={filtroModalidad}
          onChange={(e) => setFiltroModalidad(e.target.value)}
        >
          <option value="ALL">Todas</option>
          <option value="PRESENCIAL">Presencial</option>
          <option value="VIRTUAL">Virtual</option>
          <option value="HIBRIDO">Híbrido</option>
        </select>
        <select 
          name="filtro-nivel" 
          id="filtro-nivel"
          value={filtroNivel}
          onChange={(e) => setFiltroNivel(e.target.value)}
        >
          <option value="ALL">Todas</option>
          <option value="PRINCIPIANTE">Principiante</option>
          <option value="INTERMEDIO">Intermedio</option>
          <option value="AVANZADO">Avanzado</option>
        </select>
      </div>
      <Participantes lista={participantesFiltrados} />
    </>
  );
}

export default App;
