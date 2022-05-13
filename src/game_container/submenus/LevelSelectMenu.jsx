import React from "react";
import * as UI from '../jsx/MenuComponents'

const LevelSelectMenu = props => (
    <UI.MenuContainer>
        <h1>Game Paused</h1>
        <div className="middle">Press 'esc' or click RESUME to unpause the game.</div>
        <div className="buttons">
            <UI.Button onClick={props.resume}>RESUME</UI.Button>
            <UI.Button onClick={props.resume}>QUIT</UI.Button>
        </div>
    </UI.MenuContainer>);

export default LevelSelectMenu