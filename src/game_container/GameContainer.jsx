import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import level_1 from "../levels/level_1";
import Batarang from "../game_objects/projectile/Batarang";
import MetricsHUD from "./MetricsHUD";

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
let seconds = 0;

export class Game{

    playerHealth = 100;
    ammoCount = 5;
    static paused = false;
    
    constructor(){
        this.root = document.getElementById("map");
        this.loadLevel();
    }

    loadLevel(){
        this.level_1 = new level_1(this.root,this);
    }
}


const GameContainer = props =>{
    const [health, setHealth] = useState(100);
    const [ammo, setAmmo] = useState(0);
    const [started, setStarted] = useState(false);
    const [debugVisible, setDebugVisible] = useState(true);
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

    window.changeHealth = function(amt){
        // amt can be positive or negative;
        let currentHealth = health + amt;
        if(currentHealth < 0) currentHealth = 0;
        if(currentHealth > 100) currentHealth = 100;
        console.log(currentHealth,health,amt)
        setHealth(currentHealth);
    }

    window.changeAmmo = function(amt){
        // amt can be positive or negative;
        let currentAmmo = ammo;
        if(currentAmmo < 0) currentAmmo = 0;
        if(currentAmmo > 100) currentAmmo = 100;
        setAmmo(currentAmmo + amt);
    }

    useEffect(()=>{
        if(mounted){
            return;
        }else{
            mounted = true; 
            window.game = new Game();
            setStarted(true);
            setInterval(()=>{
                seconds++;
                window.debug({seconds})
            },1000)
        }
    },[])

    return(
        <>
        
        <Map id="map">
            <MetricsHUD health={health} ammo={ammo}></MetricsHUD>
          {debugVisible && <ul>
                <P>
                    {Object.keys(debugState).map(key=><li>{key}: {debugState[key]}</li>)}
                </P>
            </ul>}
        </Map>
        </>
    )
}

export default GameContainer