import {react} from 'react'
import "./SelectionRoomCreateScene.css"

function SelectionRoomCreateScene(){
    return(
        <div className='SelectionRoomCreateScene'>
            <h1>Criação de cena</h1>
            <form>
                <h3>Nome da cena</h3>
                <input type="text" placeholder="Digite o nome da cena" className="name_scene_input"/>
                <h3>Selecione os dispositivos</h3>
                //Fazer um get dos dispositivos cadastrados
                <br/>
                <h3></h3>
                <button className="create_scene_button">Criar cena</button> 
            </form>
        </div>
    )
}

export default SelectionRoomCreateScene;