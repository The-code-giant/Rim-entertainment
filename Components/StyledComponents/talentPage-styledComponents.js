import styled from "styled-components";

export const ProfileContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    div{
        width: 100%;
        height: 50%;
        text-align: center;
        flex:1;
        font-weight: 700;

        &:first-child{
            background-color: #eee;
            text-align: center;
        }
    }
    &:first-child{
        img{
            height: 260px;
            width: 100%;
            transform: translateX(-50%);
            left: 50%;
            position: relative;
        }
    }
`;
export const BiographyContainer = styled.div`
    .avatar{
        border-radius: 50%;
        width: 120px;
        height: 120px;
        margin: 0px auto;
        border:2px solid #fff;
        overflow:hidden;
        z-index: 9;
        transform: translateY(-70%);
        img{
            width: 100%;
            height: 100%;
        }
    }
`;
export const BioDescription = styled.div`
        padding: 0px 10px; 
        margin-top: -60px;
`
export const ProfileButton = styled.button`
height: 40px;
width: 40px;
margin: 5px;
border: 1px solid rgb(239, 239, 239);
-webkit-box-align: center;
align-items: center;
cursor: pointer;
-webkit-box-pack: center;
transition: all 0.12s ease-in-out 0s;
border-radius: 40px;
background-color: transparent;
transform-origin: center center;
`