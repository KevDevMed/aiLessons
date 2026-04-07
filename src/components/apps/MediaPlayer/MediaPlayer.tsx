import { useState, useRef, useCallback, useEffect } from 'react';
import { AppProps } from '../../../types/app';
import { useWindowStore } from '../../../stores/useWindowStore';
import styles from './MediaPlayer.module.css';

interface TrackInfo {
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  type: 'audio' | 'video';
  gradient: string;
  src?: string;
  youtubeId?: string;
}

const mockTracks: Record<string, TrackInfo> = {
  'Bohemian Rhapsody.mp3': {
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: '5:55',
    durationSeconds: 355,
    type: 'audio',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  'Hotel California.mp3': {
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    duration: '6:30',
    durationSeconds: 390,
    type: 'audio',
    gradient: 'linear-gradient(135deg, #e65100 0%, #bf360c 50%, #4e342e 100%)',
  },
  'Stairway to Heaven.flac': {
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    duration: '8:02',
    durationSeconds: 482,
    type: 'audio',
    gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)',
  },
  'Take On Me.wav': {
    title: 'Take On Me',
    artist: 'a-ha',
    album: 'Hunting High and Low',
    duration: '3:48',
    durationSeconds: 228,
    type: 'audio',
    gradient: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 50%, #ce93d8 100%)',
  },
  'tutorial.mp4': {
    title: 'Getting Started Tutorial',
    artist: '',
    album: '',
    duration: '12:34',
    durationSeconds: 754,
    type: 'video',
    gradient: '',
  },
  'screen-recording.mp4': {
    title: 'Screen Recording',
    artist: '',
    album: '',
    duration: '3:28',
    durationSeconds: 208,
    type: 'video',
    gradient: '',
  },
  'session-1-recording': {
    title: 'Herramientas - AI: Setup de agentes y herramientas',
    artist: '',
    album: 'Session 1',
    duration: '',
    durationSeconds: 0,
    type: 'video',
    gradient: '',
    youtubeId: 'UfGtk8WyYwY',
  },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getDefaultTrack(fileName: string): TrackInfo {
  const isVideo = /\.(mp4|avi|mkv|webm)$/i.test(fileName);
  const name = fileName.replace(/\.[^.]+$/, '');
  return {
    title: name,
    artist: isVideo ? '' : 'Unknown Artist',
    album: isVideo ? '' : 'Unknown Album',
    duration: '3:28',
    durationSeconds: 208,
    type: isVideo ? 'video' : 'audio',
    gradient: 'linear-gradient(135deg, #37474f 0%, #455a64 50%, #546e7a 100%)',
  };
}

// YouTube embed player
function YouTubePlayer({ track }: { track: TrackInfo }) {
  return (
    <div className={styles.player}>
      <div className={styles.screen}>
        <iframe
          className={styles.realVideo}
          src={`https://www.youtube.com/embed/${track.youtubeId}?rel=0`}
          title={track.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none', width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}

// Real media player for tracks with a src
function RealVideoPlayer({ track }: { track: TrackInfo }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume / 100;
    v.muted = muted;
  }, [volume, muted]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * duration;
  }, [duration]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.player}>
      <div className={styles.screen} onClick={togglePlay} style={{ cursor: 'pointer' }}>
        <video
          ref={videoRef}
          className={styles.realVideo}
          src={track.src}
          onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
          onEnded={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </div>

      <div className={styles.controls}>
        <div className={styles.progressBar} onClick={handleProgressClick}>
          <div className={styles.progress} style={{ width: `${progress}%` }} />
          <div className={styles.progressThumb} style={{ left: `${progress}%` }} />
        </div>

        <div className={styles.buttons}>
          <button className={styles.controlBtn} title="Previous">⏮</button>
          <button
            className={`${styles.controlBtn} ${styles.playBtn}`}
            onClick={togglePlay}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <button className={styles.controlBtn} title="Next">⏭</button>

          <span className={styles.time}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className={styles.volumeControl}>
            <button
              className={styles.controlBtn}
              onClick={() => setMuted(!muted)}
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted || volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}
            </button>
            <input
              type="range"
              className={styles.volumeSlider}
              min={0}
              max={100}
              value={muted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (muted) setMuted(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock player for demo tracks without a real src
function MockPlayer({ track }: { track: TrackInfo }) {
  const isAudio = track.type === 'audio';
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (playing && progress < 100) {
      const increment = (100 / track.durationSeconds) * 0.5;
      intervalRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setPlaying(false);
            return 100;
          }
          return Math.min(prev + increment, 100);
        });
      }, 500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, track.durationSeconds, progress]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, pct)));
  }, []);

  const currentSeconds = (progress / 100) * track.durationSeconds;

  return (
    <div className={styles.player}>
      <div className={styles.screen}>
        {isAudio ? (
          <div className={styles.audioView}>
            <div className={styles.albumArt} style={{ background: track.gradient }}>
              <span className={styles.albumIcon}>🎵</span>
            </div>
            <div className={styles.trackInfo}>
              <span className={styles.trackTitle}>{track.title}</span>
              <span className={styles.trackArtist}>{track.artist}</span>
              <span className={styles.trackAlbum}>{track.album}</span>
            </div>
          </div>
        ) : (
          <div className={styles.videoView}>
            <span className={styles.videoIcon}>🎬</span>
            <span className={styles.videoTitle}>{track.title}</span>
            <span className={styles.videoMeta}>1920 x 1080 &middot; MP4</span>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.progressBar} onClick={handleProgressClick}>
          <div className={styles.progress} style={{ width: `${progress}%` }} />
          <div className={styles.progressThumb} style={{ left: `${progress}%` }} />
        </div>

        <div className={styles.buttons}>
          <button className={styles.controlBtn} title="Previous">⏮</button>
          <button
            className={`${styles.controlBtn} ${styles.playBtn}`}
            onClick={() => {
              if (progress >= 100) setProgress(0);
              setPlaying(!playing);
            }}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <button className={styles.controlBtn} title="Next">⏭</button>

          <span className={styles.time}>
            {formatTime(currentSeconds)} / {track.duration}
          </span>

          <div className={styles.volumeControl}>
            <button
              className={styles.controlBtn}
              onClick={() => setMuted(!muted)}
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted || volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}
            </button>
            <input
              type="range"
              className={styles.volumeSlider}
              min={0}
              max={100}
              value={muted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (muted) setMuted(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MediaPlayer({ windowId }: AppProps) {
  const win = useWindowStore((s) => s.windows[windowId]);
  const fileName = (win?.initialData?.fileName as string) || 'video.mp4';
  const track = mockTracks[fileName] || getDefaultTrack(fileName);

  if (track.youtubeId) {
    return <YouTubePlayer track={track} />;
  }
  if (track.src) {
    return <RealVideoPlayer track={track} />;
  }
  return <MockPlayer track={track} />;
}
