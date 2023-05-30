import {
    FETCH_EVENTS_REQUEST,
    FETCH_EVENTS_SUCCESS,
    FETCH_EVENTS_FAILURE,
    FETCH_TAGS_AND_CATEGORY,
    FETCH_FAVORITES_SUCCESS,
    FETCH_MYEVENTS_SUCCESS,
    FETCH_FILTER_SUCCESS,
    FETCH_USER_STATUS
  } from './actionTypes'
  
  const initialState = {
    loading: false,
    events: [],
    tagsAndCategory:[],
    userStatus:'allEvents',
    error: ''
  }
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_EVENTS_REQUEST:
        return {
          ...state,
          loading: true
        }
      case FETCH_EVENTS_SUCCESS:
        return {
          ...state,
          loading: false,
          events: action.payload,
          error: ''
        }
      case FETCH_FAVORITES_SUCCESS:
        return {
          ...state,
          loading: false,
          events: action.payload,
          error: ''
        }
      case FETCH_MYEVENTS_SUCCESS:
        return {
          ...state,
          loading: false,
          events: action.payload,
          error: ''
        }
      case FETCH_FILTER_SUCCESS:
        return {
          ...state,
          loading: false,
          events: action.payload,
          error: ''
        }
        case FETCH_USER_STATUS:
          return {
            ...state,
            userStatus: action.payload,
          }
      case FETCH_TAGS_AND_CATEGORY:
        return {
          ...state,
          loading: false,
          tagsAndCategory: action.payload,
          error: ''
        }
      case FETCH_EVENTS_FAILURE:
        return {
          loading: false,
          events: [],
          tagsAndCategory:[],
          error: action.payload
        }
      default: return state
    }
  }
  
  export default reducer
  