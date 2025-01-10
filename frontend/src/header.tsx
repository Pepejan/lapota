function Header() {
    return (
        <div className="col-m container bg-primary">
            <div className="row justify-content-md-center">
                <nav className="navbar navbar-expand-sm">
                    <div className="container-fluid">

                        <div className="collapse navbar-collapse" id="navbarText">
                            <div className="navbar-nav col col-lg-1">
                            </div>

                            <div className="navbar-nav  me-auto mb-2 mb-lg-0 col-lg-2 nav-item">
                                <a className=" custom-css nav-link active" href="#">Home</a>
                            </div>

                            <div className="col col-lg-2">
                                <a type="button"
                                   className="custom-css btn btn-primary  btn-outline-light btn-lg m-1"
                                   id="LoginBtn">Login</a>
                                <a type="button"
                                   className="custom-css btn btn-primary bg-success btn-outline-light btn-lg"
                                   id="RegisterBtn">Sign up</a>
                            </div>

                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}


export default Header

