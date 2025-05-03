import React from 'react';
import './styles/InputField.css';

const InputField = ({ type, value, onChange, placeholder, error, ...props }) => {
  return (
    <div className="input-field-container">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'error' : ''}
        {...props}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default InputField;