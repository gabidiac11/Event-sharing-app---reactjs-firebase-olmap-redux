import React, { Component } from "react";
import moment from "moment";
import { DatetimePickerTrigger } from "rc-datetime-picker";
import OlMapFunction from "../../../map/OlMap";
import { Search, Select, Icon, Transition, Button } from "semantic-ui-react";
import ImageLoader from '../../../components/reuseableCompoennts/ImageUploader'
import ImagesModal from '../../../components/reuseableCompoennts/ImagesModal'
import { Redirect } from "react-router-dom";

import ReactTooltip from 'react-tooltip'

//services
import { firebaseProvider } from "../../../config/FireConfig";

//components
import EventItem from "../../usersPage/reusebleFields/eventItemUsers";

import { storage } from "../../../config/FireConfig";
import { updateActiveProfile } from "../../usersPage/ActionsUsers";


class HomeComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            suggestionForLocation: "",
            eventListVisible: true,
            createEventVisible: false,
            moment: moment(),
            activeIndex: -1,
            image: null,
            url: '',
            imagesUrl: [],
            imageFetching: false,
            redirectToUser: false,
            mapPinPoints: [],
            displayPinPoints: "initial",
        };
    }

    componentDidMount = () => {
        const appMap = new OlMapFunction({
            projectionCode: "EPSG:3857",
            divId: "mapContainer",
            zoom: 3,
            center: [0, 0]
        });
        this.appMap = appMap;
        this.initializeEventList();
        this.initializeUserList();
        this.initializeCommentList();

        this.setState({ redirectToUser: false });
        this.props.onUpdateActiveProfile('');

    };

    initializeUserList = () => {
        firebaseProvider
            .database()
            .ref("users")
            .on("value", () => {
                this.props.onGetUserList();

            });
    };
    initializeEventList = () => {
        firebaseProvider
            .database()
            .ref("events")
            .on("value", () => {
                this.props.onGetEventList();

            })


    };
    initializeCommentList = () => {
        firebaseProvider
            .database()
            .ref("comments")
            .on("value", () => {
                this.props.onReadAllComments();
            });


    };

    //animation logic between create event and events list
    onClickCreateEvent = () => {
        if (this.state.displayPinPoints === "none") this.toggleMapPinPoints(this.props.home.eventList);
        this.setState({
            eventListVisible: false
        });
    };
    onCompleteCreateEvent = () => {
        this.setState({
            createEventVisible: true
        });
    };
    onClickBackToEventList = () => {
        this.setState(
            {
                createEventVisible: false,
                suggestionForLocation: ""
            },
            () => {
                this.props.onResetFormState();
            }
        );
    };
    onCompleteBackToEventList = () => {
        this.setState({
            eventListVisible: true
        });
    };
    handleLocationInput = (ev, data) => {
        this.setState({ suggestionForLocation: data.value }, () => {
            if (data.value !== "") {
                this.props.onGetLocationOptions(data.value);
            }
        });
    };
    handleUpdateFormState = (ev, data) => {
        this.props.onUpdateFormState(data.name, data.result);
    };
    handleInputChange = ev => {
        // Update form elements
        const propPath = ev.target.name;
        const payload = ev.target.value;
        this.props.onUpdateFormState(propPath, payload);
    };
    removeSelectedLocation = () => {
        this.setState(
            {
                suggestionForLocation: ""
            },
            () => {
                this.props.onRemoveSelectedLocation();
            }
        );
    };
    handleDateChange = moment => {
        this.setState(
            {
                moment
            },
            () => {
                const payload = {
                    day: moment.format("DD"),
                    month: moment.format("MMM").toUpperCase(),
                    entireDate: moment.format("LLLL")
                };
                this.props.onUpdateFormState("date", payload);
            }
        );
    };
    handleCategoryChange = (ev, data) => {
        this.props.onUpdateFormState(data.name, data.value);
    };
    checkIfCanSave = () => {
        const {
            title,
            organizer,
            description,
            location,
            date,
            category
        } = this.props.home.formState;
        return (
            title !== "" &&
            organizer !== "" &&
            description !== "" &&
            location.title !== "" &&
            date !== "" &&
            category !== ""
        );
    };
    handleSaveEvent = () => {
        this.props.onSaveEvent(this.props.home.formState);
        this.onClickBackToEventList();
    };

    //harta.....
    onClickEvent = (event, index) => {
        const { location } = event;

        if (this.state.displayPinPoints === "none") this.toggleMapPinPoints(this.props.home.eventList);

        this.setState({
            activeIndex: index
        });
        document.getElementById("marker").style.display = "initial";
        // document.getElementById("marker").dataset.tooltip = event.title;
        this.appMap.addMarker(
            location.longitude,
            location.latitude,
            document.getElementById("marker")
        );
        this.appMap.centerMap(location.longitude, location.latitude, 6);

        //scroll la eventul selectat (daca selectam un pin point de pe harta)
        let parent = document.getElementsByClassName("home__container-dashboard")[0];
        let scrollHeight = 0;
        for (let i = 0; i < index; i++) {
            scrollHeight += parent.childNodes[i].scrollHeight;
        }

        document.getElementsByClassName("home__container-dashboard")[0].scrollTop = scrollHeight;
    };
    onMinimizeEvent = () => {
        this.setState({
            activeIndex: -1
        });
        document.getElementById("marker").style.display = "none";
        this.appMap.centerMap(0, 0, 3);
    }
    toggleMapPinPoints = (eventList) => {
        if (!eventList) return;

        let { displayPinPoints } = this.state;

        if ( //cand un eveniment este selectat
            displayPinPoints !== "none"
            &&
            (
                document.getElementById("marker").style.display !== "none"
|| this.state.createEventVisible)

        ) { return; }

        let mapPinPoints = [];
        let locations = [];
        let elements = [];
        for (let i = 0; i < eventList.length; i++) {

            locations.push(eventList[i].location);
            mapPinPoints.push("none");
            elements.push(document.getElementById(`mapPin${i}`));
        }
        this.setState({ mapPinPoints: mapPinPoints });
        this.appMap.addMultipleOverlays(elements, locations);
        for (let i = 0; i < mapPinPoints.length; i++) {
            mapPinPoints[i] = displayPinPoints;
        }
        for (let i = 0; i < eventList.length; i++) {
            document.getElementById(`mapPin${i}`).style.display = displayPinPoints;
        }
        displayPinPoints = this.state.displayPinPoints === "none" ? "initial" : "none";
        this.setState({ displayPinPoints: displayPinPoints, mapPinPoints: mapPinPoints });
    }

    //..............................................
    handleChangeImage = e => {

        if (e.target.files[0]) {
            const image = e.target.files[0];

            this.setState({ image: image });
        }

    }

    uploadImage = () => {
        if (!this.state.image)
            return;


        this.setState({ imageFetching: true })

        const { image } = this.state;

        //am generat un uniq key pt numele imaginilor ca sa nu se suprascrie
        const key = firebaseProvider
            .database().ref().child(localStorage.getItem("userId")).push().key;
        const userUid = localStorage.getItem("userId");

        const uploadTask = storage.ref(`${userUid}/${key}`);
        uploadTask.put(image
            // arrow function aici da eroare aia cu 25 stacks
            // = {
            //     //poate aici voi seta isfetching true daca imi face probleme (prin redux)
            //     //apoi in than il voi reseta
            // }
        )
            //l-am pus in then pt ca era o eroare: trb sa astept sa fetchingghiuiasca inainte sa fac asta
            .then(() => {

                this.setState({ imageFetching: false });

                storage
                    .ref(`${userUid}`)
                    .child(`${key}`)
                    .getDownloadURL()
                    .then(url => {
                        const newUrls = [...this.state.imagesUrl, url];
                        this.setState({ imagesUrl: newUrls });

                        this.props.onUpdateImages(newUrls);
                        this.setState({ image: null, url: '' });

                    });



            });




        //  
    }
    removeImage = (link) => {
        let links = [...this.state.imagesUrl];

        for (let i = links.length - 1; i >= 0; i--) {
            if (links[i] === link) {
                links.splice(i, 1);
                break;
            }
        }
        this.setState({ imagesUrl: links });
        this.props.onUpdateImages(this.state.imagesUrl);

        //****na-ma eliminat din storage imaginile */
    }
    joinEvent = (item) => {



        item.joinList.push(localStorage.getItem("userId"));
        this.props.onUpdateEvent(item);
    }
    disJoinEvent = (item) => {

        for (let i = item.joinList.length - 1; i >= 0; i--) {
            if (item.joinList[i] === localStorage.getItem("userId")) {
                item.joinList.splice(i, 1);
                break;
            }
        }
        this.props.onUpdateEvent(item);
    }

    onClickUserIcon = (userId) => {

        if (this.props.home.activeProfileFetching)
            return;

        this.props.onUpdateActiveProfile(userId);
        this.setState({ redirectToUser: true });
    }

    onAddComment = (text, eventId) => {
        this.props.onAddComment(text, eventId);
        this.initializeCommentList();
    }
    onDeleteComment = commentId => {
        this.props.onDeleteComment(commentId);
        this.initializeCommentList();
    };

    setActiveProfile = (index) => {

    }

    onSendRating = (rating, eventId) => {
        this.props.onSendRating(rating, eventId, this.props.users.eventList);
    };

    render() {

        // mapam imaginile uloadate
        const uploadedImages = (
            <div>
                {this.state.imagesUrl.map(
                    url => {
                        return <ImagesModal imageLink={url} removeImage={this.removeImage} />
                    }
                )}
            </div>
        );



        const {
            isFetching, //se submite formul
            isFetchingSearch,//se cauta sugestii
            locationOptions,
            categoryOptions,
            formState,
            eventList,
            userList,
            commentList,
            isFetchingComment,
            isFetchingDeleteComments,


        } = this.props.home;


        const shortcuts = {
            Today: moment(),
            Tomorrow: moment().add(1, "days")
        };
        return (
            <div className="home__container">
                {
                    this.state.redirectToUser
                        ? <Redirect to={'/users'} />
                        : ''
                }

                <div id="mapContainer" className="home__container-map" >
                    <div style={{ display: "none" }}>
                        <div
                            id="marker"
                            className="ui icon"
                            data-position="top center"
                            style={{ display: "none" }}
                        >

                            <i data-tip data-for="markerToolprit"  className="map pin orange icon big" />
                            <ReactTooltip id="markerToolprit" delayHide={1000} effect='solid'>
                            {
                                this.state.activeIndex > -1 ?
                                    <div
                                        
                                    >
                                        <img
                                            style={{ width: "100pt" }}
                                            src={`${
                                                eventList[this.state.activeIndex]["images"]
                                                    ? eventList[this.state.activeIndex].images[0]
                                                    : "https://storage.pixteller.com/designs/designs-images/2017-07-30/11/backgrounds-passion-simple-background-image-1-597d9e3c588e7.png"
                                                }`}
                                        />
                                        <div>
                                            {eventList[this.state.activeIndex].title}
                                        </div>
                                    </div>
                                    : <div></div>
                            }
                        </ReactTooltip>
                        </div>
                        
                    </div>
                    {
                        !isFetching
                            ? eventList.map(
                                (ev, index) => {
                                    return (
                                        <div
                                            style={{
                                                display: `${this.state.mapPinPoints.length === 0 ? "none" : this.state.mapPinPoints[index]}`,
                                            }}

                                        >
                                            <div
                                                id={`mapPin${index}`}
                                                className="mapPinPoints"
                                                onClick={() => this.onClickEvent(ev, index)}
                                            >


                                                <i data-tip data-for={`mapPinTooltip${index}`} className="map pin orange icon big" />
                                                <ReactTooltip id={`mapPinTooltip${index}`} delayHide={100} >
                                                    <img

                                                        src={`${
                                                            ev["images"]
                                                                ? ev.images[0]
                                                                : "https://storage.pixteller.com/designs/designs-images/2017-07-30/11/backgrounds-passion-simple-background-image-1-597d9e3c588e7.png"
                                                            }`}
                                                    />
                                                    <div

                                                    >
                                                        {ev.title}
                                                    </div>
                                                </ReactTooltip>
                                            </div>
                                        </div>
                                    )
                                }
                            )
                            : ""
                    }
                    <Button
                        style={{
                            position: "absolute",
                            bottom: "6px",
                            left: "6px",
                            zIndex: "20",
                            backgroundColor: `${
                                this.state.displayPinPoints !== "none"
                                    ? "green"
                                    : ""
                                }`,
                            opacity: `${
                                this.state.activeIndex > -1 || this.state.createEventVisible
                                    ? "0.3"
                                    : "1"
                                }`,
                            filter: `${
                                this.state.activeIndex > -1
                                    ? "alpha(opacity=30)"
                                    : "alpha(opacity=100)"
                                }`,

                        }}

                        onClick={() => this.toggleMapPinPoints(eventList)}
                    >
                        {
                            `${
                            this.state.displayPinPoints !== "none"
                                ? "All events"
                                : "Hide it"
                            }`
                        }
                    </Button>
                </div>

                <div className="home__container-details">
                    <div className="home__container-actions">
                        <div className="home__container-title">
                            Promote your event
                        </div>

                        {/* buton care face doar vizibil form - ul create event */}
                        <div className="home__container-buttons">

                            <button
                                className={`ui labeled icon orange ${
                                    this.state.createEventVisible
                                        ? "disabled"
                                        : ""
                                    } button`}
                                onClick={this.onClickCreateEvent}
                            >
                                <i className="plus icon" />
                                Create event
                            </button>
                        </div>
                    </div>
                    <Transition
                        visible={this.state.eventListVisible}
                        animation="fade right"
                        duration={200}
                        onComplete={
                            this.state.eventListVisible
                                ? null
                                : this.onCompleteCreateEvent
                        }
                    >
                        <div className="home__container-dashboard">
                            {!isFetching
                                ? eventList.map((item, index) => (
                                    //mapam listele cu evenimente
                                    <EventItem
                                        key={index}
                                        event={item}
                                        userList={userList}
                                        isActive={
                                            this.state.activeIndex === index
                                                ? true
                                                : false
                                        }
                                        onClickUserIcon={this.onClickUserIcon}
                                        isJoined={
                                            item.joinList.indexOf(localStorage.getItem("userId")) > -1
                                                ? true
                                                : false
                                        }
                                        joinEvent={() =>
                                            this.joinEvent(item)
                                        }
                                        disJoinEvent={() =>
                                            this.disJoinEvent(item)
                                        }

                                        onClickEvent={() =>
                                            this.onClickEvent(item, index)
                                        }

                                        addComment={this.onAddComment}
                                        isFetchingComment={isFetchingComment}
                                        commentList={commentList}

                                        onDeleteComment={this.onDeleteComment}
                                        isFetchingDeleteComments={isFetchingDeleteComments}
                                        onSendRating={this.onSendRating}

                                        canBeMinimized={true}
                                        onMinimizeEvent={
                                            this.onMinimizeEvent
                                        }
                                    />
                                ))
                                : ""}
                        </div>
                    </Transition>
                    <Transition
                        visible={this.state.createEventVisible}
                        animation="fade left"
                        duration={500}
                        onComplete={
                            this.state.createEventVisible
                                ? null
                                : this.onCompleteBackToEventList
                        }
                    >

                        <div className="home__container-dashboard">
                            <ImageLoader uploadImage={this.uploadImage}
                                handleChangeImage={this.handleChangeImage}
                                imageFetching={this.state.imageFetching}

                            />
                            <div style={{ display: "flex", marginBottom: "10px" }}>
                                {uploadedImages}
                            </div>

                            <div className="location-label">
                                <Icon name="asterisk" color="red" size="tiny" />
                                <p>Add a location:</p>
                            </div>

                            <Search
                                fluid
                                name="location"
                                placeholder="Search ..."
                                loading={isFetchingSearch}
                                onResultSelect={(ev, data) =>
                                    this.handleUpdateFormState(ev, data)
                                }
                                onSearchChange={(ev, data) =>
                                    this.handleLocationInput(ev, data)
                                }
                                results={locationOptions}
                                value={this.state.suggestionForLocation}
                                className="location-field"
                            />


                            {/* facem un div cu locatia selectata, daca e selectat */}
                            {formState.location.title !== "" ? (
                                <div className="selected-location">
                                    <div className="ui image label large">
                                        <Icon
                                            name="map marker alternate"
                                            color="orange"
                                        />
                                        {formState.location.title}
                                        <i
                                            className="delete icon"
                                            onClick={
                                                this.removeSelectedLocation
                                            }
                                        />
                                    </div>
                                </div>
                            ) : (
                                    ""
                                )}




                            <div className="event_info">
                                <div className="event_info-title">
                                    <div className="event-name-label">
                                        <Icon
                                            name="asterisk"
                                            color="red"
                                            size="tiny"
                                        />
                                        <p>Event name:</p>
                                    </div>
                                    <div className="ui input">
                                        <input
                                            type="text"
                                            name="title"
                                            value={formState.title}
                                            placeholder="E.g. Party of the Year"
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="event_info-organizer">
                                    <div className="event-organizer-label">
                                        <Icon
                                            name="asterisk"
                                            color="red"
                                            size="tiny"
                                        />
                                        <p>Organised by:</p>
                                    </div>
                                    <div className="ui input">
                                        <input
                                            type="text"
                                            name="organizer"
                                            value={formState.organizer}
                                            placeholder="E.g. The Event Organiser"
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>





                            <div className="event_date">
                                <div className="date-label">
                                    <Icon
                                        name="asterisk"
                                        color="red"
                                        size="tiny"
                                    />
                                    <p>Starts at:</p>
                                </div>
                                <DatetimePickerTrigger
                                    shortcuts={shortcuts}
                                    moment={this.state.moment}
                                    closeOnSelectDay={true}
                                    onChange={this.handleDateChange}
                                >
                                    <div className="ui action input">
                                        <input
                                            type="text"
                                            name="date"
                                            value={this.state.moment.format(
                                                "lll"
                                            )}
                                            readOnly
                                        />
                                        <button className="ui icon button">
                                            <i className="search icon" />
                                        </button>
                                    </div>
                                </DatetimePickerTrigger>
                            </div>
                            <div className="description-label">
                                <Icon name="asterisk" color="red" size="tiny" />
                                <p>Description:</p>
                            </div>
                            <div className="ui form">
                                <div className="field">
                                    <textarea
                                        rows="3"
                                        name="description"
                                        value={formState.description}
                                        onChange={this.handleInputChange}
                                        className="description-field"
                                    />
                                </div>
                            </div>
                            <div className="category-label">
                                <Icon name="asterisk" color="red" size="tiny" />
                                <p>Category:</p>
                            </div>

                            <Select
                                name="category"
                                className="category-select"
                                placeholder="Choose a category for your event"
                                options={categoryOptions}
                                onChange={(ev, data) =>
                                    this.handleCategoryChange(ev, data)
                                }
                            />


                            <div className="event-actions">
                                <div className="ui buttons">
                                    <button
                                        className="ui button"
                                        onClick={this.onClickBackToEventList}
                                    >
                                        Cancel
                                    </button>
                                    <div className="or" />
                                    <button
                                        className={`ui positive button ${
                                            this.checkIfCanSave()
                                                ? ""
                                                : "disabled"
                                            }`}
                                        onClick={this.handleSaveEvent}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>

                        </div>
                    </Transition>
                    <div
                        className={`ui ${
                            isFetching ? "active" : "disabled"
                            } inverted dimmer`}
                    >
                        <div className="ui medium loader" />
                    </div>
                </div>
            </div>
        );
    }
}

export default HomeComponent;
