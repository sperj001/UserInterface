import React, { Fragment, Component } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { Table, Button } from 'reactstrap';
import { ISurvey } from '../../../model/surveys/survey.model';
import SurveyModal from './survey-assign-modal.component';
import { surveyClient } from '../../../axios/sms-clients/survey-client';
import { IAuthState } from '../../../reducers/management';
import { IState } from '../../../reducers';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader';

interface IComponentProps extends RouteComponentProps<{}> {
    auth: IAuthState;
}

interface IComponentState {
    surveys: ISurvey[],
    surveysLoaded: boolean,
    surveysToAssign: number[],
    redirectTo: string | null,
    closingFilter: boolean
    listFiltered: ISurvey[]
}

class AllSurveysComponent extends Component<IComponentProps, IComponentState> {
    constructor(props) {
        super(props);
        this.state = {
            surveys: [],
            surveysLoaded: false,
            surveysToAssign: [],
            redirectTo: null,
            closingFilter: false,
            listFiltered: []
        }
    }

    componentDidMount() {
        this.loadAllSurveys();
    }

    // When the user clicks a data button for a survey, redirect to the data page for that survey
    handleLoadSurveyData = (surveyId: number) => {
        this.setState({
            redirectTo: `/surveys/survey-data/${surveyId}`
        })
    }

    // When the user clicks a users button for a survey, redirect to the respondents page for that survey
    loadSurveyRespondents = (surveyId: number) => {
        this.setState({
            redirectTo: `/surveys/respondents-data/${surveyId}`
        })
    }

    getClosingDate = (array, index) => {
        return array[index].closingDate;
    }

    returnPassedSurveys = (arr) => {
        let closingSurvey = arr;
        let filtered:ISurvey[] = [];
        for(let i = 0; i < closingSurvey.length; i++) {
            if(closingSurvey[i].closingDate !== null) {
                if(new Date(closingSurvey[i].closingDate) < new Date()) {
                    filtered.push(closingSurvey[i]);
                }
            }
        }
        this.setState({
            listFiltered: filtered
        });
    }

    returnActiveSurveys = (arr) => {
        let activeSurvey = arr;
        let filtered:ISurvey[] = [];
        filtered = activeSurvey.filter((survey) => {
            if(new Date(survey.closingDate) > new Date()){
                return true;
            } else if(survey.closingDate === null){
                return true;
            }
            return false;
        });
        this.setState({
            listFiltered: filtered
        });
    }

    filterListByClosing = () => {
        this.setState({
            closingFilter: true
        });
        console.log("In filter list by closing");
        this.returnPassedSurveys(this.state.surveys);
    }

    filterListByActive = () => {
        this.setState({
            closingFilter: true
        });
        this.returnActiveSurveys(this.state.surveys);
    }

    unFilterList = () => {
        this.setState({
            closingFilter: false
        });
    }

    checkFunc = (e) => {
        const { checked } = e.target;
        const id = +e.target.id;

        if (checked) {
            if (!this.state.surveysToAssign.includes(id)) {
                this.setState({
                    surveysToAssign: [...this.state.surveysToAssign, id]
                });
            }
        } else {
            if (this.state.surveysToAssign.includes(id)) {
                this.setState({
                    surveysToAssign: this.state.surveysToAssign.filter((surveyId) => {
                        return surveyId !== id
                    })
                });
            }
        }
    }

    // Load the surveys into the state
    loadAllSurveys = async () => {
        const allSurveys = await surveyClient.findAllSurveys();
        this.setState({
            surveys: allSurveys,
            surveysLoaded: true
        })
    }

    filterCheck = (e) => {
        const {id:option} = e.target;
        switch(option){
            case "Active":
                this.filterListByActive();
                break;
            case "Closed":
                this.filterListByClosing();
                break;
            default:
                break;
        }
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect push to={this.state.redirectTo} />
        }
        console.log(this.state.surveys);
        const sortOptions = ["Active", "Closed"];
        return (
            <>
                {this.state.surveysLoaded ? (
                    <Fragment>
                        {this.state.surveys.length ? (
                            <>
                            <div className="filterSelect">
                                <div className="dropdown userDropdown">
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
                                <button onClick={this.unFilterList} className="btn btn-secondary"> Remove filter </button>
                            </div>
                                <Table striped id="manage-users-table" className="tableUsers">
                                    <thead className="rev-background-color">
                                        <tr>
                                            <th>Select</th>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Date Created</th>
                                            <th>Closing Date</th>
                                            <th>Published</th>
                                            <th>Analytics</th>
                                            <th>Respondents</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!this.state.closingFilter ? this.state.surveys.map(survey => (
                                        <tr key={survey.surveyId} className="rev-table-row">
                                            <td><input type="checkbox" onChange={e => this.checkFunc(e)} id={survey.surveyId.toString()} /></td>
                                            <td>{survey.title}</td>
                                            <td>{survey.description}</td>
                                            <td>{survey.dateCreated && new Date(survey.dateCreated).toDateString()}</td>
                                            <td>{survey.closingDate && new Date(survey.closingDate).toDateString()}</td>
                                            <td>{survey.published ? 'Yes' : 'No'}</td>
                                            <td><Button className='assignSurveyBtn' onClick={() =>
                                                this.handleLoadSurveyData(survey.surveyId)}>Data</Button></td>
                                            <td><Button className='assignSurveyBtn' onClick={() =>
                                                this.loadSurveyRespondents(survey.surveyId)}>Status</Button></td>
                                        </tr>
                                    ))
                                    : 
                                    this.state.listFiltered.map(filtered => (
                                        <tr key={filtered.surveyId} className="rev-table-row">
                                            <td><input type="checkbox" onChange={e => this.checkFunc(e)} id={filtered.surveyId.toString()} /></td>
                                            <td>{filtered.title}</td>
                                            <td>{filtered.description}</td>
                                            <td>{filtered.dateCreated && new Date(filtered.dateCreated).toDateString()}</td>
                                            <td>{filtered.closingDate && new Date(filtered.closingDate).toDateString()}</td>
                                            <td>{filtered.published ? 'Yes' : 'No'}</td>
                                            <td><Button className='assignSurveyBtn' onClick={() =>
                                                this.handleLoadSurveyData(filtered.surveyId)}>Data</Button></td>
                                            <td><Button className='assignSurveyBtn' onClick={() =>
                                                this.loadSurveyRespondents(filtered.surveyId)}>Status</Button></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                                <div className="assignButtonDiv">
                                    <SurveyModal
                                        buttonLabel='Assign To Cohorts'
                                        surveysToAssign={this.state.surveysToAssign} />
                                </div>
                                
                            </>
                        ) : (
                                <div>No Surveys to Display</div>
                            )}
                    </Fragment>
                ) : (
                        <Loader/>
                    )}
            </>
        );
    }
}

const mapStateToProps = (state: IState) => ({
    auth: state.managementState.auth
});

export default connect(mapStateToProps)(AllSurveysComponent);