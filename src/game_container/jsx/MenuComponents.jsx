import styled from "styled-components";

export const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background: #000000b1;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    color: rgb(220,220,220);
    z-index: 2;
    align-items: center;
    justify-content: center;
    animation:fadein 0.3s backwards;
    
`
export const MenuContainer = styled.div`
    width: calc(60rem - 2rem);
    height: auto;
    border: 2px solid white;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    font-family: monospace;


    h1{
        text-align: center;
        border-bottom: 1px solid rgba(255,255,255,0.5);
        padding: 2rem 0;
        width: 90%;
        margin: auto;
        flex: 0;
        font-size: 3rem;
        text-transform: uppercase;
        font-weight: 900;
    }
    .middle{
        flex: 1;
        padding: 2.75rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
    }
    .buttons{
        flex: 0;
        padding: 2.75rem;
        display: flex;
        justify-content: center;
       
    }
`

export const Button = styled.button`
    font-size: 2rem;
    border: 2px solid rgba(255,255,255,0.5);
    background: transparent;
    color: rgba(255,255,255,0.8);
    padding: 1rem 2rem;
    border-radius: 1000px;
    cursor: pointer;
    margin: 0rem 1rem;
    font-family: monospace;
    &:hover{
        background: rgba(255,255,255,0.75);
        color: rgb(20,20,20);
    }
`