import './HeroSection.css'
import github from "../../assets/github.svg"
import discord from "../../assets/Discord.svg"
import linkdin from "../../assets/linkdin.svg"
import SpotlightCard from '../React-bits/Cards'
export const Herosection =()=>{

    return(
        <>
        <section className="herosection">
            <h3>Empower Developer 
                Engineer Excellence
            </h3>
            <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse exercitationem aspernatur architecto culpa, debitis dolorem. Cumque, hic vel nostrum unde eveniet quibusdam autem quia cum nobis dignissimos doloribus inventore voluptatibus.
            </p>
            <h5>Connect With us</h5>
            <div className='connect-with-us'>
                <button>
                    <img src={github} alt="" />
                </button>
                <button>

                <img src={linkdin} alt="" />
                </button>

                <button>
                <img src={discord} alt="" />

                </button>
            </div>
            
        </section>
        <section className='Our-Services'>
        <h5>Our Services</h5> 
            <div>
            <SpotlightCard>
                
            </SpotlightCard>
             <SpotlightCard>

             </SpotlightCard>
              <SpotlightCard>

              </SpotlightCard>

            </div>
        </section>
         </>
    )
}