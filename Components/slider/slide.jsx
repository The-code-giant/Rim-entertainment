import SlideItem from "./slideItem";
import styles from '../../styles/slider.module.css';

export default function Slide(props){
    const items = [
        {image:"/images/1.png",title:"AsyncArt",subtitle:"Programmable music"},
        {image:"/images/2.jpg",title:"Video Musical Animation",subtitle:"by Eclictic Method"},
        {image:"/images/3.gif",title:"AsyncArt",subtitle:"Programmable music"},
        {image:"/images/4.gif",title:"AsyncArt",subtitle:"Programmable music"},
        {image:"/images/5.png",title:"AsyncArt",subtitle:"Programmable music"},
        {image:"/images/6.jpg",title:"AsyncArt",subtitle:"Programmable music"},
        {image:"/images/7.gif",title:"AsyncArt",subtitle:"Programmable music"},
    ];
    return (<div className={styles.slideWrapper}>
            {items.map((v,i)=><SlideItem item={v} key={i}/>)}
    </div>);
}