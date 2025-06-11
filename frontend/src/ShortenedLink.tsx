import React from 'react';

type Props = {
    shortUrl: string;
    onCopy?: () => void;
};

const ShortenedLink: React.FC<Props> = ({ shortUrl, onCopy }) => {
    const handleClick = () => {
        navigator.clipboard.writeText(shortUrl)
            .then(() => {
                if (onCopy) onCopy();
                alert('Copied');
            })
            .catch(() => {
                alert('Failed to copy');
            });
    };

    return (
        <div className="mt-3">
            <span>Shortened link: </span>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
                {shortUrl}
            </a>
        </div>
    );
};

export default ShortenedLink;
