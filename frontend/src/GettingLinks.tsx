import { useState } from 'react';
import ShortenedLink from './ShortenedLink';

function LinkShorter() {

    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');
    const [shortUrl, setShortUrl] = useState<string | null>(null);

    const handleClick = () => {
        if (!isValidUrl(inputValue)) {
            setError("chelik you must enter a valid URL");
            return;
        }
        setError("");
        sendOldLink(inputValue);

    };
    function sendOldLink(link: string) {
        fetch('backend/link', {   //change link to correct
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: link})
        })
            .then(res => res.json())
            .then(data => setShortUrl(data.shortUrl))
            .catch(() => setError('Error when shortening a link'));
    }

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

                {shortUrl && (
                    <ShortenedLink shortUrl={shortUrl} />
                )}

            </div>
        </div>
    );
}

export default LinkShorter;