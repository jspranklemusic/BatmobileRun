import React from "react";
import * as UI from "./jsx/MenuComponents"
import menuTypes from "./menuTypes";
import PauseMenu from "./submenus/PauseMenu";
import DeathMenu from "./submenus/DeathMenu";
import LevelSelectMenu from "./submenus/LevelSelectMenu";
import LevelCompletionMenu from "./submenus/LevelCompletionMenu";

const menuMap = {
    [menuTypes.death] : DeathMenu,
    [menuTypes.pause] : PauseMenu,
    [menuTypes.levelSelect] : LevelSelectMenu,
    [menuTypes.levelCompletion] : LevelCompletionMenu
}

const Menu = props => {
    
    const DisplayedMenu = menuMap[props.type];

    return(
        <UI.Wrapper style={{...props.style}}>
            <DisplayedMenu {...props}/>
        </UI.Wrapper>
    )
}

export default Menu;