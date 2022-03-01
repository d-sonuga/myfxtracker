import './style.css'
const video  = require('./demo-video.webm');


const DemoVideo = () => {
   return(
       <div 
            className='apps-info-app-home-demo-video-container'
            dangerouslySetInnerHTML={{
                __html: `
                <video class='apps-info-app-home-demo-video-video' width="950" height="535" loop autoplay muted>
                    <source src=${video} type="video/webm" />
                </video>
                `
            }}
        />
   )
}

export default DemoVideo