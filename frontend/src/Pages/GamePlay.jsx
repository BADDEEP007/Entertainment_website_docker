import { useParams } from "react-router-dom"
import PacmenCanvas from "../Components/Games_files/pacmen/pacmen";
import { Link } from "react-router-dom";

const GamePlay = () => {

    const {gameid} = useParams();


  return (
    
    <div style={{ height: "100vh" }}>
      <div style={{ padding: 12 }}>
        <Link to="/games">← Back to Games</Link>
        <h2 style={{ margin: "8px 0" }}>Playing: {gameid}</h2>
      </div>
      {gameid === "3" && <PacmenCanvas />}
      {gameid !== "3" && <div>Game not implemented yet.</div>}
    </div>
  );}

export default GamePlay;