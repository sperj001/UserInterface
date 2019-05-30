import React, { Component } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { Table, Button } from 'reactstrap';
import { surveyClient } from '../../../axios/sms-clients/survey-client';
import { ISurvey } from '../../../model/surveys/survey.model';
import { connect } from 'react-redux';
import { IAuthState } from '../../../reducers/management';
import { IState } from '../../../reducers';
import Loader from '../Loader/Loader';

interface IComponentProps extends RouteComponentProps<{}> {
    auth: IAuthState;
}

interface IComponentState {
    surveys: ISurvey[],
    surveysLoaded: boolean,
    redirectTo: any,
    activeCheck: boolean,
    filteredSurveys: ISurvey[]
}

class AssignedSurveysComponent extends Component<IComponentProps, IComponentState, {}> {
    constructor(props: any) {
        super(props);
        this.state = {
            surveys: [],
            surveysLoaded: false,
            redirectTo: null,
            activeCheck: true,
            filteredSurveys: []
        }
    }

    componentDidMount() {
        this.loadMyAssignedSurveys();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.auth !== this.props.auth) {
            this.loadMyAssignedSurveys();
            
        }
    }

    loadMyAssignedSurveys = async () => {
        if (this.props.auth.currentUser.email) {
            const myAssignedSurveys = await surveyClient.findSurveysAssignedToUser(this.props.auth.currentUser.email);
            
            this.setState({
                surveys: myAssignedSurveys,
                surveysLoaded: true
            })
            this.returnAssignedSurveys(myAssignedSurveys);
        }
    }

    handleTakeSurvey = (surveyId: number) => {
        this.setState({
            redirectTo: `/surveys/survey-taking/${surveyId}`
        })
    }

    returnAssignedSurveys = (arr) => {
        let lByAssigned = arr;
        let filtered:ISurvey[] = [];

        filtered = lByAssigned.filter((survey) => {
            if(new Date(survey.closingDate) > new Date()){
                return true;
            } else if (survey.closingDate === null){
                return true;
            }
            return false;
        });
        this.setState({
            filteredSurveys: filtered,
            activeCheck: true
        });
    }

    returnClosed = (arr) => {
        let lByIncomplete = arr;
        let filtered: ISurvey[] = [];
        // let hFilter: ISurvey[] = [];

        filtered = lByIncomplete.filter((survey) => {
            if(survey.closingDate !== null) {
                if(new Date(survey.closingDate) < new Date()){
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });

        this.setState({
            filteredSurveys: filtered,
            activeCheck: false
        });
    }

    filterCheck = (e) => {
        const {id:option} = e.target;
        switch(option){
            case "Assigned":
                this.returnAssignedSurveys(this.state.surveys);
                break;
            case "Closed":
                this.returnClosed(this.state.surveys);
                break;
            default:
                break;
        }
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect push to={this.state.redirectTo} />
        }
        const sortOptions = ["Assigned", "Closed"];
        return (
            <>
                {this.state.activeCheck ? <>
                    {this.state.surveysLoaded ? (
                        this.state.surveys.length ? (
                            <>
                            <div className="filterSelect">
                                <div className="dropdown sortDropDown">
                                    <Button className="btn userDropdownBtn dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Sort By
                                    </Button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                        <ul className="list-group">
                                        { 
                                            sortOptions.map(option => (
                                                <li id={option} key={option} className="list-group-item option-box" onClick={(e) => this.filterCheck(e)}>{option}</li>
                                            ))
                                        }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <Table striped id="manage-users-table" className="tableUsers">
                                <thead className="rev-background-color">
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Date Created</th>
                                        <th>Closing Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.filteredSurveys.map((survey, index) => (
                                        <tr key={index} className="rev-table-row" onClick={() => this.handleTakeSurvey(survey.surveyId)}>
                                            <td>{survey.title}</td>
                                            <td>{survey.description}</td>
                                            <td>{survey.dateCreated && new Date(survey.dateCreated).toDateString()}</td>
                                            <td>{survey.closingDate && new Date(survey.closingDate).toDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            </>
                        ) : (
                            <>
                                <div className="filterSelect">
                                    <div className="dropdown sortDropDown">
                                        <Button className="btn userDropdownBtn dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Sort By
                                        </Button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                            <ul className="list-group">
                                            { 
                                                sortOptions.map(option => (
                                                    <li id={option} key={option} className="list-group-item option-box" onClick={(e) => this.filterCheck(e)}>{option}</li>
                                                ))
                                            }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="center-div">No Surveys to Display</div>
                            </>
                            )
                    ) : (
                            <Loader/>
                        )}
                </> : <>
                    {this.state.surveysLoaded ? (
                        this.state.surveys.length ? (
                            <>
                            <div className="filterSelect">
                                <div className="dropdown sortDropDown">
                                    <Button className="btn userDropdownBtn dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Sort By
                                    </Button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                        <ul className="list-group">
                                        { 
                                            sortOptions.map(option => (
                                                <li id={option} key={option} className="list-group-item option-box" onClick={(e) => this.filterCheck(e)}>{option}</li>
                                            ))
                                        }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <Table striped id="manage-users-table" className="tableUsers">
                                <thead className="rev-background-color">
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Date Created</th>
                                        <th>Closing Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.filteredSurveys.map((survey, index) => (
                                        <tr key={index} className="rev-table-row">
                                            <td>{survey.title}</td>
                                            <td>{survey.description}</td>
                                            <td>{survey.dateCreated && new Date(survey.dateCreated).toDateString()}</td>
                                            <td>{survey.closingDate && new Date(survey.closingDate).toDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            </>
                        ) : (
                            <>
                            <div className="filterSelect">
                                    <div className="dropdown sortDropDown">
                                        <Button className="btn userDropdownBtn dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Sort By
                                        </Button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                            <ul className="list-group">
                                            { 
                                                sortOptions.map(option => (
                                                    <li id={option} key={option} className="list-group-item option-box" onClick={(e) => this.filterCheck(e)}>{option}</li>
                                                ))
                                            }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="center-div">No Surveys to Display</div>
                            </>
                            )
                    ) : (
                            <Loader/>
                        )}
                </>
                }
                </>
        );
    }
}

const mapStateToProps = (state: IState) => ({
    auth: state.managementState.auth
});

export default connect(mapStateToProps)(AssignedSurveysComponent);