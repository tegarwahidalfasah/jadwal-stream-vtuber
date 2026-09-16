import { getDayName, sortScheduleEntries } from '../utils/format';
import { CANVAS_DEFAULTS } from '../utils/canvasDefaults';

/**
 * Kanvas jadwal berukuran tepat 1920x1080.
 *
 * Dipakai bersama oleh editor, halaman preview, dan halaman Browser Source OBS
 * supaya ketiganya merender hasil yang identik. Ukuran aslinya selalu
 * 1920x1080; `fullSize=false` hanya menskalakannya secara visual agar muat
 * di layar (exportService melepas transform itu sementara saat capture).
 */
export default function ScheduleCanvas({
  config = {},
  entries = [],
  streamerName,
  title = 'Jadwal Stream',
  emptyText = 'Belum ada jadwal',
  canvasId = 'preview-canvas',
  fullSize = false,
}) {
  const merged = { ...CANVAS_DEFAULTS, ...config };
  const position = { ...CANVAS_DEFAULTS.characterPosition, ...config.characterPosition };
  const sorted = sortScheduleEntries(entries);

  return (
    <div className={`preview-area${fullSize ? ' full' : ''}`}>
      <div
        id={canvasId}
        className={`schedule-canvas${fullSize ? ' full' : ''}`}
        style={{
          backgroundColor: merged.backgroundColor,
          color: merged.textColor,
          fontFamily: merged.fontFamily,
        }}
      >
        <div className="canvas-header">
          <h2>{title}</h2>
          {streamerName && <p>{streamerName}</p>}
        </div>

        <div className="canvas-schedule">
          {sorted.length === 0 ? (
            <p className="empty-canvas">{emptyText}</p>
          ) : (
            sorted.map((entry) => (
              <div key={entry.id} className="schedule-row">
                <span className="day-badge" style={{ backgroundColor: merged.accentColor }}>
                  {getDayName(entry.day) || 'Hari ?'}
                </span>
                <span className="time-badge">{entry.time}</span>
                <span className="title-text">{entry.title || 'Judul stream'}</span>
              </div>
            ))
          )}
        </div>

        <div
          className="canvas-character-placeholder"
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
            transform: `scale(${position.scale})`,
            transformOrigin: 'bottom right',
          }}
        >
          [Karakter VTuber]
        </div>
      </div>
    </div>
  );
}
