import { Navbar } from "../Components/HomePage/NavBar"
import { Herosection } from "../Components/HomePage/HeroSection"
import "./Homepage.css"
import { About } from "../Components/About/AboutSection"
import { FeaturedGames } from "../Components/Games/FeaturedGames"
import { FAQ } from "../Components/FAQ/FAQ"
import { Footer } from "../Components/Footer/Footer"

export const HomePage =() =>{
    return(
        <>
        <div className="Background_images" id="home">
            <Navbar/>
            <Herosection/>
        </div>
        <div id="about">
            <About/>
        </div>
        <div id="games">
            <FeaturedGames/>
        </div>
        <div id="faq">
            <FAQ/>
        </div>
        <Footer/>
        </>
    )
}