import {
  CalendarDays,
  CheckSquare,
  Leaf,
  ListTodo,
  Settings,
  Timer,
} from "lucide-react";

import organisaurLogo from "./assets/assets/logo/organisaur-logo-cropped.png";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img
            src={organisaurLogo}
            alt="Organisaur"
            className="brand-logo"
          />
        </div>

        <nav className="navigation" aria-label="Main navigation">
          <a href="#today" className="nav-item">
            <CalendarDays size={18} strokeWidth={1.9} />
            <span>Today</span>
          </a>

          <a href="#todos" className="nav-item active">
            <ListTodo size={18} strokeWidth={1.9} />
            <span>Todos</span>
          </a>

          <a href="#focus" className="nav-item">
            <Timer size={18} strokeWidth={1.9} />
            <span>Focus Mode</span>
          </a>

          <a href="#settings" className="nav-item">
            <Settings size={18} strokeWidth={1.9} />
            <span>Settings</span>
          </a>
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
            <p className="eyebrow">Your workspace</p>
            <h2>My Todos</h2>
          </div>

          <span className="api-status">API: /todos</span>
        </header>

        <section className="create-card">
          <label htmlFor="taskName">Task name</label>

          <div className="task-input-row">
            <input
              id="taskName"
              name="taskName"
              type="text"
              placeholder="Enter a new task..."
              autoComplete="off"
            />

            <button type="button" className="primary-button">
              <CheckSquare size={18} strokeWidth={2} />
              <span>Add Todo</span>
            </button>
          </div>
        </section>

        <section className="todo-section">
          <div className="todo-toolbar">
            <div className="filters" aria-label="Todo filters">
              <button type="button" className="filter active">
                All
              </button>

              <button type="button" className="filter">
                Active
              </button>

              <button type="button" className="filter">
                Completed
              </button>
            </div>

            <span className="todo-count">0 todos</span>
          </div>

          <div className="empty-state">
            <div className="empty-icon">
              <ListTodo size={27} strokeWidth={1.9} />
            </div>

            <h3>No todos yet</h3>

            <p>
              Add your first task and begin growing your Organisaur companion.
            </p>
          </div>
        </section>
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
            <strong>0%</strong>
          </div>

          <div className="progress-track">
            <div className="progress-fill" />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default App;
