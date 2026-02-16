// Audio Manager for Game Sounds
// This utility helps manage game audio with fallback support

class AudioManager {
    constructor() {
        this.sounds = {}
        this.bgMusic = null
        this.isMuted = false
    }

    // Load a sound effect
    loadSound(name, url) {
        try {
            const audio = new Audio(url)
            audio.preload = 'auto'
            this.sounds[name] = audio
        } catch (error) {
            console.warn(`Failed to load sound: ${name}`, error)
        }
    }

    // Play a sound effect
    playSound(name, volume = 1.0) {
        if (this.isMuted) return
        
        const sound = this.sounds[name]
        if (sound) {
            try {
                sound.currentTime = 0
                sound.volume = volume
                sound.play().catch(err => {
                    console.warn(`Failed to play sound: ${name}`, err)
                })
            } catch (error) {
                console.warn(`Error playing sound: ${name}`, error)
            }
        }
    }

    // Load and play background music
    playBgMusic(url, volume = 0.3) {
        if (this.isMuted) return

        try {
            if (this.bgMusic) {
                this.bgMusic.pause()
            }
            
            this.bgMusic = new Audio(url)
            this.bgMusic.loop = true
            this.bgMusic.volume = volume
            this.bgMusic.play().catch(err => {
                console.warn('Failed to play background music', err)
            })
        } catch (error) {
            console.warn('Error with background music', error)
        }
    }

    // Stop background music
    stopBgMusic() {
        if (this.bgMusic) {
            this.bgMusic.pause()
            this.bgMusic.currentTime = 0
        }
    }

    // Toggle mute
    toggleMute() {
        this.isMuted = !this.isMuted
        
        if (this.isMuted && this.bgMusic) {
            this.bgMusic.pause()
        } else if (!this.isMuted && this.bgMusic) {
            this.bgMusic.play().catch(() => {})
        }
        
        return this.isMuted
    }

    // Set volume for background music
    setBgVolume(volume) {
        if (this.bgMusic) {
            this.bgMusic.volume = Math.max(0, Math.min(1, volume))
        }
    }

    // Cleanup
    cleanup() {
        this.stopBgMusic()
        Object.values(this.sounds).forEach(sound => {
            sound.pause()
            sound.currentTime = 0
        })
    }
}

export default AudioManager

// Example usage in games:
/*
import AudioManager from '../../utils/audioManager'

const audioManager = new AudioManager()

// Load sounds
audioManager.loadSound('chomp', '/sounds/chomp.mp3')
audioManager.loadSound('death', '/sounds/death.mp3')

// Play sounds
audioManager.playSound('chomp', 0.5)

// Background music
audioManager.playBgMusic('/sounds/game-music.mp3', 0.3)

// Cleanup on unmount
useEffect(() => {
    return () => audioManager.cleanup()
}, [])
*/
