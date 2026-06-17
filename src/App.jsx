import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TbMessageCircle, TbBrandGithub, TbBrandYoutube, TbBrandInstagram, TbMail,
  TbSettings, TbRefresh, TbUserEdit, TbPalette, TbMusic, TbCode, TbTrophy,
  TbPlayerPlay, TbPlayerPause, TbVolume
} from 'react-icons/tb';
import './index.css';

function App() {
  const [discordIdInput, setDiscordIdInput] = useState('');
  const [entered, setEntered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (entered) {
      const timer = setTimeout(() => {
        setShowDetails(true);
      }, 2000); // 1.5s delay + 1.5s shatter + 2.0s wait
      return () => clearTimeout(timer);
    }
  }, [entered]);

  // Music Player State
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const [profileData, setProfileData] = useState({
    name: '! NotMystic',
    tagline: 'DEVELOPER',
    bio: 'Crafting elegant code and building aesthetic digital experiences. Developer & Creator.',
    avatar: 'https://cdn.discordapp.com/icons/1355239538808848575/f629c7a5a0b472db7cbbf294a8ad732b.webp?size=1024',
    banner: 'https://files.catbox.moe/3yic5r.png',
    status: 'online',
    discord: 'https://discord.com/users/1312309380800057355',
    github: 'https://github.com/notmystic-only',
    youtube: 'https://youtube.com/@Mystic-Devs',
    music: {
      title: "Starboy",
      artist: "The Weeknd",
      cover: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452",
      src: "https://files.catbox.moe/o0oyxn.mp3", // Replace with your direct MP3/Audio link!
      startTime: 15, // Starts at 0:15 seconds
      endTime: 140    // Ends at 1:00 (plays for 30 seconds total)
    }
  });

  useEffect(() => {
    if (audioRef.current && profileData.music.startTime) {
      audioRef.current.currentTime = profileData.music.startTime;
    }
  }, [profileData.music.src, profileData.music.startTime]);

  const togglePlay = () => {
    if (audioRef.current) {
      const start = profileData.music.startTime || 0;
      const end = profileData.music.endTime || audioRef.current.duration;

      if (audioRef.current.currentTime >= end) {
        audioRef.current.currentTime = start;
      }

      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const start = profileData.music.startTime || 0;
      const end = profileData.music.endTime || audioRef.current.duration;

      if (current >= end) {
        audioRef.current.pause();
        audioRef.current.currentTime = start;
        setIsPlaying(false);
      } else if (current < start) {
        audioRef.current.currentTime = start;
      }

      const total = end - start;
      const progressCurrent = current - start;
      setProgress((progressCurrent / total) * 100 || 0);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const [editData, setEditData] = useState({ ...profileData });

  // Sync with Discord via Lanyard or Fallback API
  const syncWithDiscord = async () => {
    if (!discordIdInput) return;

    try {
      let res = await fetch(`https://api.lanyard.rest/v1/users/${discordIdInput}`);
      let data = await res.json();

      let updatedData = { ...profileData };

      if (data.success) {
        const discordUser = data.data.discord_user;
        const status = data.data.discord_status;
        const avatarUrl = discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=512`
          : profileData.avatar;

        updatedData.name = discordUser.global_name || discordUser.username;
        updatedData.avatar = avatarUrl;
        updatedData.status = status;
      } else {
        // Fallback to Mesalinc API if not in Lanyard
        res = await fetch(`https://discordlookup.mesalinc.com/v1/user/${discordIdInput}`);
        if (res.ok) {
          data = await res.json();
          updatedData.name = data.global_name || data.username;
          updatedData.avatar = data.avatar ? data.avatar.link : profileData.avatar;
          updatedData.status = 'offline'; // default status
        } else {
          alert("Discord User not found or invalid ID.");
          return;
        }
      }

      setProfileData(updatedData);
      setEditData(updatedData);
    } catch (err) {
      console.error(err);
      alert("Failed to sync with Discord.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    setProfileData(editData);
  };

  const getStatusClass = () => {
    switch (profileData.status) {
      case 'online': return 'status-online';
      case 'idle': return 'status-idle';
      case 'dnd': return 'status-dnd';
      default: return '';
    }
  };

  return (
    <>
      <AnimatePresence>
        {!entered && (
          <motion.div
            className="entry-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onClick={() => setEntered(true)}
          >
            <div className="particles-container">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="particle"
                  animate={{
                    y: [0, -30, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: Math.random() * 4 + 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    left: `${Math.random() * 100}vw`,
                    top: `${Math.random() * 100}vh`,
                    scale: Math.random() * 0.5 + 0.3
                  }}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M12 2L22 20H2L12 2Z" fill="rgba(230,0,38,0.3)" />
                  </svg>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="entry-text"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              [ CLICK TO ENTER ]
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <video
        autoPlay
        loop
        muted
        playsInline
        className="bg-video"
      >
        <source src="https://files.catbox.moe/25af5y.mp4" type="video/mp4" />
      </video>
      <div className="bg-overlay"></div>

      {entered && (
        <div className="app-container">
          <div className="main-content" style={{ gap: 0 }}>

            {/* Profile Preview (Left Side) */}
            <motion.div
              className="profile-wrapper"
              layout
              style={{ zIndex: 10 }}
              initial={{ opacity: 0, scale: 1.5, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.0, type: "spring", bounce: 0.2, layout: { duration: 1.0, type: "spring", bounce: 0.2 } }}
              whileHover={{ y: -8, scale: 1.03, transition: { delay: 0, type: "spring", stiffness: 600, damping: 20 } }}
            >

              {/* Glass Shatter Cover */}
              <motion.div
                className="glass-cover-container"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0, transitionEnd: { display: "none" } }}
                transition={{ delay: 1.5, duration: 0.1 }}
              >
                {/* Center Purple Flame Burst */}
                <motion.div
                  className="purple-flame"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
                  transition={{ duration: 1.0, times: [0, 0.5, 1], ease: "easeOut", delay: 0.5 }}
                />

                {[
                  { id: '1', clip: 'polygon(0 0, 40% 0, 50% 50%, 0 30%)', x: -50, y: 400, rotate: -45 },
                  { id: '2', clip: 'polygon(40% 0, 100% 0, 100% 20%, 50% 50%)', x: 80, y: 500, rotate: 60 },
                  { id: '3', clip: 'polygon(100% 20%, 100% 70%, 50% 50%)', x: 120, y: 450, rotate: 90 },
                  { id: '4', clip: 'polygon(100% 70%, 100% 100%, 60% 100%, 50% 50%)', x: 70, y: 600, rotate: 30 },
                  { id: '5', clip: 'polygon(60% 100%, 30% 100%, 50% 50%)', x: -20, y: 550, rotate: -30 },
                  { id: '6', clip: 'polygon(30% 100%, 0 100%, 0 60%, 50% 50%)', x: -80, y: 500, rotate: -60 },
                  { id: '7', clip: 'polygon(0 60%, 0 30%, 50% 50%)', x: -120, y: 400, rotate: -90 }
                ].map((shard) => (
                  <motion.div
                    key={shard.id}
                    className="glass-shard"
                    style={{ clipPath: shard.clip }}
                    initial={{ x: 0, y: 0, rotate: 0, borderColor: "rgba(150,0,255,0)", boxShadow: "0 0 0px rgba(150,0,255,0)" }}
                    animate={{
                      x: [0, 0, shard.x],
                      y: [0, 0, shard.y],
                      rotate: [0, 0, shard.rotate],
                      borderColor: ["rgba(150,0,255,0)", "rgba(180,50,255,1)", "rgba(180,50,255,0)"],
                      boxShadow: ["0 0 0px rgba(150,0,255,0)", "inset 0 0 20px rgba(150,0,255,0.8), 0 0 20px rgba(150,0,255,0.8)", "0 0 0px rgba(150,0,255,0)"],
                      opacity: [1, 1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      times: [0, 0.4, 1],
                      ease: "easeIn",
                      delay: 0.2
                    }}
                  />
                ))}
              </motion.div>

              <div className="profile-showcase">
                <div
                  className="profile-banner"
                  style={profileData.banner ? { backgroundImage: `url(${profileData.banner})` } : {}}
                >
                  <div className="banner-overlay"></div>
                </div>

                <div className="profile-content">
                  <div className="avatar-container">
                    <div className="avatar-inner">
                      <img src={profileData.avatar} alt="Avatar" />
                    </div>
                  </div>

                  <h2 className="user-name">{profileData.name}</h2>
                  <div className="user-tagline">{profileData.tagline}</div>
                  <p className="user-bio">{profileData.bio}</p>

                  <div className="divider"></div>

                  <div className="social-links">
                    <a href={profileData.discord} className="social-icon" target="_blank" rel="noreferrer"><TbMessageCircle /></a>
                    <a href={profileData.github} className="social-icon" target="_blank" rel="noreferrer"><TbBrandGithub /></a>
                    <a href={profileData.youtube} className="social-icon" target="_blank" rel="noreferrer"><TbBrandYoutube /></a>
                  </div>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.0, type: "spring", bounce: 0.2 }}
                  style={{ overflow: 'visible', zIndex: 5 }}
                  className="details-wrapper-motion"
                >
                  <motion.div
                    className="details-column"
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 1.0, type: "spring", bounce: 0.2, staggerChildren: 0.2 }}
                  >
                    <motion.div className="detail-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} whileHover={{ y: -8, scale: 1.03, transition: { delay: 0, type: "spring", stiffness: 600, damping: 20 } }}>
                      <div className="detail-header"><TbTrophy /> ACHIEVEMENTS</div>
                      <ul className="achievements-list">
                        <li>Built Sentinel Prime from scratch</li>
                        <li>Scaled infrastructure to 10,000+ Discord users</li>
                        <li>Mastered advanced front-end animations & UI/UX</li>
                      </ul>
                    </motion.div>
                    <motion.div className="detail-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} whileHover={{ y: -8, scale: 1.03, transition: { delay: 0, type: "spring", stiffness: 600, damping: 20 } }}>
                      <div className="detail-header"><TbCode /> EXPERTISE</div>
                      <div className="skills-grid">
                        <span className="skill-badge">JavaScript</span>
                        <span className="skill-badge">TypeScript</span>
                        <span className="skill-badge">React</span>
                        <span className="skill-badge">Next.js</span>
                        <span className="skill-badge">Node.js</span>
                        <span className="skill-badge">Python</span>
                        <span className="skill-badge">Discord.js</span>
                        <span className="skill-badge">UI/UX Design</span>
                      </div>
                    </motion.div>
                    <motion.div className="detail-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} whileHover={{ y: -8, scale: 1.03, transition: { delay: 0, type: "spring", stiffness: 600, damping: 20 } }}>
                      <div className="detail-header"><TbMusic /> NOW PLAYING</div>
                      <div className="music-player">
                        <div className="music-art" style={{ backgroundImage: `url(${profileData.music.cover})` }}>
                          <button className="play-btn" onClick={togglePlay}>
                            {isPlaying ? <TbPlayerPause /> : <TbPlayerPlay />}
                          </button>
                        </div>
                        <div className="music-info">
                          <div className="music-title">{profileData.music.title}</div>
                          <div className="music-artist">{profileData.music.artist}</div>
                          <div className="music-controls-row">
                            <div className="music-progress">
                              <div className="music-bar"><div className="music-fill" style={{ width: `${progress}%` }}></div></div>
                            </div>
                            <div className="volume-control">
                              <TbVolume />
                              <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="volume-slider" />
                            </div>
                          </div>
                        </div>
                        <audio ref={audioRef} src={profileData.music.src} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      )}
    </>
  );
}

export default App;
