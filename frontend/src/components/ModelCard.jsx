import { Check, ChevronUp, ChevronDown, ImageIcon } from "./Icons"
import "./ModelCard.css"

export const ModelCard = ({ model, isSelected, isExpanded, onSelect, onExpand, onUseModel }) => {
    return (
        <div className="model-card-wrapper">
            <div 
                className={`model-card ${isSelected ? "selected" : ""} ${isExpanded ? "expanded" : ""}`}
                onClick={onSelect}
            >
                <div className="model-card-header">
                    <div className="model-icon">{model.icon}</div>
                    <div className="model-title-section">
                        <h4>{model.shortName}</h4>
                        <span className="model-category">{model.category}</span>
                    </div>
                    {isSelected && (
                        <div className="model-selected-badge">
                            <Check size={16} />
                        </div>
                    )}
                </div>
                
                <button 
                    className="model-expand-btn"
                    onClick={(e) => {
                        e.stopPropagation()
                        onExpand()
                    }}
                    aria-label={isExpanded ? "Show less" : "Show more"}
                >
                    {isExpanded ? (
                        <>
                            Show Less
                            <ChevronUp size={16} />
                        </>
                    ) : (
                        <>
                            Show More
                            <ChevronDown size={16} />
                        </>
                    )}
                </button>
            </div>
            
            {isExpanded && (
                <ModelDetails model={model} onUse={onUseModel || onSelect} />
            )}
        </div>
    )
}

const ModelDetails = ({ model, onUse }) => {
    return (
        <div className="model-details-panel">
            <div className="model-details-header">
                <h4>{model.name}</h4>
                <span className="model-id">{model.id}</span>
            </div>
            
            <div className="model-description">
                {model.description || (
                    <p className="placeholder-text">
                        Description will be added soon. This model specializes in {model.category.toLowerCase()} style image generation.
                    </p>
                )}
            </div>
            
            <div className="model-samples">
                <h5>
                    <ImageIcon size={18} className="inline-icon" />
                    Sample Images
                </h5>
                {model.sampleImages.length > 0 ? (
                    <div className="sample-gallery">
                        {model.sampleImages.map((img, idx) => (
                            <img 
                                key={idx} 
                                src={img} 
                                alt={`${model.name} sample ${idx + 1}`}
                                className="sample-image"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="sample-placeholder">
                        <div className="placeholder-grid">
                            <div className="placeholder-box">
                                <ImageIcon size={32} />
                            </div>
                            <div className="placeholder-box">
                                <ImageIcon size={32} />
                            </div>
                            <div className="placeholder-box">
                                <ImageIcon size={32} />
                            </div>
                        </div>
                        <p className="placeholder-text">Sample images coming soon</p>
                    </div>
                )}
            </div>
            
            <button 
                className="use-model-btn"
                onClick={onUse}
            >
                <Check size={18} />
                Use This Model
            </button>
        </div>
    )
}
