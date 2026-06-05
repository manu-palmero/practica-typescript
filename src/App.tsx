import {
  useEffect,
  useState,
  type FormEvent,
  type SyntheticEvent,
} from "react";

// TIPOS DE DATOS
type Pais = "ARGENTINA" | "CHILE" | "URUGUAY" | "MEXICO" | "ESPANA";
type Modalidad = "PRESENCIAL" | "VIRTUAL" | "HIBRIDO";
type Tecnologia = "REACT" | "ANGULAR" | "VUE" | "NODE" | "PYTHON" | "JAVA";
type Nivel = "PRINCIPIANTE" | "INTERMEDIO" | "AVANZADO";

// PARTICIPANTE
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

// COMPONENTE DE PARTICIPANTES
function Participantes({ lista }: { lista: Participante[] }) {
  // Lista es un parámetro que requiere un tipo de dato Participante[], se pasa como <Participantes lista={participantesFiltrados} />

  function obtenerColor(nivel: string) {
    if (nivel === "PRINCIPIANTE") {
      return "bg-blue-100";
    }
    if (nivel === "INTERMEDIO") {
      return "bg-yellow-100";
    }
    if (nivel === "AVANZADO") {
      return "bg-red-100";
    }
    return "bg-gray-100";
  }

  return (
    <>
      <ul className="participante grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {lista.map((p) => ( // Recorre los participantes (p) en la lista de participantes (lista)
          <div key={p.id} className={obtenerColor(p.nivel) + " p-2 rounded shadow px-3 py-2"}>
          {/* La key sirve para identificar cada elemento de la lista y mejorar el rendimiento de React */}
            <li>{p.nombre}</li>
            <li>{p.pais}</li>
            {"\n\n"}
            <li>Modalidad: {p.modalidad}</li>
            <li>Nivel: {p.nivel}</li>
            <p>Tecnologías</p>
            <li>{p.tecnologias.join(" - ")}</li> {/* Une los elementos del array con un separador (join) */}
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
    const coincideNombre = p.nombre
      .toLowerCase()
      .includes(filtroNombre.toLowerCase());
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
    const serializado: string = JSON.stringify(participantes); // Convierte de un objeto a un string en formato JSON
    console.log("usuario nuevo: ", serializado); // log en la consola
    localStorage.setItem("participantes", serializado); // establece (crea o actualiza) la variable participantes en el local storage, con los datos de la variable serializado
  }

  // OBTENER PARTICIPANTES
  function obtenerParticipantes() {
    const participantesGuardados = localStorage.getItem("participantes"); // Obtiene los participantes del local storage
    if (participantesGuardados && participantesGuardados.length > 0) { // Si la variable no es nula y tiene al menos un elemento
      return JSON.parse(participantesGuardados); // Convierte de JSON a objeto y lo retorna
    } else { // Si no
      return []; // Retorna una lista vacía
    }
  }

  // GUARDAR FORMULARIO
  function enviarFormulario(evento: SyntheticEvent<HTMLFormElement>) {
    evento.preventDefault(); // Evitar recargar la página al enviar el formulario
    const form = evento.currentTarget; // Obtiene el formulario que disparó el evento
    const datos = new FormData(form); // Extrae los datos del formulario de manera automática y los guarda en datos

    const nuevo: Participante = { // Crea una variable para el participante con los datos obtenidos
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

    setParticipantes([...participantes, nuevo]); // Actualiza la lista de participantes agregando el nuevo registro al final
    guardarParticipantes(participantes);
    form.reset(); // Resetea el formulario
  }

  return (
    <>
      <header>
        <h3 className="bg-green-600 text-white text-4xl p-2 text-center shadow-2xl">
          Registro de participantes
        </h3>
      </header>

      <p>Participantes registrados: {participantes.length}</p>

      <form onSubmit={enviarFormulario} className="grid grid-cols-1 gap-4">
        <div className="grid xl:grid-cols-2 md:grid-cols-1 gap-2">
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
        </div>

        <fieldset className="flex gap-4">
          <legend>Modalidad</legend>
          <label>
            <input
              type="radio"
              name="modalidad"
              value="PRESENCIAL"
              defaultChecked
            />{" "}
            {/* El {" "} se usa para agregar un espacio en blanco */}
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
          {/* Las etiquetas con xl, md o sm representan el tamaño de la pantalla, 
          haciendo referencia a las dimensiones de la pantalla (Large, Medium, Small) */}
          <div className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2">
            <label>
              <input type="checkbox" name="tecnologias" value="REACT" /> React
            </label>
            <label>
              <input type="checkbox" name="tecnologias" value="ANGULAR" />{" "}
              Angular
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
          </div>
        </fieldset>

        <select name="nivel">
          <option value="PRINCIPIANTE">Principiante</option>
          <option value="INTERMEDIO">Intermedio</option>
          <option value="AVANZADO">Avanzado</option>
        </select>

        <label>
          <input required type="checkbox" name="terminos" /> Acepto términos
        </label>
        <button type="submit" className="bg-green-400 rounded">
          Registrar
        </button>
      </form>

      {/* Los value sirven para establecer el valor inicial del input */}
      {/* Los onChange sirven para actualizar el estado cuando el usuario escribe en el input */}
      <div className="filtros flex">
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

      {/* Implementación de la lista de participantes filtrados (componente) */}
      <Participantes lista={participantesFiltrados} />
    </>
  );
}

export default App;
