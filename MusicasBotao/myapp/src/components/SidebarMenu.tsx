import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export const musics = [
  {
    id: 1,
    title: 'Internacional Comunista',
    audio: '/music/internacional.mp3',
    image: '/images/internacional_comunista.jpg',
    description: 'Uma canção icônica.',
    artist: 'Desconhecido',
  },
  {
    id: 2,
    title: 'Red Sun in the Sky',
    audio: '/music/red_sun.mp3',
    image: '/images/red_sun_in_the_sky.jpg',
    description: 'Uma canção de reflexão.',
    artist: 'Desconhecido',
  },
  {
    id: 3,
    title: 'People of Yanbian',
    audio: '/music/yanbian.mp3',
    image: '/images/people_of_yanbien.jpg',
    description: 'Uma canção cultural.',
    artist: 'Desconhecido',
  }
];

const SidebarMenu: React.FC = () => {
  const [playing, setPlaying] = useState<number | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const audioInstance = new Audio();
    audioInstance.volume = volume;
    setAudio(audioInstance);

    audioInstance.ontimeupdate = () => {
      setCurrentTime(audioInstance.currentTime);
      setDuration(audioInstance.duration || 0);
    };

    return () => {
      audioInstance.pause();
    };
  }, []);

  useEffect(() => {
    if (audio) {
      audio.volume = muted ? 0 : volume;
    }
  }, [audio, volume, muted]);

  const handlePlay = (id: number, audioSrc: string) => {
    if (playing === id) {
      audio?.pause();
      setPlaying(null);
    } else {
      if (audio) {
        audio.src = audioSrc;
        audio.load(); // Carregar a nova fonte de áudio
        audio.play().catch((error) => {
          console.error("Erro ao tentar reproduzir o áudio:", error);
        });
        setPlaying(id);
      }
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audio) {
      audio.volume = muted ? 0 : newVolume;
    }
  };

  const handleNext = () => {
    if (playing !== null) {
      const currentIndex = musics.findIndex(music => music.id === playing);
      const nextIndex = (currentIndex + 1) % musics.length;
      handlePlay(musics[nextIndex].id, musics[nextIndex].audio);
    }
  };

  const handleMute = () => {
    setMuted(prev => !prev);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    if (audio) {
      audio.currentTime = newTime;
    }
  };

  return (
    <div className="sidebar-menu">
      <h2>Músicas</h2>
      <ul>
        {musics.map((music) => (
          <li
            key={music.id}
            className={`music-item ${playing === music.id ? 'playing' : ''}`}
            onClick={() => handlePlay(music.id, music.audio)}
          >
            <Image src={music.image} alt={music.title} width={100} height={100} />
            <div className="info">
              <h3>{music.title}</h3>
              <p>{music.description}</p>
              <p><em>{music.artist}</em></p>
              <p>{playing === music.id ? 'Tocando' : 'Pausado'}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="controls">
        <div className="volume-control">
          <label htmlFor="volume">Volume:</label>
          <input
            type="range"
            id="volume"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
        <button onClick={handleNext} disabled={playing === null}>
          Próxima Música
        </button>
        <button onClick={handleMute}>
          {muted ? 'Desmutar' : 'Mutar'}
        </button>
        <div className="time-control">
          <label htmlFor="time">Tempo:</label>
          <input
            type="range"
            id="time"
            min="0"
            max={duration || 1}
            step="0.1"
            value={currentTime}
            onChange={handleTimeChange}
          />
        </div>
      </div>
      <style jsx>{`
        .sidebar-menu {
          width: 250px;
          background: #f0f0f0;
          padding: 20px;
          position: fixed;
          height: 100%;
          overflow-y: auto;
          border-right: 1px solid #ddd;
        }
        .music-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          cursor: pointer;
        }
        .music-item.playing {
          border: 2px solid #0070f3;
        }
        .info {
          margin-left: 10px;
        }
        img {
          border-radius: 8px;
        }
        .controls {
          margin-top: 20px;
        }
        input[type='range'] {
          width: 100%;
        }
        button {
          margin-top: 10px;
          padding: 10px;
          background-color: #0070f3;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:disabled {
          background-color: #ccc;
        }
      `}</style>
    </div>
  );
};

export default SidebarMenu;

