import { Navbar } from "../Components/HomePage/NavBar"
import { Herosection } from "../Components/HomePage/HeroSection"
import "./Homepage.css"
export const HomePage =() =>{
    return(
        <>
        <div className="Background_images">
            <Navbar/>
            <Herosection/>
        </div>
        <div className="About_background">

        </div>
        </>
    )
}