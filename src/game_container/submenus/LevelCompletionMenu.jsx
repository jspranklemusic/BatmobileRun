import React from "react";
import * as UI from '../jsx/MenuComponents'

const LevelCompletionMenu = props => (
    <UI.MenuContainer>
        <h1>Level Completed</h1>
        <div className="middle">You have braved the perils of the streets of Gotham to live another day.</div>
        <div className="buttons">
            <UI.Button onClick={props.restart}>NEXT LEVEL</UI.Button>
            <UI.Button onClick={props.quit}>QUIT</UI.Button>
        </div>
    </UI.MenuContainer>);

export default LevelCompletionMenu