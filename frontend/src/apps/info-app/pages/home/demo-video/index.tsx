import './style.css'
const video  = require('@visuals/videos/demo-video.mp4');


const DemoVideo = () => {
    return(
        <div className='apps-info-app-home-demo-video-container'>
            <video className='apps-info-app-home-demo-video-video' width="950" height="535" loop autoPlay muted>
                <source src={video} type="video/mp4" />
            </video>
        </div>
    );
}

export default DemoVideo