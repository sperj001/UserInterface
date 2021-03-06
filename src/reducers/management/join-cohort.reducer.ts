import { joinCohortTypes } from "../../actions/join-cohort/join-cohort.actions";
import { authTypes } from "../../actions/auth/auth.actions";
import { IJoinCohortState } from ".";


const initialState: IJoinCohortState = {
    validToken: true,
    userToJoin:{
        userId: 0,
        userStatus: {
          statusId: 2,
          generalStatus: 'Training',
          specificStatus: 'Training',
          virtual: false
        },
        roles: [],
        trainingAddress: {
          addressId: 0,
          street: '',
          alias: '',
          city: '',
          country: '',
          state: '',
          zip: ''
        },
        personalAddress: {
            addressId: 0,
            street: '',
            alias: '',
            city: '',
            country: '',
            state: '',
            zip: '',
          },
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '', 
    }
}


export const joinCohortReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case joinCohortTypes.FAILED_TO_JOIN_COHORT:
            return {
                ...state,
            }
        case joinCohortTypes.FAILED_TO_CREATE_NEW_USER_FOR_COHORT:
            return {
                ...state,
            }
        case joinCohortTypes.FAILED_TO_FIND_LOGGED_IN_USER:
            return {
                ...state,
            }
        case joinCohortTypes.JOIN_COHORT:
            return {
                ...state,
            }
        case joinCohortTypes.CREATE_NEW_USER_FOR_COHORT:
            return {
                ...state,
                userToJoin: action.payload.newUser
            }
        case joinCohortTypes.FIND_LOGGED_IN_USER:
            return {
                ...state,
                userToJoin: action.payload.newUser
            }

        case authTypes.LOGOUT:
            return initialState;
    }
    return state;
  }