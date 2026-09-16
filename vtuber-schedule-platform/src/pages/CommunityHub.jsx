import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTemplate } from '../context/TemplateContext';
import { Calendar, Clock, Users, Activity } from 'lucide-react';

export default function CommunityHub() {
  const { getMasterTemplates } = useTemplate();
  const [liveStreams, setLiveStreams] = useState([]);
  const [upcomingStreams, setUpcomingStreams] = useState([]);
  
  // Mock data untuk demo - di production ini akan fetch dari API
  useEffect(() => {
    // Simulasi data live streams dari komunitas
    const mockLiveStreams = [
      {
        id: 'stream-1',
        vtuberName: 'Sora Wirya',
        streamTitle: 'Gaming Stream - Minecraft Build Challenge',
        thumbnail: '/thumbnails/sora-gaming.jpg',
        viewers: 1234,
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        platform: 'YouTube'
      },
      {
        id: 'stream-2',
        vtuberName: 'Luna Starlight',
        streamTitle: 'Karaoke Night! 🎤',
        thumbnail: '/thumbnails/luna-karaoke.jpg',
        viewers: 856,
        startedAt: new Date(Date.now() - 1800000).toISOString(),
        platform: 'Twitch'
      }
    ];

    const mockUpcomingStreams = [
      {
        id: 'upcoming-1',
        vtuberName: 'Akira Blaze',
        streamTitle: 'Just Chatting & Q&A',
        scheduledFor: new Date(Date.now() + 7200000).toISOString(),
        platform: 'YouTube'
      },
      {
        id: 'upcoming-2',
        vtuberName: 'Miko Sakura',
        streamTitle: 'Art Stream - Drawing Fans!',
        scheduledFor: new Date(Date.now() + 14400000).toISOString(),
        platform: 'Twitch'
      },
      {
        id: 'upcoming-3',
        vtuberName: 'Rin Ocean',
        streamTitle: 'Valorant Ranked Grind',
        scheduledFor: new Date(Date.now() + 28800000).toISOString(),
        platform: 'YouTube'
      }
    ];

    setLiveStreams(mockLiveStreams);
    setUpcomingStreams(mockUpcomingStreams);
  }, []);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return date.toLocaleDateString('id-ID');
  };

  const formatScheduledTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }) + ' WIB';
  };

  const getPlatformColor = (platform) => {
    switch(platform) {
      case 'YouTube': return '#ff0000';
      case 'Twitch': return '#9146ff';
      default: return '#666';
    }
  };

  return (
    <div className="community-hub">
      <header className="hub-header">
        <h1>🌟 VTuber Community Hub</h1>
        <p>Jadwal dan status live dari seluruh teman VTuber</p>
      </header>

      <section className="live-section">
        <div className="section-title">
          <Activity size={24} className="live-icon" />
          <h2>Sedang Live Sekarang!</h2>
          <span className="live-count">{liveStreams.length} stream</span>
        </div>

        {liveStreams.length === 0 ? (
          <div className="no-live">
            <Activity size={48} />
            <p>Tidak ada stream yang sedang live saat ini</p>
          </div>
        ) : (
          <div className="live-grid">
            {liveStreams.map(stream => (
              <div key={stream.id} className="live-card">
                <div className="live-badge">
                  🔴 LIVE
                </div>
                <div className="stream-thumbnail">
                  <div 
                    className="thumbnail-placeholder"
                    style={{ backgroundColor: getPlatformColor(stream.platform) }}
                  >
                    📹
                  </div>
                </div>
                <div className="stream-info">
                  <h3>{stream.streamTitle}</h3>
                  <p className="vtuber-name">{stream.vtuberName}</p>
                  <div className="stream-meta">
                    <span className="viewers">
                      <Users size={14} />
                      {stream.viewers.toLocaleString()} viewers
                    </span>
                    <span className="time-ago">
                      <Clock size={14} />
                      {formatTimeAgo(stream.startedAt)}
                    </span>
                  </div>
                  <span 
                    className="platform-tag"
                    style={{ backgroundColor: getPlatformColor(stream.platform) }}
                  >
                    {stream.platform}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="upcoming-section">
        <div className="section-title">
          <Calendar size={24} />
          <h2>Jadwal Mendatang</h2>
        </div>

        <div className="schedule-list">
          {upcomingStreams.map(stream => (
            <div key={stream.id} className="schedule-item">
              <div className="schedule-time">
                <Clock size={20} />
                <span className="time">{formatScheduledTime(stream.scheduledFor)}</span>
              </div>
              <div className="schedule-content">
                <h3>{stream.streamTitle}</h3>
                <p className="vtuber-name">{stream.vtuberName}</p>
              </div>
              <span 
                className="platform-badge"
                style={{ borderColor: getPlatformColor(stream.platform) }}
              >
                {stream.platform}
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="hub-footer">
        <p>Bergabunglah dengan komunitas VTuber kami!</p>
        <p className="hint">Gunakan platform ini untuk membuat dan membagikan jadwal stream Anda</p>
      </footer>
    </div>
  );
}
