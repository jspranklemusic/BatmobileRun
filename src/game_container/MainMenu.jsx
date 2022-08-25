import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import citySvg from "../images/City-Skyline-Silhouette.svg"
import batLogo from "../images/bat-silhouette.png";

const FullScreenWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background: linear-gradient(#394054,#2b1c35);
    padding: 0;
    margin: 0;
    transition: 1s;
    opacity: ${props=>props.opacity};
`

const BatSymbol = styled.div`
    position: absolute;
    top: 10%;
    left: 20%;
    width: 250px;
    height: 150px;
    border-radius: 50%;
    padding: 2rem;
    transform: perspective(400px) rotateY(30deg) rotateX(-10deg);
    z-index: 1;
    box-shadow: 4px 4px 40px 40px #ffff00;
    background-image: url(${batLogo}), linear-gradient(#ffff00,#ffff00);
    background-size: 100%;
    background-position: 0;
    opacity: 0.6;
    animation: batsymbol 20s linear infinite;

    &::before{
        content:"";
        width: 3000px;
        height: 160%;
        position: absolute; 
        top: 0;
        left: 0;
        z-index: -1;
        background: linear-gradient(90deg, transparent, yellow);
        transform: rotateZ(45deg) translateY(-120px);
        border-radius: 10000px;
        transform-origin: left;
    }

    &::after{
        content:"";
        width: 100%;
        height: 100%;
        position: absolute; 
        top: 0;
        left: 0;
        opacity: 0.5;
        z-index: 1;
    }

    .beams{
    }
`

const StarsWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    animation: spinning 400s infinite linear;
    transform-origin: center;
    top: -75%;
`

const objectStyle = {
    minWidth: "120%",
    minHeight: "60vh",
    position: "absolute",
    left: "-3.2rem",
    bottom: "-4rem",
    zIndex: 2
}

const Menu = styled.div`
    & > *{
        color: #ffffffe2;
        text-shadow: 3px 3px 3px black;
        font-family: monospace;
    }

    h1{
        text-align: center;
        padding: 1rem;
        font-size: 5rem;
        text-transform: uppercase;
        border-bottom: 2px solid #ffffffe2;
        width: max-content;
        margin: 0 auto;
    
    }

    em{
        font-size: 2rem;
        display: block;
        text-align: center;
        padding-top: 3rem;
    }

    width: 60rem;
    height: 80vh;
    position: absolute;
    /* border: 1px solid grey; */
    z-index: 50;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 10px;

    .levels-container{
        display: flex;
        width: 100%;
        height: auto;
        justify-content: space-evenly;
        font-size: 2rem;
        margin-top: 3rem;
        &>*{
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
`

const length = 500;

const genParticles = (xFormula, yFormula, wrapper)=>{
let radius = 1;
for(var i = 1; i < length; i++){
    const particle = document.createElement("div");
    let startX = window.innerWidth/2;
    let startY = window.innerHeight/2;
    let endY = radius * yFormula(i) + startY;
    let endX = radius * xFormula(i) + startX;

    radius += 2;
    let rand = Math.random();
    let color = rand < 0.9 ? "white" : rand < 0.92 ? "cyan" : rand < 0.95 ? "pink" : "yellow"
    let width = rand < 0.3 ? 2 : rand < 0.6 ? 3 : 4;
    particle.style = `
        width: ${width}px;
        height: ${width}px;
        background: ${color};
        top: ${endY}px;
        left: ${endX}px;
        border-radius: 50%;
        box-shadow: 0px 0px 7px ${color};
        position: absolute;
        opacity: ${(1 - i/length) + Math.random()/4};
        animation: flicker ${0.5 + Math.random()*2}s linear infinite;
    `

    wrapper.appendChild(particle)
} 
}

const LevelContainer = styled.div`
    width: 100px;
    height: 100px;
    background: rgba(0,0,0,.8);
    border-radius: 8px;
    border: 2px solid transparent;
    transition: none;
    &:hover{
        cursor: pointer;
        border: 1px solid white;
    }
`

const MainMenu = props =>{
    const [loaded, setLoaded] = useState(false);

    useEffect(()=>{
        if(!loaded){
            setLoaded(true);
            const wrapper = document.getElementById("main-menu-wrapper");
            
            // log10 of i^2
            const yFormula1 = i => Math.sin(Math.PI * 2 * ((i*50)/Math.log10(i^2)) / 360);
            const xFormula1 = i => Math.cos(Math.PI * 2 * ((i*50)/Math.log10(i^2)) / 360);
            // log10 of sqrt i
            const yFormula2 = i => Math.sin(Math.PI * 2 * ((i*50)/Math.log10(Math.sqrt(i))) / 360);
            const xFormula2 = i => Math.cos(Math.PI * 2 * ((i*50)/Math.log10(Math.sqrt(i))) / 360);
            // Archimedean spiral
            const yFormula3 = i => Math.sin(Math.PI * 2 * ((i*7)) / 360);
            const xFormula3 = i => Math.cos(Math.PI * 2 * ((i*7)) / 360);
            // genParticles(xFormula2,yFormula2,wrapper)
            genParticles(xFormula1,yFormula1,wrapper)
        }
    },[])

    return(<>
        <FullScreenWrapper opacity={props.opacity}>
            <StarsWrapper id="main-menu-wrapper"/>
            <BatSymbol>
                <div className='beams'></div>
            </BatSymbol>
                <object style={objectStyle} data={citySvg} type="image/svg+xml"></object>
                <Menu>
                    <h1>Happy Birthday, Dominic</h1>
                    <em>Select a level</em>
                    <div className="levels-container">
                        {props.levels.map((level,i)=>{
                            return <LevelContainer onClick={()=>props.clickHandler(i)}>{i}</LevelContainer>
                        })}
                    </div>
                
                </Menu>
        </FullScreenWrapper>
    </>)
}

export default MainMenu;