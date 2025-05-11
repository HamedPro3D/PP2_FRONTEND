import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebase"; // Importa autenticación y Firestore
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore"; // Funciones para Firestore
import { onAuthStateChanged } from "firebase/auth"; // Verifica el estado de autenticación

export default function MiPerfil() {
  const [proyectos, setProyectos] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // Estado para el usuario autenticado
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica si el usuario está autenticado
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (!usuario) {
        navigate("/login"); // Redirige a login si no hay usuario autenticado
      } else {
        setUser(usuario); // Si el usuario está autenticado, almacénalo
        cargarProyectos(usuario.uid); // Cargar los proyectos del usuario
      }
    });

    return () => unsubscribe(); // Limpieza del listener
  }, [navigate]);

  // Cargar proyectos desde Firestore
  const cargarProyectos = async (uid) => {
    try {
      const proyectosCollection = collection(db, "proyectos");
      const proyectosSnapshot = await getDocs(proyectosCollection);
      const proyectosList = proyectosSnapshot.docs
        .filter((doc) => doc.data().uid === uid) // Filtrar proyectos del usuario actual
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setProyectos(proyectosList);
    } catch (err) {
      console.error("Error al cargar proyectos", err);
    }
  };

  // Crear un nuevo proyecto
  const handleCrearProyecto = async (e) => {
    e.preventDefault();
    if (!titulo || !descripcion) {
      setError("Título y descripción son obligatorios");
      return;
    }

    try {
      const nuevaReferencia = await addDoc(collection(db, "proyectos"), {
        titulo,
        descripcion,
        uid: user.uid, // Asociar el proyecto al UID del usuario
      });
      setProyectos([...proyectos, { id: nuevaReferencia.id, titulo, descripcion }]);
      setTitulo(""); // Limpiar el título
      setDescripcion(""); // Limpiar la descripción
      setError(""); // Limpiar el error
    } catch (err) {
      console.error("Error al crear proyecto", err);
      setError("Hubo un error al crear el proyecto");
    }
  };

  // Eliminar un proyecto
  const handleEliminarProyecto = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      try {
        await deleteDoc(doc(db, "proyectos", id)); // Eliminar proyecto de Firestore
        setProyectos(proyectos.filter((proyecto) => proyecto.id !== id));
      } catch (err) {
        console.error("Error al eliminar proyecto", err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Mi Perfil</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Formulario de crear proyecto */}
        <h3 className="font-semibold mb-2">Crear Proyecto</h3>
        <form onSubmit={handleCrearProyecto} className="mb-4">
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <textarea
            placeholder="Descripción breve"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Crear Proyecto
          </button>
        </form>

        {/* Lista de proyectos */}
        <h3 className="font-semibold mb-2">Mis Proyectos</h3>
        <ul className="space-y-4">
          {proyectos.map((proyecto) => (
            <li key={proyecto.id} className="border p-4 rounded shadow-sm">
              <h4 className="font-bold">{proyecto.titulo}</h4>
              <p>{proyecto.descripcion}</p>
              <button
                onClick={() => handleEliminarProyecto(proyecto.id)}
                className="mt-2 text-red-500"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
  