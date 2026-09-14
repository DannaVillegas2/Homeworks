import { useState } from "react";
import { SongLinkedList } from "../structures/SinglyLinkedList";
import { songs } from "../data/mockData";

function createPlaylist() {
  const playlist = new SongLinkedList();

  songs.forEach((song) => {
    playlist.add(song);
  });

  return playlist;
}

function PlaylistPage() {
  const [playlist] = useState(createPlaylist);
  const [currentSong, setCurrentSong] = useState(
    playlist.getCurrent()
  );

  const handleNext = () => {
    setCurrentSong(playlist.next());
  };

  const handleRestart = () => {
    setCurrentSong(playlist.restart());
  };

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">LISTA ENLAZADA SIMPLE</p>

        <h1>Reproductor de canciones</h1>

        <p className="description">
          Cada canción apunta únicamente a la siguiente.
          Por eso la reproducción avanza en un solo sentido.
        </p>

        {currentSong && (
          <div className="current-box">
            <span>Reproduciendo ahora</span>

            <h2>{currentSong.title}</h2>

            <p>{currentSong.artist}</p>

            <small>
              Duración: {currentSong.duration}
            </small>
          </div>
        )}

        <div className="controls">
          <button onClick={handleRestart}>
            Reiniciar
          </button>

          <button
            onClick={handleNext}
            disabled={!playlist.hasNext()}
          >
            Siguiente
          </button>
        </div>

        <div className="list-container">
          <h3>Orden de reproducción</h3>

          {playlist.getAll().map((song, index) => (
            <div
              className={`list-item ${
                currentSong?.id === song.id
                  ? "active-item"
                  : ""
              }`}
              key={song.id}
            >
              <div>
                <strong>
                  {index + 1}. {song.title}
                </strong>

                <p>{song.artist}</p>
              </div>

              <span>{song.duration}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default PlaylistPage;