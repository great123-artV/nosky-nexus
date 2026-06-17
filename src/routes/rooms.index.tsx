import { createFileRoute } from '@tanstack/react-router'
import { RoomsList } from './rooms'

export const Route = createFileRoute('/rooms/')({
  component: RoomsList,
})
