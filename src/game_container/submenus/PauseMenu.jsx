import React from "react";
import * as UI from '../jsx/MenuComponents'

const PauseMenu = props => (
    <UI.MenuContainer>
        <h1>Game Paused</h1>
        <h2>Level {props.level}</h2>
        <div className="middle">
            Press ESC or click RESUME to unpause the game.
        </div>
        <div className="buttons">
            <UI.Button onClick={props.resume}>RESUME</UI.Button>
            {props.level === 0 && <UI.Button onClick={props.nextLevel}>SKIP TUTORIAL</UI.Button>}
            <UI.Button onClick={props.quit}>QUIT</UI.Button>
        </div>
    </UI.MenuContainer>);

export default PauseMenu