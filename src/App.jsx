import {
  CalendarDays,
  CheckSquare,
  Leaf,
  ListTodo,
  Settings,
  Timer,
} from "lucide-react";

import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Leaf size={24} />
          </div>

          <div>
            <h1>Organisaur</h1>
            <p>Organize today. Evolve tomorrow.</p>
          </div>
        </div>

        <nav className="navigation">
          <a href="#" className="nav-item">
            <CalendarDays size={20} />
            <span>Today</span>
          </a>

          <a href="#" className="nav-item active">
            <ListTodo size={20} />
            <span>Todos</span>
          </a>

          <a href="#" className="nav-item">
            <Timer size={20} />
            <span>Focus Mode</span>
          </a>

          <a href="#" className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </nav>

        <div className="sidebar-message">
          <Leaf size={20} />
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
              type="text"
              placeholder="Enter a new task..."
            />

            <button type="button">
              <CheckSquare size={19} />
              Add Todo
            </button>
          </div>
        </section>

        <section className="todo-section">
          <div className="todo-toolbar">
            <div className="filters">
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

            <span>0 todos</span>
          </div>

          <div className="empty-state">
            <div className="empty-icon">
              <ListTodo size={38} />
            </div>

            <h3>No todos yet</h3>
            <p>Add your first task and begin growing your Organisaur.</p>
          </div>
        </section>
      </main>

      <aside className="companion-panel">
        <p className="eyebrow">Your companion</p>
        <h2>The Planner</h2>
        <span className="stage-label">Stage 1 · Hatchling</span>

        <div className="mascot-placeholder">
          <Leaf size={55} />
          <p>Planner mascot image</p>
        </div>

        <div className="companion-message">
          <h3>Your journey begins</h3>
          <p>Complete tasks to help your dinosaur grow.</p>
        </div>

        <div className="progress-card">
          <div>
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