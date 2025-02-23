import React from 'react'

const Select = (props) => {
    return (
        <div className='mb-3'>
            <label htmlFor={props.name} className="form-label">
                {" "}
                {props.title}{""}
            </label>

        <select
            className='form-select'
            id={props.name}
            name={props.name}
            value={props.value}
            onChange={props.handleChange}
        >
            <option value="">{props.placeholder}</option>
            {props.options.map((option)=>{
                return (
                    <option
                        className='form-select'
                        key={option.id}
                        value={option.id}
                        label={option.name}>
                            {option.value}
                    </option>
                )
            })}

            </select>

            <div className={props.errorDiv}>
            {props.errorMsg}
            </div>
            

            </div>
    );
}

export default Select;