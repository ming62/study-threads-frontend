import React from 'react';

const TextArea = (props) => {
    return (
        <div className='mb-3'>
        <label htmlFor={props.name} className="form-label">{props.title}</label>
        <textarea
            className={`form-control ${props.className}`}
            id={props.name}
            name={props.name}
            value={props.value}
            rows={props.rows}
            onChange={props.handleChange}
            placeholder={props.placeholder}
            />
        <div className={props.errorDiv}>
            {props.errorMsg}
        </div>

    </div>
    )
}

export default TextArea;

