# Game Audio Files

This directory contains audio files for the games.

## How to Add Audio

1. Place your audio files (MP3, WAV, or OGG format) in this directory
2. Update the game components to load the sounds using the AudioManager

## Recommended Audio Files

### Pac-Man
- `pacman-chomp.mp3` - Eating dots sound
- `pacman-death.mp3` - Death sound
- `pacman-eat-ghost.mp3` - Eating ghost sound
- `pacman-bg.mp3` - Background music

### Tetris
- `tetris-move.mp3` - Piece movement sound
- `tetris-rotate.mp3` - Piece rotation sound
- `tetris-clear.mp3` - Line clear sound
- `tetris-gameover.mp3` - Game over sound
- `tetris-bg.mp3` - Background music (Korobeiniki theme)

### Snake
- `snake-eat.mp3` - Eating food sound
- `snake-gameover.mp3` - Game over sound
- `snake-bg.mp3` - Background music

## Free Audio Resources

You can find free game audio at:
- [Freesound.org](https://freesound.org/)
- [OpenGameArt.org](https://opengameart.org/)
- [Zapsplat.com](https://www.zapsplat.com/)
- [Mixkit.co](https://mixkit.co/free-sound-effects/game/)

## Audio Format Recommendations

- Use MP3 for best browser compatibility
- Keep file sizes small (under 100KB for sound effects)
- Use 128kbps bitrate for background music
- Normalize audio levels to prevent clipping

## Implementation Example

```javascript
import AudioManager from '../../utils/audioManager'

const audioManager = new AudioManager()

// Load sounds
audioManager.loadSound('chomp', '/sounds/pacman-chomp.mp3')
audioManager.playBgMusic('/sounds/pacman-bg.mp3', 0.3)

// Play sound
audioManager.playSound('chomp', 0.5)
```

## Note

The games currently have placeholder audio functions. Once you add audio files here, update the `playSound()` functions in each game component to use the AudioManager utility.
