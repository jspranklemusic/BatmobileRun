import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import level_1 from "../levels/level_1";
import Batarang from "../game_objects/projectile/Batarang";

const Map = styled.div`
    width: 100vw;
    height: 100vh;
    background: black;
`

const P = styled.p`
    font-size:1rem;
    color: white; 
    font-weight: 300;
    position: fixed;
    top: 0;
    left: 0;
`

let mounted = false;

class Game{
    
    playerHealth = 100;
    ammoCount = 5;

    constructor(){
        this.root = document.getElementById("map")
        this.loadLevel();
    }

    loadLevel(){
        this.level_1 = new level_1(this.root);
    }
}


const GameContainer = props =>{
    const [debugVisible, setDebugVisible] = useState(true)
    const [debugState, setDebugState] = useState({
        xPosition: 0,
        boundaryLeft: -300,
        boundaryRight: 300,
        batarangs: Batarang.capacity,
        speed: 3
    })

    window.setDebugState = setDebugState;
    window.debugState = debugState;
    window.debug = function(obj){
        window.setDebugState({...window.debugState, ...obj})
    }
    window.clearDebug = function(key){
        const obj = {...debugState};
        delete obj[key];
        setDebugState(obj);
    }

    useEffect(()=>{
        if(mounted){
            return;
        }else{
            mounted = true; 
            window.game = new Game();
        }
    },[])

    return(
        <Map id="map">
          {debugVisible && <ul>
                <P>
                    {Object.keys(debugState).map(key=><li>{key}: {debugState[key]}</li>)}
                </P>
            </ul>}
        </Map>
    )
}

export default GameContainer