import './NavBar.css'
export const Navbar =() =>{

    return (
        <section className="Navbar">
            <div  className="Logo">
                <img src="" alt="image" />
                <h3>Logo</h3>
            </div>
            <ul className="navbar-option">
                <li>Home</li>
                <li>About</li>
                <li>Games</li>
                <li>Faq's</li>
            </ul>

            <button>
                Get In Touch
            </button>
            
        </section>
    )
}