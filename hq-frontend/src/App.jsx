import { useState } from "react";
import { buscarHQs, salvarNaColecao } from "./api";
import { Link } from "react-router-dom";
import "./App.css";

function Menu() {
  return (
    <nav style={{ marginBottom: "1rem" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>
        🔍 Buscar HQs
      </Link>
      <Link to="/colecao">📚 Minha Coleção</Link>
    </nav>
  );
}

function App() {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const handleBuscar = async () => {
    if (!busca.trim()) return;
    setCarregando(true);
    try {
      const hqs = await buscarHQs(busca);
      setResultados(hqs);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = async (hq) => {
    try {
      const res = await salvarNaColecao(hq);
      setMensagem(res.message);
      setTimeout(() => setMensagem(""), 3000);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  return (
    <div className="container">
      <Menu />
      <h1>Busque sua HQ</h1>

      <input
        className="inputBusca"
        type="text"
        placeholder="Digite o nome da HQ..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
      />
      <button onClick={handleBuscar}>Buscar</button>

      {carregando && <p>Carregando...</p>}
      {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}

      <div style={{ marginTop: "2rem" }}>
        {resultados.map((hq) => (
          <div key={hq.id} className="resultado">
            <h2>
              {hq.volume?.name} #{hq.issue_number}
            </h2>
            {hq.image?.small_url && (
              <img src={hq.image.small_url} alt={hq.name} className="capa" />
            )}
            <p>
              <strong>Título:</strong> {hq.name || "Sem título"}
            </p>
            <p>
              <strong>Data:</strong> {hq.cover_date || "Desconhecida"}
            </p>
            <button onClick={() => handleSalvar(hq)}>Salvar na coleção</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
