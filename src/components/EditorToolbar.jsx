import SaveIndicator from './SaveIndicator.jsx'

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
)

export default function EditorToolbar({ roomName, canUndo, canRedo, hasSelection, panelOpen, savedAt, saveFailed, onBack, onUndo, onRedo, onSave, onReset, onClear, onDeselect, onTogglePanel, onFinish }) {
  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <button className="btn btn-quiet" onClick={onBack} aria-label="Back to room selection"><Icon d="M15 18l-6-6 6-6" /><span className="lbl">Rooms</span></button>
        <span className="brand brand-sm">ROOMLY</span>
        <span className="room-name">{roomName}</span>
      </div>
      <div className="toolbar-mid">
        <button className="btn btn-icon" onClick={onUndo} disabled={!canUndo} aria-label="Undo" title="Undo (Ctrl+Z)"><Icon d="M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3" /><span className="lbl">Undo</span></button>
        <button className="btn btn-icon" onClick={onRedo} disabled={!canRedo} aria-label="Redo" title="Redo (Ctrl+Shift+Z)"><Icon d="M15 14l5-5-5-5M20 9H10a6 6 0 000 12h3" /><span className="lbl">Redo</span></button>
        <button className="btn btn-icon" onClick={onDeselect} disabled={!hasSelection} aria-label="Deselect" title="Deselect (Esc)"><Icon d="M6 6l12 12M18 6L6 18" /><span className="lbl">Deselect</span></button>
        <details className="menu">
          <summary className="btn btn-icon" aria-label="More options"><Icon d="M5 12h.01M12 12h.01M19 12h.01" /><span className="lbl">More</span></summary>
          <div className="menu-pop">
            <button onClick={onReset}>Reset to the original room</button>
            <button onClick={onClear}>Clear all furniture</button>
          </div>
        </details>
      </div>
      <div className="toolbar-right">
        <SaveIndicator savedAt={savedAt} failed={saveFailed} />
        <button className="btn" onClick={onSave}><Icon d="M5 4h11l3 3v13H5zM8 4v5h7M8 20v-6h8v6" /><span className="lbl">Save</span></button>
        <button className="btn btn-icon panel-toggle" onClick={onTogglePanel} aria-expanded={panelOpen} aria-controls="side-panel"><Icon d="M4 6h16M4 12h16M4 18h10" /><span className="lbl">{panelOpen ? 'Hide catalog' : 'Show catalog'}</span></button>
        <button className="btn btn-primary" onClick={onFinish}>Finish room</button>
      </div>
    </header>
  )
}
