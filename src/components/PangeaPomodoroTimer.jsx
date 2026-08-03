import pangeaTimerBase from "../assets/ui-ux/pomodoro/pangea-timer-base.png";
import pangeaFogOverlay from "../assets/ui-ux/pomodoro/pangea-fog-overlay.png";

const RADIUS = 168;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function PangeaPomodoroTimer({ time, progress, mode, isRunning }) {
  const safeProgress = Math.min(100, Math.max(0, progress));
  const progressOffset =
    CIRCUMFERENCE - (safeProgress / 100) * CIRCUMFERENCE;
  const fogOpacity = Math.max(0.08, 0.72 - (safeProgress / 100) * 0.64);
  const clarity = safeProgress / 100;
  const modeLabel = mode === "break" ? "Break" : "Focus";

  return (
    <div
      className={`pangea-timer pangea-timer--${mode}${isRunning ? " is-running" : ""}`}
      style={{ "--clarity": clarity, "--fog-opacity": fogOpacity }}
      role="timer"
      aria-live="off"
      aria-label={`${modeLabel} timer, ${time} remaining`}
    >
      <span className="visually-hidden">
        {modeLabel} timer with {time} remaining
      </span>

      <img
        className="pangea-timer__base"
        src={pangeaTimerBase}
        alt=""
        loading="eager"
        draggable={false}
      />

      <img
        className="pangea-timer__fog"
        src={pangeaFogOverlay}
        alt=""
        draggable={false}
      />

      <svg
        className="pangea-timer__progress"
        viewBox="0 0 400 400"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`pangea-progress-${mode}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" className="pangea-timer__gradient-start" />
            <stop offset="100%" className="pangea-timer__gradient-end" />
          </linearGradient>
        </defs>
        <circle
          className="pangea-timer__track"
          cx="200"
          cy="200"
          r={RADIUS}
        />
        <circle
          className="pangea-timer__ring"
          cx="200"
          cy="200"
          r={RADIUS}
          stroke={`url(#pangea-progress-${mode})`}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={progressOffset}
        />
      </svg>

      <output className="pangea-timer__time">{time}</output>
    </div>
  );
}

export default PangeaPomodoroTimer;
