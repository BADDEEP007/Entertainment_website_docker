import { useNavigate } from 'react-router-dom'
import './PlatformModules.css'

const MOVIE_PLANNER_URL = import.meta.env.VITE_MOVIE_PLANNER_URL ?? "http://127.0.0.1:5000/new"

export const PlatformModules = () => {
    const navigate = useNavigate()

    const modules = [
        {
            id: 'gaming',
            icon: '🎮',
            title: 'Gaming',
            description: 'Jump into classic browser games — Pac-Man, Tetris, Snake, Vice City and more. No downloads, instant play.',
            cta: 'Browse Games',
            accent: '#4ade80',
            accentBg: 'rgba(74, 222, 128, 0.08)',
            accentBorder: 'rgba(74, 222, 128, 0.2)',
            onClick: () => navigate('/games'),
        },
        {
            id: 'create',
            icon: '🎨',
            title: 'Create',
            description: 'Generate stunning anime art with AI. Describe your vision, let the Director refine it, and watch it come to life.',
            cta: 'Start Creating',
            accent: '#c084fc',
            accentBg: 'rgba(192, 132, 252, 0.08)',
            accentBorder: 'rgba(192, 132, 252, 0.2)',
            onClick: () => navigate('/ai'),
        },
        {
            id: 'recommendations',
            icon: '🤖',
            title: 'Smart Recommendations',
            description: 'Tell the AI how you feel and get personalized movie recommendations powered by LangChain and mood analysis.',
            cta: 'Get Recommendations',
            accent: '#f472b6',
            accentBg: 'rgba(244, 114, 182, 0.08)',
            accentBorder: 'rgba(244, 114, 182, 0.2)',
            onClick: () => window.open(MOVIE_PLANNER_URL, '_blank'),
            external: true,
        },
    ]

    return (
        <section className="platform-modules-section">
            <div className="pm-header">
                <h2 className="pm-title">Everything in One Place</h2>
                <p className="pm-subtitle">Three powerful experiences, one unified platform</p>
            </div>

            <div className="pm-grid">
                {modules.map((mod) => (
                    <div
                        key={mod.id}
                        className="pm-card"
                        style={{
                            '--accent': mod.accent,
                            '--accent-bg': mod.accentBg,
                            '--accent-border': mod.accentBorder,
                        }}
                        onClick={mod.onClick}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && mod.onClick()}
                        aria-label={`Navigate to ${mod.title}`}
                    >
                        <div className="pm-card-icon">{mod.icon}</div>
                        <h3 className="pm-card-title">{mod.title}</h3>
                        <p className="pm-card-desc">{mod.description}</p>
                        <div className="pm-card-cta">
                            <span>{mod.cta}</span>
                            <span className="pm-cta-arrow">{mod.external ? '↗' : '→'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
