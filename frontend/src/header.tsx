function Header() {
    return (
        <nav className="navbar navbar-expand-lg bg-secondary">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                    </ul>
                    <span className="navbar-text">Link shortener</span>
                </div>
            </div>
        </nav>
    )
}

export default Header;