import React, { useEffect, useState } from "react";
import menuTypes from "./menuTypes";
import styled from 'styled-components'
import level_1 from "../levels/level_1";
import levels from "../levels/Levels";
import Batarang from "../game_objects/projectile/Batarang";
import GameObject from "../game_objects/GameObject";
import CollisionListener from "./CollisionListener";
import MetricsHUD from "./MetricsHUD";
import Menu from "./Menu";
import Emitter from "./Emitter";



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

export class Game extends Emitter{

    playerHealth = 100;
    ammoCount = 5;
    currentLevelIndex = 0;
    static paused = false;
    static death = false;
    static stoppedState = null;
    static listeners = {}
    static emitters = {}
    
    constructor(props){
        super();
        this.props = props;
        this.root = document.getElementById("map");
        this.loadLevel();

        Game.on("pause",()=>{
            Game.paused = true;
            Game.stoppedState = "paused"
        })
        Game.on("unpause",()=>{
            Game.paused = false;
            Game.stoppedState = null;
        })
        Game.on("death",()=>{
            Game.death = true;
            Game.stoppedState = "death";
        })
        Game.on("restart",()=>{
            Game.death = false;
            Game.stoppedState = null;
            GameObject.reset();
            CollisionListener.reset();
            this.level.destroy();
            this.loadLevel();
        })
        Game.listen("keydown",e=>{
            e.preventDefault();
            if(e.keyCode == 27){
                if(Game.paused){
                    Game.emit("unpause")
                }else{
                    Game.emit("pause");
                }
            }
        })
    }

    loadLevel(){
        this.level = new levels[this.currentLevelIndex](this.root);
    }
    clearLevel(){
        this.props.setStarted(false);
        this.props.setStarted(true);
    }
}


const GameContainer = props =>{
    const [health, setHealth] = useState(100);
    const [ammo, setAmmo] = useState(0);
    const [started, setStarted] = useState(false);
    const [death, setDeath] = useState(false);
    const [menuStyle, setMenuStyle] = useState({});
    const [menuVisible, setMenuVisible] = useState(false);
    const [debugVisible, setDebugVisible] = useState(true);
    const [menuType, setMenuType] = useState(menuTypes.pause);
    const [debugState, setDebugState] = useState({
        xPosition: 0,
        boundaryLeft: -300,
        boundaryRight: 300,
        batarangs: Batarang.capacity,   
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
        setHealth(currentHealth);
        if(currentHealth == 0){
            Game.emit("death")
        }
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
           
            setTimeout(()=>{
                window.game = new Game({
                    setStarted,
                });
            },0)
            setStarted(true);
            setInterval(()=>{
                seconds++;
                window.debug({seconds})
            },1000)
           
            const resetMenu = ()=>{
                setMenuStyle({animation:"fadeout 0.3s forwards"});
                setTimeout(()=>{
                    setMenuVisible(false);
                    setMenuType(null);
                },300);
            }
            // pause listeners
            Game.on("pause",()=>{
                setMenuType(menuTypes.pause);
                setMenuStyle({});
                setMenuVisible(true);
            });
            Game.on("unpause",()=>{
               resetMenu();
            });
            Game.on("restart",()=>{
                resetMenu();
             });
            // death listener
            Game.on("death",()=>{                
                setMenuType(menuTypes.death);
                setMenuStyle({});
                setMenuVisible(true);
            })
        }
    },[])

    const exitGamePlay = ()=>{
        setMenuType(menuTypes.levelSelect);
    }

    const resume = ()=>{
        Game.paused = false;
        Game.emit("unpause");
    }

    const restart = ()=>{
        window.game.clearLevel();
        setHealth(100);
        setAmmo(0);
        Game.emit("restart")
    }


    return(
        <>
        {menuVisible && <Menu type={menuType} quit={exitGamePlay} restart={restart} resume={resume} style={menuStyle}/>}
        {(started && menuType != menuTypes.levelSelect)  && <Map id="map">
           
            <MetricsHUD health={health} ammo={ammo}></MetricsHUD>
            {debugVisible && <ul>
                    <P>
                        {Object.keys(debugState).map(key=><li>{key}: {debugState[key]}</li>)}
                    </P>
                </ul>}
        </Map>}
        </>
    )
}

export default GameContainer