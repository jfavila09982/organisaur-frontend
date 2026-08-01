import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckSquare,
  Egg,
  Leaf,
  ListTodo,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Pause,
  Play,
  RotateCcw,
  Settings as SettingsIcon,
  Timer,
  Trash2,
  X,
} from "lucide-react";

import organisaurLogo from "./assets/assets/logo/organisaur-logo-cropped.png";
import "./App.css";

const NAV_ITEMS = [
  { key: "today", label: "Today", icon: CalendarDays },
  { key: "todos", label: "Todos", icon: ListTodo },
  { key: "focus", label: "Focus Mode", icon: Timer },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

const PAGE_COPY = {
  today: { eyebrow: "Your workspace", title: "Today" },
  todos: { eyebrow: "Your workspace", title: "My Todos" },
  focus: { eyebrow: "Focus mode", title: "Pomodoro timer" },
  settings: { eyebrow: "Preferences", title: "Settings" },
};

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(safeSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("todos");

  // Todos
  const [todos, setTodos] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [todoFilter, setTodoFilter] = useState("all");

  // Focus mode / Pomodoro settings
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  // Focus mode / Pomodoro live state
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const goTo = (key) => {
    setActiveView(key);
    setIsNavOpen(false);
  };

  // Keep the countdown in sync with the current mode's target duration
  // whenever settings change and the timer isn't actively running.
  useEffect(() => {
    if (isRunning) return;
    setSecondsLeft((mode === "focus" ? focusMinutes : breakMinutes) * 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusMinutes, breakMinutes, mode]);

  // Tick the countdown every second while running; switch modes at zero.
  useEffect(() => {
    if (!isRunning) return undefined;

    if (secondsLeft <= 0) {
      const finishedFocus = mode === "focus";
      const nextMode = finishedFocus ? "break" : "focus";
      setMode(nextMode);
      setSecondsLeft((nextMode === "focus" ? focusMinutes : breakMinutes) * 60);
      if (finishedFocus) {
        setCompletedSessions((count) => count + 1);
      }
      return undefined;
    }

    const id = setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [isRunning, secondsLeft, mode, focusMinutes, breakMinutes]);

  const handleResetTimer = () => {
    setIsRunning(false);
    setMode("focus");
    setSecondsLeft(focusMinutes * 60);
  };

  const totalForMode = (mode === "focus" ? focusMinutes : breakMinutes) * 60;
  const timerProgress =
    totalForMode > 0
      ? Math.min(100, ((totalForMode - secondsLeft) / totalForMode) * 100)
      : 0;

  const handleAddTodo = (event) => {
    event.preventDefault();
    const trimmed = taskName.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: trimmed, completed: false },
    ]);
    setTaskName("");
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const visibleTodos = todos.filter((todo) => {
    if (todoFilter === "active") return !todo.completed;
    if (todoFilter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <div className={`app-shell${isSidebarCollapsed ? " sidebar-collapsed" : ""}`}>
      {/* Edge toggle — sits on the border between sidebar and workspace, desktop/tablet only */}
      <button
        type="button"
        className="sidebar-edge-toggle"
        aria-label={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
        aria-expanded={!isSidebarCollapsed}
        onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
      >
        {isSidebarCollapsed ? (
          <PanelLeftOpen size={15} strokeWidth={1.9} />
        ) : (
          <PanelLeftClose size={15} strokeWidth={1.9} />
        )}
      </button>

      {/* Compact top bar — mobile only */}
      <header className="mobile-topbar">
        <button
          type="button"
          className="nav-toggle"
          aria-label={isNavOpen ? "Close menu" : "Open menu"}
          aria-expanded={isNavOpen}
          onClick={() => setIsNavOpen((open) => !open)}
        >
          {isNavOpen ? (
            <X size={22} strokeWidth={1.9} />
          ) : (
            <Menu size={22} strokeWidth={1.9} />
          )}
        </button>

        <div className="mobile-brand">
          <span className="mobile-brand-mark">
            <Egg size={15} strokeWidth={2} />
          </span>
          <span className="mobile-brand-name">Organisaur</span>
        </div>
      </header>

      {/* Backdrop — only rendered/visible when drawer is open on mobile */}
      {isNavOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setIsNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar${isNavOpen ? " sidebar-open" : ""}`}>
        <div className="brand">
          <img
            src={organisaurLogo}
            alt="Organisaur"
            className="brand-logo"
          />
        </div>

        <nav className="navigation" aria-label="Main navigation">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              className={`nav-item${activeView === key ? " active" : ""}`}
              aria-current={activeView === key ? "page" : undefined}
              onClick={() => goTo(key)}
            >
              <Icon size={18} strokeWidth={1.9} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-message">
          <Leaf size={17} strokeWidth={2} />

          <p>
            Stay steady.
            <br />
            Stay organized.
            <br />
            Keep growing.
          </p>
        </div>
      </aside>

      <main className="workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">{PAGE_COPY[activeView].eyebrow}</p>
            <h2>{PAGE_COPY[activeView].title}</h2>
          </div>

          {activeView === "todos" && (
            <span className="api-status">API: /todos</span>
          )}
        </header>

        {activeView === "today" && (
          <section className="create-card today-card">
            <h3>Welcome back</h3>
            <p className="today-summary">
              {activeCount === 0
                ? "You're all caught up — no active todos right now."
                : `You have ${activeCount} active todo${activeCount === 1 ? "" : "s"} waiting.`}
            </p>
            <div className="today-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => goTo("todos")}
              >
                <ListTodo size={18} strokeWidth={2} />
                <span>Go to todos</span>
              </button>

              <button
                type="button"
                className="filter"
                onClick={() => goTo("focus")}
              >
                Start a focus session
              </button>
            </div>
          </section>
        )}

        {activeView === "todos" && (
          <>
            <section className="create-card">
              <label htmlFor="taskName">Task name</label>

              <form className="task-input-row" onSubmit={handleAddTodo}>
                <input
                  id="taskName"
                  name="taskName"
                  type="text"
                  placeholder="Enter a new task..."
                  autoComplete="off"
                  value={taskName}
                  onChange={(event) => setTaskName(event.target.value)}
                />

                <button type="submit" className="primary-button">
                  <CheckSquare size={18} strokeWidth={2} />
                  <span>Add Todo</span>
                </button>
              </form>
            </section>

            <section className="todo-section todo-section-highlight">
              <div className="todo-toolbar">
                <div className="filters" aria-label="Todo filters">
                  <button
                    type="button"
                    className={`filter${todoFilter === "all" ? " active" : ""}`}
                    onClick={() => setTodoFilter("all")}
                  >
                    All
                  </button>

                  <button
                    type="button"
                    className={`filter${todoFilter === "active" ? " active" : ""}`}
                    onClick={() => setTodoFilter("active")}
                  >
                    Active
                  </button>

                  <button
                    type="button"
                    className={`filter${todoFilter === "completed" ? " active" : ""}`}
                    onClick={() => setTodoFilter("completed")}
                  >
                    Completed
                  </button>
                </div>

                <span className="todo-count">
                  {todos.length} todo{todos.length === 1 ? "" : "s"}
                </span>
              </div>

              {visibleTodos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <ListTodo size={27} strokeWidth={1.9} />
                  </div>

                  <h3>
                    {todos.length === 0
                      ? "No todos yet"
                      : `No ${todoFilter} todos`}
                  </h3>

                  <p>
                    {todos.length === 0
                      ? "Add your first task and begin growing your Organisaur companion."
                      : "Try a different filter to see more of your tasks."}
                  </p>
                </div>
              ) : (
                <ul className="todo-list">
                  {visibleTodos.map((todo) => (
                    <li key={todo.id} className="todo-list-item">
                      <label className="todo-checkbox">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                        />
                        <span
                          className={
                            todo.completed
                              ? "todo-text todo-text-done"
                              : "todo-text"
                          }
                        >
                          {todo.text}
                        </span>
                      </label>

                      <button
                        type="button"
                        className="todo-delete"
                        aria-label={`Delete ${todo.text}`}
                        onClick={() => deleteTodo(todo.id)}
                      >
                        <Trash2 size={16} strokeWidth={1.9} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}

        {activeView === "focus" && (
          <section className="create-card focus-card">
            <span
              className={`focus-mode-badge${mode === "break" ? " focus-mode-badge-break" : ""}`}
            >
              {mode === "focus" ? "Focus session" : "Break time"}
            </span>

            <p className="focus-timer">{formatTime(secondsLeft)}</p>

            <div className="progress-track timer-track">
              <div
                className="progress-fill"
                style={{ width: `${timerProgress}%` }}
              />
            </div>

            <div className="focus-controls">
              <button
                type="button"
                className="primary-button"
                onClick={() => setIsRunning((running) => !running)}
              >
                {isRunning ? (
                  <>
                    <Pause size={18} strokeWidth={2} />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={18} strokeWidth={2} />
                    <span>Start</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="filter"
                onClick={handleResetTimer}
              >
                <RotateCcw size={15} strokeWidth={1.9} />
                <span>Reset</span>
              </button>
            </div>

            <p className="focus-meta">
              {completedSessions} focus session
              {completedSessions === 1 ? "" : "s"} completed today
            </p>
          </section>
        )}

        {activeView === "settings" && (
          <section className="create-card settings-card">
            <div className="settings-field">
              <label htmlFor="focusMinutes">Focus length (minutes)</label>
              <input
                id="focusMinutes"
                type="number"
                min="1"
                max="90"
                value={focusMinutes}
                onChange={(event) =>
                  setFocusMinutes(Math.max(1, Number(event.target.value) || 1))
                }
              />
            </div>

            <div className="settings-field">
              <label htmlFor="breakMinutes">Break length (minutes)</label>
              <input
                id="breakMinutes"
                type="number"
                min="1"
                max="30"
                value={breakMinutes}
                onChange={(event) =>
                  setBreakMinutes(Math.max(1, Number(event.target.value) || 1))
                }
              />
            </div>

            <p className="settings-hint">
              These durations apply the next time you start a focus session.
            </p>
          </section>
        )}
      </main>

      <aside className="companion-panel">
        <div className="companion-header">
          <p className="eyebrow">Your companion</p>
          <h2>The Planner</h2>
          <span className="stage-label">Stage 1 · Hatchling</span>
        </div>

        <div className="mascot-placeholder">
          <Leaf size={48} strokeWidth={1.7} />
          <p>Planner mascot image</p>
        </div>

        <div className="companion-message">
          <h3>Your journey begins</h3>

          <p>
            Complete tasks to help your dinosaur companion grow and evolve.
          </p>
        </div>

        <div className="progress-card">
          <div className="progress-header">
            <span>Evolution progress</span>
            <strong>
              {todos.length === 0
                ? 0
                : Math.round((completedCount / todos.length) * 100)}
              %
            </strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${
                  todos.length === 0
                    ? 0
                    : Math.round((completedCount / todos.length) * 100)
                }%`,
              }}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default App;