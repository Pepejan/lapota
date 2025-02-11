function LinkShorter() {
    return (
        <div className="container d-flex flex-column align-items-center">
            <label htmlFor="stringLink" className="form-label text-center">Your link:</label>
            <div className="input-group w-50">
                <input
                    type="url"
                    className="form-control"
                    id="stringLink"
                    placeholder="Place your link here"/>
                <button className="btn btn-primary" type="button">Sent</button>
            </div>
        </div>
    );
}

export default LinkShorter;