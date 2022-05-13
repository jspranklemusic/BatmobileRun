import React from "react";
import * as UI from '../jsx/MenuComponents'

const DeathMenu = props => (
    <UI.MenuContainer>
        <h1>You Died</h1>
        <div className="middle">Well that's a bummer. Play again?</div>
        <div className="buttons">
            <UI.Button onClick={props.restart}>RESTART</UI.Button>
            <UI.Button onClick={props.quit}>QUIT</UI.Button>
        </div>
    </UI.MenuContainer>
);

export default DeathMenu