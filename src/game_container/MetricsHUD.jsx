import React, { useState } from 'react'
import styled from 'styled-components'
import batarang_logo from "../images/bat-silhouette.png"


const Container = styled.div`
    width: calc(60rem - 4rem);
    position: fixed;
    height: 3rem;
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
        left: -.8rem;
        width: 2rem;
        height: .5rem;
        background: white;
        border-radius: 100px;
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
    height:100%;
    background: #ffffff64;
    border-radius: 1000px;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    border:3px solid ${props => props.black ? "rgba(0,0,0,.6)" : "#ffffff62"};
    display: flex;
    align-items: center;
    animation: ${props => {
        if(props.health){
            if (props.width <= 25) return "low_health 0.5s infinite linear";
            if (props.width <= 50) return "medium_health 1.5s infinite linear";
        }
        return "none";
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

const MetricsHUD = props => {

    const healthBackground = '#3ab107c8';
    const ammoBackground = " #ffff0095";

    return(
        <Container>
           <StatusBar white health background={getHealthBarColor(props.health)} width={props.health} >
                <Cross></Cross>
               <Counter white>{props.health}</Counter>
           </StatusBar>
           <StatusBar black background={ammoBackground} width={props.ammo}>
               <Img src={batarang_logo}/>
               <Counter>{props.ammo}</Counter>
           </StatusBar>

        </Container>
    )
}

export default MetricsHUD;