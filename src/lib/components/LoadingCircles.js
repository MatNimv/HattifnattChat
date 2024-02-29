import React from 'react';

const LoadingCircles = (props) => {
    return (
        <div className={`col-3 ${props.class}`}>
            <div className="snippet" data-title="dot-pulse">
                <div className="stage">
                    <div className="dot-pulse"></div>
                </div>
            </div>
            <p>{props.message}</p>
        </div>
    );
};

export default LoadingCircles;
