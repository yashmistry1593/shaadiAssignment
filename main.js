
class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: false
        }
    }
    setIsLoggedIn(islogged) {
        this.setState({
            isLoggedIn: islogged
        })
    }

    handleLogout() {
        localStorage.removeItem('credentials');
        this.setState({
            isLoggedIn: false
        })
    }

    componentDidMount() {
        if (localStorage.getItem('credentials') !== null) {
            let credentials = JSON.parse(localStorage.getItem('credentials'))
            credentials.user === "shaadi" && credentials.pass === "123" ? this.setIsLoggedIn(true) : this.setIsLoggedIn(false);
        }

    }
    render() {
        return (
            this.state.isLoggedIn ? <Carousel handleLogout={() => this.handleLogout()} /> : <Login hasLogggedIn={(islogged) => this.setIsLoggedIn(islogged)} />
        );
    }
}

const Login = (props) => {
    const [userName, setUserName] = React.useState('shaadi')
    const [password, setPassword] = React.useState('123')
    const [isValid, setIsValid] = React.useState(false)
    const [isAdmin, setIsadmin] = React.useState(false)
    const [isSubmitted, setIssubmitted] = React.useState(false)

    let errorMessage = ''
    if (isSubmitted) {
        if (!isValid) {
            errorMessage = 'Please Enter the field(s)'
        }
        else if (isAdmin) {
            errorMessage = 'You have successfully Logged in.'
            let credentials = {
                user: `${userName}`,
                pass: `${password}`
            }
            localStorage.setItem('credentials', JSON.stringify(credentials))
            setTimeout(() => props.hasLogggedIn(true), 2000)
        }
        else {
            errorMessage = 'You are not an admin.'
        }
    }

    const handleSubmit = (e) => {
        e.persist()
        e.preventDefault()
        setIssubmitted(true)
        let userNameInput = e.target.userName.value;
        let passwordInput = e.target.password.value;
        if (userNameInput !== '' || passwordInput !== '') {
            setIsValid(true)
            userNameInput === userName && passwordInput === password ? setIsadmin(true) : setIsadmin(false)
        }
        else {
            setIsValid(false)
        }
    }
    return (
        <div className="form-wrapper">
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="userName">Username : </label>
                    <input type="text" id="userName" name="userName" />
                </div>
                <div className="form-field">
                    <label htmlFor="password">Password : </label>
                    <input type="password" id="password" name="password" />
                </div>
                <div className="form-field">
                    <button type="submit">Submit</button>
                    {isAdmin && <div className="spinner"><img src="./static-images/spinner.gif" ></img></div>}
                </div>
                <p className="error-message">{errorMessage} </p>
            </form>
        </div>
    )
}


const CarouselLeftArrow = (props) => {
    return (
        <a
            href="#"
            className="carousel__arrow carousel__arrow--left"
            onClick={props.onClick}
        >
            <span className="fa fa-2x fa-angle-left" />
        </a>
    );

}

const CarouselRightArrow = (props) => {
    return (
        <a
            href="#"
            className="carousel__arrow carousel__arrow--right"
            onClick={props.onClick}
        >
            <span className="fa fa-2x fa-angle-right" />
        </a>
    );
}

const CarouselIndicator = (props) => {
    return (
        <li>
            <a
                className={
                    props.index == props.activeIndex
                        ? "carousel__indicator carousel__indicator--active"
                        : "carousel__indicator"
                }
                onClick={props.onClick}
            />
        </li>
    );
}

const CarouselSlide = (props) => {
    return (
        <li
            className={
                props.index == props.activeIndex
                    ? "carousel__slide carousel__slide--active"
                    : "carousel__slide"
            }
        >
            <p className="carousel-slide__content">{props.slide}</p>

        </li>
    );
}

// Carousel wrapper component
class Carousel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
            filterVal: 5,
            myData: [1, 2, 3, 4, 5],
            logValueList: [],
            showLog: false
        };
    }

    handleChange(e) {
        let slideList = [];
        this.setState({
            filterVal: e.target.value,
            logValueList: [...this.state.logValueList, e.target.value],
            activeIndex: 0
        }, () => {
            let slideList = [];
            for (let index = 1; index <= this.state.filterVal; index++) {
                slideList = [...slideList, index]
            }
            this.setState({
                myData: slideList
            })
        })
    }

    displayLog() {
        this.setState({
            showLog: !this.state.showLog
        })
    }

    goToSlide(index) {
        this.setState({
            activeIndex: index
        });
    }

    goToPrevSlide(e) {
        e.preventDefault();
        let index = this.state.activeIndex;
        let slidesLength = this.state.myData.length;
        if (index < 1) {
            index = slidesLength;
        }
        --index;
        this.setState({
            activeIndex: index
        });
    }

    goToNextSlide(e) {
        e.preventDefault();
        let index = this.state.activeIndex;
        let slidesLength = this.state.myData.length - 1;
        if (index === slidesLength) {
            index = -1;
        }
        ++index;
        this.setState({
            activeIndex: index
        });
    }

    render() {

        let options = Array.apply(null, Array(20));
        let optionList = options.map((item, i) => {
            return (<option value={++i}>{i}</option>)
        });

        return (
            <React.Fragment>

                <div className="logout-btn">
                    <button onClick={() => this.props.handleLogout()}>Logout</button>
                </div>
                <div className="filter-box">
                    <label htmlFor="slide-no">Select Slides : </label>
                    <select name="" id="slide-no" onChange={e => this.handleChange(e)}>
                        {(optionList)}
                    </select>
                </div>

                <div className="carousel-container">
                    <div className="carousel">
                        <CarouselLeftArrow onClick={e => this.goToPrevSlide(e)} />

                        <ul className="carousel__slides">
                            {this.state.myData.map((slide, index) =>
                                <CarouselSlide
                                    key={index}
                                    index={index}
                                    activeIndex={this.state.activeIndex}
                                    slide={slide}
                                />
                            )}
                        </ul>

                        <CarouselRightArrow onClick={e => this.goToNextSlide(e)} />

                        <ul className="carousel__indicators">
                            {this.state.myData.map((slide, index) =>
                                <CarouselIndicator
                                    key={index}
                                    index={index}
                                    activeIndex={this.state.activeIndex}
                                    isActive={this.state.activeIndex == index}
                                    onClick={e => this.goToSlide(index)}
                                />
                            )}
                        </ul>
                    </div>
                </div>


                {this.state.logValueList.length > 0 && <div className="finish-button"><button onClick={() => this.displayLog()}>Finish</button></div>}

                <Modal showLog={this.state.showLog} logValueList={this.state.logValueList} closeModal={() => this.displayLog()} />
            </React.Fragment>
        );
    }
}

const Modal = (props) => {
    let modalDisplay = props.showLog ? 'show-modal' : '';
    return (
        <div id="myModal" className={`${modalDisplay} modal`}>
            <div className="modal-content">
                <div className="modal-header">
                    <span className="close" onClick={props.closeModal}>&times;</span>
                    <h2>List of Numbers User selected :</h2>
                </div>
                <div className="modal-body">
                    {props.logValueList.join(',')}
                </div>
            </div>

        </div>
    )
}

ReactDOM.render(
    <Home />,
    document.getElementById('root')
);