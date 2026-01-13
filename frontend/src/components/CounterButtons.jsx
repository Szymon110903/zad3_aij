import React  from "react";


function CounterButtons({value, onChange}) {
    
    const HandleIncrement = () => {
        onChange(value +1);
    };

    const HandleDecrement = () => {
        if (value>0){
        onChange(value -1);
        }
    };
    return (
        <div>
         <button className="btn btn-outline-dark btn-sm"
                onClick={HandleDecrement}
            >&lt;</button>
            <div className="btn btn-outline-dark btn-sm disabled" style={{ opacity: 1, color: 'black', cursor: 'default' }}>
                {value}
            </div>
            <button className="btn btn-outline-dark btn-sm" 
                onClick={HandleIncrement}
            >&gt;</button>
             
        </div>
    );

};
export default CounterButtons;
