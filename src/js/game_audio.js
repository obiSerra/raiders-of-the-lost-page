import { playSound } from "./audio.js"

const squareNote = (note) => ({ ...note, oscillator: "square" })
const sectOctave = (note, oct) => `${note}${oct}`

const soundEnabled = (gameState, handler) => {
    const audio = gameState.getState("audio")
    if (audio) return handler()
}

export function pick404(gameState) {
    soundEnabled(gameState, () => {
        playSound(
            gameState,
            squareNote({ note: sectOctave("A", 3), duration: 0.1 })
        )
            .then(() =>
                playSound(
                    gameState,
                    squareNote({ note: sectOctave("B", 3), duration: 0.1 })
                )
            )
            .then(() =>
                playSound(
                    gameState,
                    squareNote({ note: sectOctave("G", 4), duration: 0.1 })
                )
            )
    })
}

export function pickExit(gameState) {
    soundEnabled(gameState,() => {
        playSound(
            gameState,
            squareNote({ note: sectOctave("A", 3), duration: 0.1 })
        )
            .then(() =>
                playSound(
                    gameState,
                    squareNote({ note: sectOctave("B", 3), duration: 0.1 })
                )
            )
            .then(() =>
                playSound(
                    gameState,
                    squareNote({ note: sectOctave("C#", 4), duration: 0.1 })
                )
            )
            .then(() =>
                playSound(
                    gameState,
                    squareNote({ note: sectOctave("F#", 4), duration: 0.1 })
                )
            )
    })
}

export function lifeLost(gameState) {
    soundEnabled(gameState, () => {
        playSound(
            gameState,
            squareNote({ note: sectOctave("F#", 4), duration: 0.1 })
        )
            .then(() =>
                playSound(
                    gameState,
                    squareNote({ note: sectOctave("C#", 4), duration: 0.1 })
                )
            )
            .then(() =>
                playSound(
                    gameState,
                    squareNote({ note: sectOctave("B", 3), duration: 0.1 })
                )
            )
            .then(() =>
                playSound(
                    gameState,
                    squareNote({ note: sectOctave("A", 3), duration: 0.2 })
                )
            )
    })
}
