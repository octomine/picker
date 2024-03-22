import 'phaser'
import './App.css'
import { initGame, Game } from './components/game'

window.addEventListener('load', initGame)

function App() {
  return (
    <div><Game></Game></div>
  )
}

export default App
