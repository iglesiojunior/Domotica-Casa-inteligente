import {react} from 'react'
import "./HouseCard.css"

function HouseCard({casa, onClick}) {
    return(
        <div className='card_house' onClick={() => onClick(casa)}>
            <h3>{casa.nome}</h3>
            <p>Total de cômodos: {casa.total_comodos}</p>
            <p>Endereço: {casa.endereco}</p>
        </div>
    )
}

export default HouseCard;