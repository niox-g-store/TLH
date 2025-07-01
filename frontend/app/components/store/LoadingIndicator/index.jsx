import { ThreeDot } from "react-loading-indicators";

const LoadingIndicator = (props) => {
    const { isLightMode } = props;
    return (
        <div className={`${isLightMode ? 'bg-white' : 'bg-black'} loading-indicator`}>
            <ThreeDot variant="pulsate" color="#9172EC" size="medium" text="" textColor="" />
        </div>
    )
}

export default LoadingIndicator
