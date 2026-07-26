import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Organisaur</h1>
        <p>Organize today. Evolve tomorrow.</p>
      </aside>

      <main className="workspace">
        <h2>My Todos</h2>
        <p>Your Organisaur workspace is ready.</p>
      </main>

      <aside className="companion-panel">
        <h2>The Planner</h2>
        <p>Your dinosaur companion will appear here.</p>
      </aside>
    </div>
  );
}

export default App;