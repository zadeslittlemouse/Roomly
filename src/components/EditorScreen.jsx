// The decorating screen. It wires together the editor state (useEditor),
// the 3D scene and all the panels.
import { useState, useEffect, useRef, useCallback } from 'react'
import { ROOMS } from '../rooms/rooms.js'
import { getDef } from '../data/catalog.js'
import { useEditor } from '../hooks/useEditor.js'
import { useThumbnails } from '../hooks/useThumbnails.js'
import { createDefaultDesign, sameDesign } from '../utils/design.js'
import RoomScene from '../scenes/RoomScene.jsx'
import EditorToolbar from './EditorToolbar.jsx'
import FurnitureCatalog from './FurnitureCatalog.jsx'
import Inspector from './Inspector.jsx'
import LightingControls from './LightingControls.jsx'
import ThemeSelector from './ThemeSelector.jsx'
import RoomStyleControls from './RoomStyleControls.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import CompletionScreen from './CompletionScreen.jsx'
import Toast from './Toast.jsx'

const isNarrow = () => window.innerWidth < 900
const WHERE = { floor: 'the floor', top: 'a table', wall: 'a wall' }

export default function EditorScreen({ roomId, onExit }) {
  const room = ROOMS[roomId]
  const { state, actions, saveNow, savedAt, saveFailed } = useEditor(roomId)
  const { design, selected, placing } = state
  const thumbs = useThumbnails()

  const [panelOpen, setPanelOpen] = useState(() => !isNarrow())
  const [tab, setTab] = useState('furniture')
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState(null)
  const [finished, setFinished] = useState(false)
  const toastTimer = useRef(null)
  const toastAction = useRef(null)

  const notify = useCallback((message, actionLabel, action) => {
    toastAction.current = action
    setToast({ message, actionLabel })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), actionLabel ? 6000 : 3200)
  }, [])
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  useEffect(() => {
    if (state.restored) notify('Welcome back. Your saved design was restored.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedItem = design.furniture.find((f) => f.uid === selected)
  const selectedDef = selectedItem && getDef(selectedItem.id)
  const placingDef = placing ? getDef(placing) : null

  // On phones, hide the catalog while editing a selected item so the controls stay visible.
  useEffect(() => { if (selected && isNarrow()) setPanelOpen(false) }, [selected])

  /* ---- actions with confirmations / recovery ---- */
  const remove = useCallback((uid) => {
    const item = design.furniture.find((f) => f.uid === uid)
    if (!item) return
    actions.remove(uid)
    notify(`Removed ${getDef(item.id).name}.`, 'Undo', () => actions.undo())
  }, [design.furniture, actions, notify])

  const requestReset = () => {
    const changed = !sameDesign(design, createDefaultDesign(roomId))
    if (!changed) { notify('The room is already in its original arrangement.'); return }
    setConfirm({
      title: 'Reset this room?',
      body: 'Furniture, colours and lighting go back to the original. You can still undo this.',
      confirmLabel: 'Reset room',
      run: () => { actions.reset(); notify('Room reset.', 'Undo', () => actions.undo()) },
    })
  }
  const requestClear = () => {
    if (!design.furniture.length) { notify('The room is already empty.'); return }
    setConfirm({
      title: 'Clear all furniture?',
      body: 'Every piece will be removed so you can start with an empty room. You can still undo this.',
      confirmLabel: 'Clear room',
      run: () => { actions.clear(); notify('Room cleared.', 'Undo', () => actions.undo()) },
    })
  }

  const pick = (id) => {
    actions.startPlace(id)
    if (isNarrow()) setPanelOpen(false)
  }

  const save = () => { if (saveNow()) notify('Saved in this browser.') }
  const back = () => { saveNow(); onExit() }
  const finish = () => { actions.select(null); actions.cancelPlace(); saveNow(); setFinished(true) }

  /* ---- keyboard shortcuts ---- */
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? actions.redo() : actions.undo(); return }
      if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); actions.redo(); return }
      if (e.key === 'Escape') { placing ? actions.cancelPlace() : actions.select(null); return }
      if (!selectedItem) return
      if ((e.key === 'Delete' || e.key === 'Backspace') && !confirm) { e.preventDefault(); remove(selectedItem.uid) }
      if (e.key.toLowerCase() === 'r' && selectedDef.kind !== 'wall') actions.rotate(selectedItem.uid, e.shiftKey ? -1 : 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="editor">
      {!finished && (
        <EditorToolbar
          roomName={room.name}
          canUndo={state.past.length > 0}
          canRedo={state.future.length > 0}
          hasSelection={!!selected}
          panelOpen={panelOpen}
          savedAt={savedAt}
          saveFailed={saveFailed}
          onBack={back}
          onUndo={actions.undo}
          onRedo={actions.redo}
          onSave={save}
          onReset={requestReset}
          onClear={requestClear}
          onDeselect={() => actions.select(null)}
          onTogglePanel={() => setPanelOpen((v) => !v)}
          onFinish={finish}
        />
      )}

      <div className="editor-body">
        <div className="stage">
          <RoomScene
            room={room}
            design={design}
            selected={selected}
            placing={placing}
            actions={actions}
            notify={notify}
            interactive={!finished}
            intro
            autoOrbit={finished}
          />

          {placingDef && !finished && (
            <div className="place-bar" role="status">
              <span>Placing <strong>{placingDef.name}</strong>. Click {WHERE[placingDef.kind]} to put it down.</span>
              <button className="btn btn-quiet" onClick={actions.cancelPlace}>Cancel</button>
            </div>
          )}

          {selectedDef && !finished && (
            <Inspector
              def={selectedDef}
              ids={room.catalogIds}
              thumbs={thumbs}
              onRotate={(dir) => actions.rotate(selectedItem.uid, dir)}
              onReplace={(id) => actions.replace(selectedItem.uid, id)}
              onRemove={() => remove(selectedItem.uid)}
              onDone={() => actions.select(null)}
            />
          )}

          {!finished && design.furniture.length === 0 && !placing && (
            <div className="empty-room">
              <strong>An empty room</strong>
              <span>Pick something from the catalog to begin.</span>
            </div>
          )}

          <Toast toast={toast} onAction={() => { toastAction.current?.(); setToast(null) }} />
        </div>

        {!finished && (
          <aside id="side-panel" className={`side ${panelOpen ? 'is-open' : ''}`} aria-label="Furniture and room settings">
            <div className="side-tabs" role="tablist">
              <button role="tab" aria-selected={tab === 'furniture'} className={tab === 'furniture' ? 'is-active' : ''} onClick={() => setTab('furniture')}>Furniture</button>
              <button role="tab" aria-selected={tab === 'room'} className={tab === 'room' ? 'is-active' : ''} onClick={() => setTab('room')}>Walls &amp; light</button>
              <button className="side-close" onClick={() => setPanelOpen(false)} aria-label="Close panel">&times;</button>
            </div>
            <div className="side-scroll">
              {tab === 'furniture' ? (
                <FurnitureCatalog room={room} placing={placing} thumbs={thumbs} onPick={pick} />
              ) : (
                <div className="room-controls">
                  <ThemeSelector value={design.theme} onChange={actions.setTheme} />
                  <RoomStyleControls walls={design.walls} floor={design.floor} onWalls={actions.setWalls} onFloor={actions.setFloor} />
                  <LightingControls value={design.lighting} onChange={actions.setLighting} />
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          body={confirm.body}
          confirmLabel={confirm.confirmLabel}
          onCancel={() => setConfirm(null)}
          onConfirm={() => { confirm.run(); setConfirm(null) }}
        />
      )}
      {finished && (
        <CompletionScreen design={design} roomName={room.name} onKeepEditing={() => setFinished(false)} onRooms={onExit} />
      )}
    </div>
  )
}
