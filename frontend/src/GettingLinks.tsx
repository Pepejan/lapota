import { useState } from 'react';


function LinkShorter() {

    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    const handleClick = () => {
        if (!isValidUrl(inputValue)) {
            setError("chelik you must enter a valid URL");
            return;
        }
        setError("");
        // backend for make link short

    };

    function isValidUrl(url: string): boolean {
        try {
            new URL(url)
            return true
        } catch{
            return false
        }
    }

    return (
        <div className="container d-flex flex-column align-items-center">
            <label htmlFor="stringLink" className="form-label text-center">Your link:</label>
            <div className="input-group w-50">
                <div className="mb-3">
                    <input
                        type="text"
                        className={`form-control ${error ? 'is-invalid' : ''}`}
                        id="stringLink"
                        placeholder="Place your link here"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    {error && <div className="invalid-feedback">{error}</div>}
                    <button className="btn btn-primary" type="button" onClick={handleClick}>Sent</button>
                </div>
            </div>
        </div>
    );
}

export default LinkShorter;