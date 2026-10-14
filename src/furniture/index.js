// All 3D models: the original bedroom set plus the models for the other rooms.
import { MODELS } from './models.js'
import { ROOM_MODELS } from './models-rooms.js'
import { MORE_MODELS } from './models-more.js'

export const ALL_MODELS = { ...MODELS, ...ROOM_MODELS, ...MORE_MODELS }
