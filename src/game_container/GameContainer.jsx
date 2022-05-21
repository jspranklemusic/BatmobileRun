import React, { useEffect, useState } from "react";
import menuTypes from "./menuTypes";
import styled from 'styled-components'
import levels from "../levels/Levels";
import Batarang from "../game_objects/projectile/Batarang";
import GameObject from "../game_objects/GameObject";
import CollisionListener from "./CollisionListener";
import MetricsHUD from "./MetricsHUD";
import Menu from "./Menu";
import Emitter from "./Emitter";
import MainMenu from "./MainMenu";

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
    static moveDisabled = false;
    static accelerateDisabled = false;
    
    constructor(props){
        super();
        this.props = props;
        this.root = document.getElementById("map");

        Game.on("checkpoint",()=>{
        })

        Game.on("level-completion",()=>{
            Game.paused = true;
            Game.stoppedState = "level-completion"
        })

        Game.on('toggle-h&a',state=>{
            this.props.setShowHealthAndAmmo(state)
        })

        Game.on("new-dialog",(text)=>{
            console.log(text,this.props);
            this.props.setDialogText(text);
        })

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
            this.clear();
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

    clear(){
        window.changeAmmo(-100);
        window.changeHealth(100);
        this.props.setShowHealthAndAmmo(false)
        Game.death = false;
        Game.stoppedState = null;
        GameObject.reset();
        CollisionListener.reset();
        this.level.destroy();
    }

    nextLevel(){
        this.currentLevelIndex++;
        this.props.setLevel(this.currentLevelIndex);
        this.props.setShowHealthAndAmmo(false);
        Game.emit("restart");
    }

    loadLevel(i=null){
   
        Game.accelerateDisabled = false;
        Game.moveDisabled = false;
        if(i !== null){
            this.currentLevelIndex = i;
        }
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
    const [dialogText, setDialogText] = useState("");
    const [level, setLevel] = useState(0);
    const [showHealthAndAmmo, setShowHealthAndAmmo] = useState(false);
    const [mainMenuVisible, setMainMenuVisible] = useState(true);
    const [mainMenuOpacity, setMainMenuOpacity] = useState(0);
    const [debugState, setDebugState] = useState({
        xPosition: 0,
        boundaryLeft: -300,
        boundaryRight: 300,
        batarangs: Batarang.capacity,   
    })

    const clickHandler = i => {
        setMainMenuOpacity(0);
        setTimeout(()=>{
            setMainMenuVisible(false);
            window.game.loadLevel(i);
        },1000)
    }

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
        let newAmmo = currentAmmo + amt;
        if(newAmmo <= 0) newAmmo = 0;
        if(newAmmo > 100) newAmmo = 100;
        setAmmo(newAmmo);
    }
    
    useEffect(()=>{
        if(mounted){
            return;
        }else{
            // set global functions that can be called from anywhere in the app
            mounted = true; 
            setTimeout(()=>{
                window.game = new Game({
                    setStarted,
                    setDialogText,
                    setLevel,
                    setShowHealthAndAmmo
                });
            },0)
            setStarted(true);
            setMainMenuOpacity(1);
            setInterval(()=>{
                seconds++;
                window.debug({seconds})
            },1000)
            // pause listeners
            Game.on("pause",()=>{
                showMenu(menuTypes.pause)
            });
            Game.on("unpause",()=>{
               resetMenu();
            });
            Game.on("restart",()=>{
                resetMenu();
             });
            // death listener
            Game.on("death",()=>{                
                showMenu(menuTypes.death)
            })
            Game.on("level-completion",()=>{
                showMenu(menuTypes.levelCompletion)
            })

        }
    },[])

    const exitGamePlay = ()=>{
        resetMenu();
        window.game.clear();
        setMainMenuVisible(true);
        setTimeout(()=>{
            setMainMenuOpacity(1);
        },1000)
    }

    const nextLevel = ()=>{
        window.game.nextLevel();
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

    const showMenu = (type)=>{
        setMenuType(type);
        setMenuStyle({});
        setMenuVisible(true);
    }

    const resetMenu = ()=>{
        setMenuStyle({animation:"fadeout 0.3s forwards"});
        setTimeout(()=>{
            setMenuVisible(false);
            setMenuType(null);
        },300);
    }


    return(
        <>
        {menuVisible && !mainMenuVisible && <Menu 
            type={menuType} 
            quit={exitGamePlay} 
            restart={restart} 
            resume={resume} 
            nextLevel={nextLevel}
            level={level}
            style={menuStyle}/>}
        {(started && menuType != menuTypes.levelSelect)  && <Map id="map">
           
            {!mainMenuVisible && <MetricsHUD 
                health={health} 
                ammo={ammo}
                dialogText={dialogText}
                setDialogText={setDialogText}
                level={level}
                showHealthAndAmmo={showHealthAndAmmo}
            />}
            {debugVisible && !mainMenuVisible && <ul>
                    <P>
                        {Object.keys(debugState).map(key=><li>{key}: {debugState[key]}</li>)}
                    </P>
                </ul>}
        </Map>}
        {mainMenuVisible && <MainMenu opacity={mainMenuOpacity} clickHandler={clickHandler} levels={levels}/>}
        </>
    )
}

export default GameContainer