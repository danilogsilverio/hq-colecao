import { useEffect, useState } from "react";
import { listarColecao, removerHQ } from "./api";
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

function Colecao() {
  const [colecao, setColecao] = useState([]);
  const [mensagem, setMensagem] = useState("");

  const carregarColecao = async () => {
    const dados = await listarColecao();
    setColecao(dados);
  };

  useEffect(() => {
    carregarColecao();
  }, []);

  const handleRemover = async (id) => {
    const confirmacao = window.confirm(
      "Tem certeza que deseja remover esta HQ da coleção?"
    );
    if (!confirmacao) return;

    try {
      const res = await removerHQ(id);
      setMensagem(res.message);
      carregarColecao(); // Atualiza lista
      setTimeout(() => setMensagem(""), 3000);
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao remover HQ");
    }
  };

  return (
    <div className="container">
      <Menu />
      <h1>Minha Coleção</h1>
      {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}

      {colecao.length === 0 ? (
        <p>Você ainda não adicionou nenhuma HQ.</p>
      ) : (
        colecao.map((hq) => (
          <div key={hq.id} className="resultado">
            <h2>{hq.titulo}</h2>
            <p>Status: {hq.status}</p>
            {hq.avaliacao && <p>Avaliação: {hq.avaliacao}</p>}
            {hq.comentario && <p>Comentário: {hq.comentario}</p>}
            <small>
              Adicionado em: {new Date(hq.criado_em).toLocaleString()}
            </small>
            <br />
            <button
              onClick={() => {
                console.log("Removendo:", hq);
                handleRemover(hq.id);
              }}
              style={{ marginTop: "0.5rem", color: "red" }}
            >
              Remover da coleção
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Colecao;
