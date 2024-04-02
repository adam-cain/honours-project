import React from 'react';

const AnotherComponent = ({ text }: { text: string }) => {
    return <>
        <div>Custom Compnent</div>
        <div>Data: {text}</div>
    </>
};

export default AnotherComponent;