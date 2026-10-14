import { useState } from 'react'
import { ROOMS } from './rooms/rooms.js'
import RoomSelector from './components/RoomSelector.jsx'
import ComingSoon from './components/ComingSoon.jsx'
import EditorScreen from './components/EditorScreen.jsx'

export default function App() {
  const [roomId, setRoomId] = useState(null)

  if (!roomId) return <RoomSelector onOpen={setRoomId} />
  if (ROOMS[roomId].status !== 'ready') {
    return <ComingSoon roomId={roomId} onBack={() => setRoomId(null)} onOpenBedroom={() => setRoomId('bedroom')} />
  }
  // key = roomId so each room loads its own saved design from scratch
  return <EditorScreen key={roomId} roomId={roomId} onExit={() => setRoomId(null)} />
}
