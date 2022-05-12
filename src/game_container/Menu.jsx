import React from "react";
import styled from "styled-components";
import * as UI from "./jsx/MenuComponents"

const Menu = props => {

    const deathMenu = (
        <UI.MenuContainer>
            <h1>You Died</h1>
            <div className="middle">Well that's a bummer. Play again?</div>
            <div className="buttons">
                <UI.Button onClick={props.restart}>RESTART</UI.Button>
                <UI.Button onClick={props.restart}>QUIT</UI.Button>
            </div>
        </UI.MenuContainer>
    );

    const pauseMenu = (
    <UI.MenuContainer>
        <h1>Game Paused</h1>
        <div className="middle">Press 'esc' or click RESUME to unpause the game.</div>
        <div className="buttons">
            <UI.Button onClick={props.resume}>RESUME</UI.Button>
            <UI.Button onClick={props.resume}>QUIT</UI.Button>
        </div>
    </UI.MenuContainer>);

 

    return(
        <UI.Wrapper style={{...props.style}}>
            {props.type == "death" ? deathMenu : pauseMenu}
        </UI.Wrapper>
    )
}

export default Menu;