import axios from 'axios'
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


export const deleteEvents =(id,status) => {
    return (dispatch) => {
      dispatch(fetchEventsRequest())
       axios.delete(`https://ev-mn-ss.herokuapp.com/event/${id}/delete`)
        .then(response => {
        if(status==='allEvents')
        {
          dispatch(fetchEvents())
        }
        else if(status==='myEvents')
        {
          dispatch(fetchMyEvents())
        }
        else if(status==='favorites')
        {
          dispatch(fetchFavorites())
        }

          console.log(response)
        })
        .catch(error => { 
          console.log(error)

          dispatch(fetchEventsFailure(error.message))
        }) 
      console.log(id)
    }
  }


  export const updateEvents =(event,id,status) => {
    return (dispatch) => {
      dispatch(fetchEventsRequest())
       axios
        .put(`https://ev-mn-ss.herokuapp.com/event/${id}/update`,event)
        .then(response => {
          if(status==='allEvents')
          {
            dispatch(fetchEvents())
          }
          else if(status==='myEvents')
          {
            dispatch(fetchMyEvents())
          }
          else if(status==='favorites')
          {
            dispatch(fetchFavorites())
          }

          console.log(response)
        })
        .catch(error => {
          console.log(error)

          dispatch(fetchEventsFailure(error.message))
        })
    }
  }

  export const fetchFilter =(filter,status) => {
    return (dispatch) => {

      const filterTags=(value)=>{
        let exist=true;
        filter.tags.toLowerCase().split(',').forEach((element)=>{
          if(value.indexOf(element)===-1)
          {
            exist=false;
            return
          }
        })
        if(exist===false)
        {    
          return false
        }
        else{
          return true;    
        }
      }
      if(status==='allEvents')
          {
            dispatch(fetchEventsRequest())
            axios.get('https://ev-mn-ss.herokuapp.com/event')
              .then(response => {

                const events = response.data
                
                let tmparr=[]
 
                events.map((value)=>{
                  let date=new Date(value.date) 
                  let filterDateBefore=new Date(filter.eventBefore)
                  let filterDateAfter=new Date(filter.eventAfter)
                  // console.log(date)
                  // console.log(filterDateBefore)
 
                  if(value.name.toLowerCase().indexOf(filter.name.toLowerCase())!==-1 && value.address.toLowerCase().indexOf(filter.address.toLowerCase())!==-1 && value.category.toLowerCase().indexOf(filter.category.toLowerCase())!==-1 && (filter.eventType!==''?value.eventType.toLowerCase()===filter.eventType.toLowerCase():true) && (filter.eventBefore!==''?(date.getFullYear()<=filterDateBefore.getFullYear() && date.getMonth()<=filterDateBefore.getMonth() && date.getDate()<filterDateBefore.getDate()):true) && (filter.eventAfter!==''?(date.getFullYear()>=filterDateAfter.getFullYear() && date.getMonth()>=filterDateAfter.getMonth() && date.getDate()>filterDateAfter.getDate()):true) && filterTags(value.tags.toLowerCase())!==false)
                  {
                    tmparr.push(value)
                  }
                })

                console.log(tmparr)
                dispatch(fetchFilterSuccess(tmparr))
              })
              .catch(error => {
                console.log(error)
                dispatch(fetchEventsFailure(error.message))
              })
          }
          else if(status==='myEvents')
          {
            dispatch(fetchEventsRequest())

                if(JSON.parse(localStorage.getItem('information')).role==='manager')
                {
                  axios.get('https://ev-mn-ss.herokuapp.com/event')
                  .then((response) => {
                    const events = response.data;
                    let tempArray=[]
                    events.map((value)=>{
                      let date=new Date(value.date) 
                      let filterDateBefore=new Date(filter.eventBefore)
                      let filterDateAfter=new Date(filter.eventAfter)
                      if(value.name.toLowerCase().indexOf(filter.name.toLowerCase())!==-1 && value.address.toLowerCase().indexOf(filter.address.toLowerCase())!==-1 && value.category.toLowerCase().indexOf(filter.category.toLowerCase())!==-1 && (filter.eventType!==''?value.eventType.toLowerCase()===filter.eventType.toLowerCase():true) && (filter.eventBefore!==''?(date.getFullYear()<=filterDateBefore.getFullYear() && date.getMonth()<=filterDateBefore.getMonth() && date.getDate()<filterDateBefore.getDate()):true) && (filter.eventAfter!==''?(date.getFullYear()>=filterDateAfter.getFullYear() && date.getMonth()>=filterDateAfter.getMonth() && date.getDate()>filterDateAfter.getDate()):true) && filterTags(value.tags.toLowerCase())!==false && value.creator===JSON.parse(localStorage.getItem('information')).email)
                      {
                        tempArray.push(value)
                      }
                    })
                    dispatch(fetchFilterSuccess(tempArray))

                    console.log(tempArray);

                  })
                }
                else {
                  return 
                }
         
          }
          else if(status==='favorites')
          {
            dispatch(fetchEventsRequest())

            
                axios.get('https://ev-mn-ss.herokuapp.com/event')
                .then((response)=>{
                  const events = response.data;
                  let tempArray=[]
                  events.map((value)=>{
                    
                    let date=new Date(value.date) 
                    let filterDateBefore=new Date(filter.eventBefore)
                    let filterDateAfter=new Date(filter.eventAfter)
                    if(value.name.toLowerCase().indexOf(filter.name.toLowerCase())!==-1 && value.address.toLowerCase().indexOf(filter.address.toLowerCase())!==-1 && value.category.toLowerCase().indexOf(filter.category.toLowerCase())!==-1 && (filter.eventType!==''?value.eventType.toLowerCase()===filter.eventType.toLowerCase():true) && (filter.eventBefore!==''?(date.getFullYear()<=filterDateBefore.getFullYear() && date.getMonth()<=filterDateBefore.getMonth() && date.getDate()<filterDateBefore.getDate()):true) && (filter.eventAfter!==''?(date.getFullYear()>=filterDateAfter.getFullYear() && date.getMonth()>=filterDateAfter.getMonth() && date.getDate()>filterDateAfter.getDate()):true) && filterTags(value.tags.toLowerCase())!==false && value.favourite.indexOf(JSON.parse(localStorage.getItem('information')).email)!==-1)
                      {
                        tempArray.push(value)
                      }
                      
                  })
                  dispatch(fetchFilterSuccess(tempArray))
        
                })
             
          }
    }
  }

export const fetchEvents =() => {
  return (dispatch) => {
    dispatch(fetchEventsRequest())
     axios.get('https://ev-mn-ss.herokuapp.com/event')
      .then(response => {
        const events = response.data
        dispatch(fetchEventsSuccess(events))

        dispatch(fetchTagsAndCategory())

        console.log(events)
      })
      .catch(error => {
        console.log(error)
        dispatch(fetchEventsFailure(error.message))
      })
  }
}




export const fetchFavorites=()=>{
  return (dispatch) => {
 
        axios.get('https://ev-mn-ss.herokuapp.com/event')
        .then((response)=>{
          const events = response.data;
          let tempArray=[]
          events.map((value)=>{
            if(value.favourite.indexOf(JSON.parse(localStorage.getItem('information')).email)!==-1)
            {
              tempArray.push(value)
            }
          })
          dispatch(fetchFavoritesSuccess(tempArray))

        console.log(tempArray);
        })
     
  }
}


export const fetchMyEvents=()=>{
  return (dispatch) => {

      if(JSON.parse(localStorage.getItem('information')).role==='manager')
      {
        axios.get('https://ev-mn-ss.herokuapp.com/event')
        .then((response) => {
          const events = response.data;
          let tempArray=[]
          events.map((element)=>{
            if(element.creator===JSON.parse(localStorage.getItem('information')).email)
            {
              tempArray.push(element)
            }
          })
          dispatch(fetchMyEventsSuccess(tempArray))

          console.log(tempArray);

        })
      }
      else {
        return 
      }
 
} 
}

export const fetchTagsAndCategory =() => {
  return (dispatch) => {
    dispatch(fetchEventsRequest())
     axios.get('https://ev-mn-ss.herokuapp.com/tnc')
      .then(response => {
        const events = response.data
        dispatch(fetchTagsAndCategorySuccess(events))
      })
      .catch(error => {
        console.log(error)
        dispatch(fetchEventsFailure(error.message))
      })
  }
}

export const updateTagsAndCategory =(tc,id) => {
  return (dispatch) => {
    dispatch(fetchEventsRequest())
     axios.put(`https://ev-mn-ss.herokuapp.com/tnc/${id}/update`,tc)
      .then(response => {
        dispatch(fetchTagsAndCategory())
        console.log(response)
      }) 
      .catch(error => {
        console.log(error)
        dispatch(fetchEventsFailure(error.message))
      })
  }
}

export const fetchEventsRequest = () => {
    return {
      type: FETCH_EVENTS_REQUEST
    }
  }

  export const fetchUserStatus=(status)=>{
    return {
      type: FETCH_USER_STATUS,
      payload: status
    }
  }
  export const fetchFilterSuccess= event =>{
    console.log(event)
    return {
      type: FETCH_FILTER_SUCCESS,
      payload: event
    }
    
  }
  export const fetchEventsSuccess = events => {
    return {
      type: FETCH_EVENTS_SUCCESS,
      payload: events
    }
  }

  export const fetchMyEventsSuccess = events => {
    return {
      type: FETCH_MYEVENTS_SUCCESS,
      payload: events
    }
  }
  export const fetchFavoritesSuccess = events => {
    return {
      type: FETCH_FAVORITES_SUCCESS,
      payload: events
    }
  }
  export const fetchTagsAndCategorySuccess = events => {
    return {
      type: FETCH_TAGS_AND_CATEGORY,
      payload: events
    }
  }
  
  export const fetchEventsFailure = error => {
    return {
      type: FETCH_EVENTS_FAILURE,
      payload: error
    }
  }