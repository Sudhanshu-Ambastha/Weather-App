// error.jsx
import React from 'react';
import Errorg from "../../assets/images/Error.gif"
import './error.css';

const Error = ({ message, onRetry }) => (
  <div className="error-content">
  <img src={Errorg} alt="Error" className="error-icon" />
    <h2 className="error-title">ℰ𝓇𝓇ℴ𝓇</h2>
    <p className="error-message">{message}</p>
    {onRetry && (
      <button className="btn-primary" onClick={onRetry}>
        <span className="btn-text">Retry</span>
      </button>
    )}
  </div>
);

export default Error;
