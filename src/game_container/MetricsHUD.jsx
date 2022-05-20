import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import batarang_logo from "../images/bat-silhouette.png"
import { Game } from './GameContainer'

const Container = styled.div`
    width: calc(60rem - 4rem);
    position: fixed;
    height: auto;
    left: 50%;
    top: 2rem;
    transform: translateX(-50%);
    z-index:1;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-column-gap: 2rem;
    justify-content: center;

`

const Cross = styled.div`
    width: .5rem;
    height: 2rem;
    background: white;
    margin:0 1.5rem;
    z-index: 2;
    border-radius: 100px;
    margin-right: .5rem;

    &::after{
        content: "";
        position: absolute;
        top: .7rem;
        left: -.75rem;
        width: 2rem;
        height: .5rem;
        background: white;
        border-radius: 100px;
    }
`

const SpeechBubble = styled.h2`
    width: auto;
    max-width: 100%;
    grid-column: 1/-1;
    background: #232323b2;
    color: #ffffff;
    border-radius: 7px;
    height: auto;
    padding: 1rem 2rem;
    margin: 1rem auto;
    margin-top: 3rem;
    font-family: monospace;
    font-size: 2rem;
    transition: 0.5s;
    opacity: ${props=>props.typing? "1" : "0"};
    border: 2px solid rgba(255,255,255,0.75);
    & > *{
        white-space: pre-line;
    }
`

const Img = styled.img`
    height: 150%;
    transform: translate(10%, 0%);
    z-index: 2;
`

const Counter = styled.span`
    font-size: 2rem;
    z-index: 2;
    font-weight: bold;
    margin-left: 1rem;
    margin-top: -3px;
    height: 100%;
    display: flex;
    align-items: center;
`

const StatusBar = styled.div`
    width:100%;
    height:3.3rem;
    background: #ffffff64;
    border-radius: 1000px;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    border:3px solid ${props => props.black ? "rgba(0,0,0,.6)" : "#ffffff62"};
    display: flex;
    align-items: center;
    animation: ${props => {
        if(!props.initialized){
            return "fadein 0.5s forwards";
        }
        if(props.health){
            if (props.width <= 25) return "low_health 0.5s infinite linear";
            if (props.width <= 50) return "medium_health 1.5s infinite linear";
        }
    }};
    color: ${props => props.white? "white" : "black"};

    &::after{
        content: "";
        width: ${props => props.width+"%"};
        height: 100%;
        background: ${props => props.background};
        position: absolute;
        top:0;
        left: 0;
        transition: 0.2s;
        border-radius: 1000px;
    }
`

function getHealthBarColor(health){
    if(health > 75){
        return '#3ab107c8'
    }
    if(health > 50){
        return '#97b107c6'
    }
    if(health > 25){
        return '#b19507c5'
    }
    if(health > 0){
        return '#b12307c5'
    }
}

let vanishTimeout = 0;

function populateDescription(text="I know Vue, React, and some more advanced features of Javascript.",id="description-ref",expire=2000,setTyping){
    const descriptionRef = document.getElementById(id)
    descriptionRef.innerHTML = "";
    let i = 0;
    const span = document.createElement("span");
    descriptionRef.appendChild(span);
    let itvl = setInterval(()=>{
        if(Game.stoppedState) return;
       if (i < text.length){
        span.innerHTML += text[i]
        i++;
        }else{
            clearInterval(itvl);
            vanishTimeout = setTimeout(()=>{
                setTyping(false);
            },expire);
            return;
        }
    },30)
}

const MetricsHUD = props => {
    const [typing, setTyping] = useState(false);
    const [initialized, setInitialized] = useState(false);
    useEffect(()=>{
        if(props.dialogText){
            clearTimeout(vanishTimeout);
            setTyping(true);
            populateDescription(props.dialogText,"dialog-text",1000,setTyping);
            props.setDialogText("");
        }
    },[props.dialogText])

    useEffect(()=>{
        setTimeout(()=>{
            setInitialized(props.showHealthAndAmmo);
        },500)
    },[props.showHealthAndAmmo])

    const healthBackground = '#3ab107c8';
    const ammoBackground = " #ffff0095";

    return(
        <Container>
           {props.showHealthAndAmmo &&  <>
           <StatusBar initialized={initialized} white health background={getHealthBarColor(props.health)} width={props.health} >
                <Cross></Cross>
               <Counter white>{props.health}</Counter>
           </StatusBar>
           <StatusBar initialized={initialized} black background={ammoBackground} width={props.ammo*10}>
               <Img src={batarang_logo}/>
               <Counter>{props.ammo}</Counter>
           </StatusBar>
           </>}

             <SpeechBubble typing={typing} id='dialog-text'></SpeechBubble>

        </Container>
    )
}

export default MetricsHUD;