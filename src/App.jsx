import { useEffect, useRef, useState } from "react";
import {
  Bold,
  BookOpen,
  CalendarDays,
  CheckSquare,
  Egg,
  FileText,
  Heading1,
  Heading2,
  Italic,
  Leaf,
  Link,
  List,
  ListOrdered,
  ListTodo,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Pause,
  Play,
  Quote,
  Redo2,
  RotateCcw,
  Settings as SettingsIcon,
  Share2,
  Star,
  Timer,
  Trash2,
  Underline,
  Undo2,
  X,
} from "lucide-react";

import organisaurLogo from "./assets/assets/logo/organisaur-logo-cropped.png";
import PangeaPomodoroTimer from "./components/PangeaPomodoroTimer";
import "./App.css";

const NAV_ITEMS = [
  { key: "today", label: "Today", icon: CalendarDays },
  { key: "todos", label: "Todos", icon: ListTodo },
  { key: "notebook", label: "NoteBook", icon: BookOpen },
  { key: "focus", label: "Focus Mode", icon: Timer },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

const PAGE_COPY = {
  today: { eyebrow: "Your workspace", title: "Today" },
  todos: { eyebrow: "Your workspace", title: "My Todos" },
  notebook: { eyebrow: "Your workspace", title: "NoteBook" },
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

function createPageId() {
  return (
    crypto.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

function countWords(text) {
  const trimmedText = text.trim();
  return trimmedText ? trimmedText.split(/\s+/).length : 0;
}

function getPagePreview(content) {
  return htmlToText(content).trim().replace(/\s+/g, " ") || "No description yet";
}

function htmlToText(content = "") {
  const container = document.createElement("div");
  container.innerHTML = content;
  return container.textContent ?? "";
}

function normalizeEditorHtml(content = "") {
  if (/<[a-z][\s\S]*>/i.test(content)) return content;
  const container = document.createElement("div");
  container.textContent = content;
  return container.innerHTML.replace(/\r?\n/g, "<br>");
}

function getLastEditedLabel(updatedAt) {
  const elapsedSeconds = Math.max(0, (Date.now() - new Date(updatedAt).getTime()) / 1000);
  if (elapsedSeconds < 60) return "Edited just now";
  if (elapsedSeconds < 3600) return `Last edited ${Math.floor(elapsedSeconds / 60)} min ago`;
  if (elapsedSeconds < 86400) return `Last edited ${Math.floor(elapsedSeconds / 3600)} hr ago`;
  return `Last edited ${Math.floor(elapsedSeconds / 86400)} day${elapsedSeconds < 172800 ? "" : "s"} ago`;
}

const FORMAT_ACTIONS = [
  { command: "bold", label: "Bold", icon: Bold },
  { command: "italic", label: "Italic", icon: Italic },
  { command: "underline", label: "Underline", icon: Underline },
  { command: "insertUnorderedList", label: "Bullet list", icon: List },
  { command: "insertOrderedList", label: "Numbered list", icon: ListOrdered },
  { command: "formatBlock", value: "blockquote", label: "Quote", icon: Quote },
];

function RichTextEditor({ content, isRichText, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    const nextHtml = isRichText ? content : normalizeEditorHtml(content);
    if (editor && editor.innerHTML !== nextHtml) editor.innerHTML = nextHtml;
  }, [content, isRichText]);

  const runCommand = (command, value) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    onChange(editorRef.current?.innerHTML ?? "");
  };

  const addLink = () => {
    const url = window.prompt("Paste a link URL");
    if (url) runCommand("createLink", url);
  };

  return (
    <div className="notebook-rich-editor">
      <div className="notebook-format-toolbar" role="toolbar" aria-label="Text formatting">
        <button type="button" title="Heading 1" aria-label="Heading 1" onMouseDown={(event) => { event.preventDefault(); runCommand("formatBlock", "h1"); }}>
          <Heading1 size={17} />
        </button>
        <button type="button" title="Heading 2" aria-label="Heading 2" onMouseDown={(event) => { event.preventDefault(); runCommand("formatBlock", "h2"); }}>
          <Heading2 size={17} />
        </button>
        <span className="notebook-toolbar-divider" />
        {FORMAT_ACTIONS.map(({ command, value, label, icon: Icon }) => (
          <button key={label} type="button" title={label} aria-label={label} onMouseDown={(event) => { event.preventDefault(); runCommand(command, value); }}>
            <Icon size={16} />
          </button>
        ))}
        <button type="button" title="Add link" aria-label="Add link" onMouseDown={(event) => { event.preventDefault(); addLink(); }}><Link size={16} /></button>
        <span className="notebook-toolbar-divider" />
        <button type="button" title="Undo" aria-label="Undo" onMouseDown={(event) => { event.preventDefault(); runCommand("undo"); }}><Undo2 size={16} /></button>
        <button type="button" title="Redo" aria-label="Redo" onMouseDown={(event) => { event.preventDefault(); runCommand("redo"); }}><Redo2 size={16} /></button>
      </div>
      <div
        ref={editorRef}
        className="notebook-content-input"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Page content"
        aria-multiline="true"
        data-placeholder="Start writing your notes, ideas, plans, or study materials..."
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
      />
      <button
        type="button"
        className="notebook-assistant-button"
        aria-label="Focus writing area"
        title="Focus writing area"
        onClick={() => editorRef.current?.focus()}
      >
        <Leaf size={15} strokeWidth={2.2} />
      </button>
    </div>
  );
}

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const savedValue = window.localStorage.getItem(key);
      return savedValue === null ? initialValue : JSON.parse(savedValue);
    } catch (error) {
      console.warn(`Could not read "${key}" from browser storage.`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Could not save "${key}" to browser storage.`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("todos");

  // Todos
  const [todos, setTodos] = usePersistentState("organisaur.todos", []);
  const [taskName, setTaskName] = useState("");
  const [taskBody, setTaskBody] = useState("");
  const [todoFilter, setTodoFilter] = useState("all");
  const [expandedTodoId, setExpandedTodoId] = useState(null);

  const [pages, setPages] = usePersistentState("organisaur.pages", []);
  const [selectedPageId, setSelectedPageId] = usePersistentState(
    "organisaur.selectedPageId",
    null
  );
  const [isNotebookPanelCollapsed, setIsNotebookPanelCollapsed] = useState(false);

  // Focus mode / Pomodoro settings
  const [focusMinutes, setFocusMinutes] = usePersistentState(
    "organisaur.focusMinutes",
    25
  );
  const [breakMinutes, setBreakMinutes] = usePersistentState(
    "organisaur.breakMinutes",
    5
  );

  // Focus mode / Pomodoro live state
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = usePersistentState(
    "organisaur.completedSessions",
    0
  );

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
  }, [
    isRunning,
    secondsLeft,
    mode,
    focusMinutes,
    breakMinutes,
    setCompletedSessions,
  ]);

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
    const trimmedName = taskName.trim();
    const trimmedBody = taskBody.trim();
    if (!trimmedName || !trimmedBody) return;
    setTodos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        taskName: trimmedName,
        body: trimmedBody,
        completed: false,
      },
    ]);
    setTaskName("");
    setTaskBody("");
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
    setExpandedTodoId((currentId) => (currentId === id ? null : currentId));
  };

  const visibleTodos = todos.filter((todo) => {
    if (todoFilter === "active") return !todo.completed;
    if (todoFilter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  const handleCreatePage = () => {
    const now = new Date();
    const newPage = {
      id: createPageId(),
      title: "Untitled Page",
      content: "",
      contentFormat: "html",
      icon: "📄",
      createdAt: now,
      updatedAt: now,
    };

    setPages((currentPages) => [...currentPages, newPage]);
    setSelectedPageId(newPage.id);
  };

  const updateSelectedPage = (updates) => {
    if (!selectedPageId) return;

    setPages((currentPages) =>
      currentPages.map((page) =>
        page.id === selectedPageId
          ? { ...page, ...updates, updatedAt: new Date() }
          : page
      )
    );
  };

  const deletePage = (pageId) => {
    const pageIndex = pages.findIndex((page) => page.id === pageId);
    if (pageIndex === -1 || !window.confirm("Delete this page?")) return;

    const remainingPages = pages.filter((page) => page.id !== pageId);
    setPages(remainingPages);

    if (selectedPageId === pageId) {
      const nextPage =
        remainingPages[pageIndex] ??
        remainingPages[pageIndex - 1] ??
        remainingPages[0];
      setSelectedPageId(nextPage?.id ?? null);
    }
  };

  const selectedPage =
    pages.find((page) => page.id === selectedPageId) ?? null;
  const currentPageWordCount = selectedPage
    ? countWords(htmlToText(selectedPage.content))
    : 0;

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
              <form className="task-input-row" onSubmit={handleAddTodo}>
                <div className="task-fields">
                  <div className="form-field">
                    <label htmlFor="taskName">Task name</label>
                    <input
                      id="taskName"
                      name="taskName"
                      type="text"
                      placeholder="Enter a new task..."
                      autoComplete="off"
                      required
                      value={taskName}
                      onChange={(event) => setTaskName(event.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="taskBody">Description</label>
                    <textarea
                      id="taskBody"
                      name="body"
                      placeholder="Describe what needs to be done..."
                      rows={3}
                      required
                      value={taskBody}
                      onChange={(event) => setTaskBody(event.target.value)}
                    />
                  </div>
                </div>

                <div className="task-form-actions">
                  <button
                    type="submit"
                    className="primary-button add-task-button"
                    disabled={!taskName.trim() || !taskBody.trim()}
                  >
                    <CheckSquare size={17} strokeWidth={2} />
                    <span>Add task</span>
                  </button>
                </div>
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
                    <li
                      key={todo.id}
                      className={`todo-list-item${
                        expandedTodoId === todo.id ? " todo-list-item-expanded" : ""
                      }`}
                    >
                      <div className="todo-content">
                        <input
                          className="todo-checkbox"
                          type="checkbox"
                          checked={todo.completed}
                          aria-label={`Mark ${todo.taskName} as ${
                            todo.completed ? "active" : "completed"
                          }`}
                          onChange={() => toggleTodo(todo.id)}
                        />
                        <button
                          type="button"
                          className="todo-details-toggle"
                          aria-expanded={expandedTodoId === todo.id}
                          onClick={() =>
                            setExpandedTodoId((currentId) =>
                              currentId === todo.id ? null : todo.id
                            )
                          }
                        >
                          <span
                            className={
                              todo.completed
                                ? "todo-text todo-text-done"
                                : "todo-text"
                            }
                          >
                            {todo.taskName}
                          </span>
                          <span
                            className={
                              `todo-body${todo.completed ? " todo-text-done" : ""}${
                                expandedTodoId === todo.id ? " todo-body-expanded" : ""
                              }`
                            }
                          >
                            {todo.body}
                          </span>
                        </button>
                      </div>

                      <button
                        type="button"
                        className="todo-delete"
                        aria-label={`Delete ${todo.taskName}`}
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

        {activeView === "notebook" && (
          <section
            className={`notebook-shell${
              isNotebookPanelCollapsed ? " notebook-panel-collapsed" : ""
            }`}
          >
            {isNotebookPanelCollapsed && (
              <button
                type="button"
                className="notebook-panel-toggle notebook-panel-toggle-open"
                aria-label="Show pages panel"
                onClick={() => setIsNotebookPanelCollapsed(false)}
              >
                <PanelLeftOpen size={16} strokeWidth={1.9} />
              </button>
            )}

            <aside className="notebook-page-panel">
              <div className="notebook-page-header">
                <div>
                  <p className="notebook-section-label">Pages</p>
                  <span className="notebook-page-count">
                    {pages.length} {pages.length === 1 ? "page" : "pages"}
                  </span>
                </div>

                <div className="notebook-page-actions">
                  <button
                    type="button"
                    className="notebook-new-button"
                    onClick={handleCreatePage}
                  >
                    <span aria-hidden="true">+</span>
                    New
                  </button>
                  <button
                    type="button"
                    className="notebook-panel-toggle"
                    aria-label="Hide pages panel"
                    onClick={() => setIsNotebookPanelCollapsed(true)}
                  >
                    <PanelLeftClose size={16} strokeWidth={1.9} />
                  </button>
                </div>
              </div>

              {pages.length === 0 ? (
                <div className="notebook-list-empty">
                  <BookOpen size={24} strokeWidth={1.8} />
                  <p>No pages yet</p>
                  <button
                    type="button"
                    className="notebook-create-link"
                    onClick={handleCreatePage}
                  >
                    Create your first page
                  </button>
                </div>
              ) : (
                <div className="notebook-page-list">
                  {pages.map((page) => (
                    <div
                      key={page.id}
                      className={`notebook-page-item${
                        selectedPageId === page.id ? " active" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="notebook-page-select"
                        onClick={() => setSelectedPageId(page.id)}
                      >
                        <span className="notebook-page-icon" aria-hidden="true">
                          {page.icon}
                        </span>
                        <span className="notebook-page-details">
                          <strong>{page.title.trim() || "Untitled Page"}</strong>
                          <small>{getPagePreview(page.content)}</small>
                        </span>
                      </button>

                      <button
                        type="button"
                        className="notebook-page-delete"
                        aria-label={`Delete ${page.title || "Untitled Page"}`}
                        onClick={() => deletePage(page.id)}
                      >
                        <Trash2 size={15} strokeWidth={1.9} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </aside>

            <div className="notebook-editor-panel">
              {selectedPage ? (
                <>
                  <div className="notebook-document">
                    <div className="notebook-document-header">
                      <div className="notebook-document-identity">
                        <div className="notebook-icon" aria-hidden="true">
                          <FileText size={25} strokeWidth={1.7} />
                        </div>
                        <div className="notebook-title-group">
                          <input
                            className="notebook-title-input"
                            value={selectedPage.title}
                            aria-label="Page title"
                            placeholder="Untitled Page"
                            onChange={(event) =>
                              updateSelectedPage({ title: event.target.value })
                            }
                          />
                          <span className="notebook-last-edited">
                            {getLastEditedLabel(selectedPage.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="notebook-document-actions">
                        <button
                          type="button"
                          onClick={() => navigator.clipboard?.writeText(window.location.href)}
                        >
                          <Share2 size={14} />
                          <span>Share</span>
                        </button>
                        <button
                          type="button"
                          className={selectedPage.favorite ? "active" : ""}
                          aria-label={selectedPage.favorite ? "Remove from favorites" : "Add to favorites"}
                          title={selectedPage.favorite ? "Remove from favorites" : "Add to favorites"}
                          onClick={() => updateSelectedPage({ favorite: !selectedPage.favorite })}
                        >
                          <Star size={15} fill={selectedPage.favorite ? "currentColor" : "none"} />
                        </button>
                        <button
                          type="button"
                          className="notebook-delete-button"
                          aria-label="Delete page"
                          title="Delete page"
                          onClick={() => deletePage(selectedPage.id)}
                        >
                          <Trash2 size={15} strokeWidth={1.9} />
                        </button>
                      </div>
                    </div>
                    <RichTextEditor
                      key={selectedPage.id}
                      content={selectedPage.content}
                      isRichText={selectedPage.contentFormat === "html"}
                      onChange={(content) =>
                        updateSelectedPage({ content, contentFormat: "html" })
                      }
                    />
                    <footer className="notebook-editor-footer">
                      <span>{currentPageWordCount} words</span>
                      <span>Automatically saved</span>
                    </footer>
                  </div>
                </>
              ) : (
                <div className="notebook-editor-empty">
                  <div className="empty-icon">
                    <BookOpen size={27} strokeWidth={1.9} />
                  </div>
                  <h3>Start your NoteBook</h3>
                  <p>
                    Create a page for your notes, plans, ideas, or study
                    materials.
                  </p>
                  <button
                    type="button"
                    className="primary-button notebook-empty-button"
                    onClick={handleCreatePage}
                  >
                    <BookOpen size={17} strokeWidth={2} />
                    Create first page
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {activeView === "focus" && (
          <section className="create-card focus-card">
            <span
              className={`focus-mode-badge${mode === "break" ? " focus-mode-badge-break" : ""}`}
            >
              {mode === "focus" ? "Focus session" : "Break time"}
            </span>

            <PangeaPomodoroTimer
              time={formatTime(secondsLeft)}
              progress={timerProgress}
              mode={mode}
              isRunning={isRunning}
            />

            <div className="focus-controls">
              <button
                type="button"
                className={`focus-control focus-control--primary${
                  isRunning ? " focus-control--pause" : ""
                }`}
                aria-label={isRunning ? "Pause focus timer" : "Start focus timer"}
                onClick={() => setIsRunning((running) => !running)}
              >
                {isRunning ? (
                  <>
                    <span className="focus-control__icon">
                      <Pause size={17} strokeWidth={2.1} />
                    </span>
                    <span className="focus-control__copy">
                      <strong>Pause</strong>
                      <small>Hold your place</small>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="focus-control__icon">
                      <Play size={17} strokeWidth={2.1} fill="currentColor" />
                    </span>
                    <span className="focus-control__copy">
                      <strong>Begin focus</strong>
                      <small>Enter Pangea</small>
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="focus-control focus-control--reset"
                aria-label="Reset focus timer"
                onClick={handleResetTimer}
              >
                <span className="focus-control__icon">
                  <RotateCcw size={16} strokeWidth={1.9} />
                </span>
                <span className="focus-control__copy">
                  <strong>Reset</strong>
                  <small>Start fresh</small>
                </span>
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
