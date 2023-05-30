import React, { useEffect,useState } from 'react'
import { connect } from 'react-redux'
import { fetchEvents,deleteEvents } from '../../redux/actions'
import Card  from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack'
import backGround from '../../backGround.jpg'
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios'
import { Modal } from 'antd';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { updateEvents } from '../../redux/actions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



export const EventComp = ({ eventData, fetchEvents, updateEvents, deleteEvents,prop }) => {

 
    const [userInfo, setUserInfo] = useState({})
    const [visible, setVisible] = useState(false);


    useEffect(() => { 
        fetchEvents()
        
      }, [])


    useEffect(() => {
        (async()=>{
              if(localStorage.getItem('information')!==null && localStorage.getItem('information')!==undefined)
              {
                setUserInfo(JSON.parse(localStorage.getItem('information')))
              }  

        })()
    }, [])

    
    
    
    const setFavourite=(key)=>{
      const favouriteArray=eventData.events[key].favourite.split(',');

      if(favouriteArray.indexOf(userInfo.email)===-1)
      {
        if(favouriteArray[0]==='')
        {
          favouriteArray.shift();
        }
        favouriteArray.push(userInfo.email)

        updateEvents({"id":eventData.events[key].id,"favourite":favouriteArray.toString()},eventData.events[key].id,eventData.userStatus)
      }
      else if(favouriteArray.indexOf(userInfo.email)!==-1)
      {
        if(favouriteArray[0]==='')
        {
          favouriteArray.shift();
        }
        favouriteArray.splice(favouriteArray.indexOf(userInfo.email),1)
        updateEvents({"id":eventData.events[key].id,"favourite":favouriteArray.toString()},eventData.events[key].id,eventData.userStatus)
      }
    }

      return (eventData.loading) ? (
        <h2>      <CircularProgress />
        </h2>  
      ) : eventData.error ? (
        <h2>{eventData.error}</h2>
      ) : (
        <div>
          {
            eventData.events.map((value,key)=>{
              let date=new Date(value.date) 
                    let currentDate=new Date()
                return(

                    <div key={key.toString()}>
                     {console.log(key)}
        {(key>=Math.round(prop.page)*2-2 && key<=2*prop.page-1)?  
        <Stack direction={'row'} justifyContent='center' sx={{m:1}}>

                <Card sx={{ width: 345 }} >
                <CardMedia
                  component="img" 
                  height="140"
                  image={backGround}
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {value.name}
                  </Typography>
                  {prop.loggedIn?<Button color='error' onClick={()=>{setFavourite(key)}}>{value.favourite.indexOf(userInfo.email)===-1?<FavoriteBorderIcon />:<FavoriteIcon/>}</Button>:''}

                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                  <Stack>
                  <Typography variant="body2" color="text.secondary" justifyContent={'left'}>Venue:
                    {value.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">on 
                     {" "+(new Date(value.date)).toDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">category:
                     {" "+value.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     {value.eventType}
                  </Typography>
                  </Stack>
                  <div>
    <ToastContainer />

          {
            value.tags.split(' ').map((tag)=>{
                
            return(<>
                {(tag!==' ' && tag!=='')?<Chip label={tag} variant="outlined" sx={{m:1}}/>:''}
                </>) 

            }) 
          }
        </div> 
                </CardContent>
                <CardActions>
                  <Button size="small">Share</Button>
                  <Button size="small">Learn More</Button>
                  {console.log((new Date(value.date)).toDateString())}
                  {value.creator===userInfo.email &&(date.getFullYear()>=currentDate.getFullYear() && date.getMonth()>=currentDate.getMonth() && date.getDate()>currentDate.getDate() )?<Button size="small" type="primary" onClick={() => setVisible(true)}> 

        Delete
      </Button>:''}
      <Modal
        title="Delete "
        centered
        visible={visible}
        onOk={() => {deleteEvents(value.id,eventData.userStatus); setVisible(false); toast.success('Event Deleted')}}
        onCancel={() => {setVisible(false);}}
        width={500}
      >
                <p>Do you want to delete event?</p>

      </Modal> 
                </CardActions>
              </Card>
        </Stack>:''} </div>
        
              )
            })
}
        </div>
      )
}



const mapStateToProps = (state) => {
    return {
        eventData: state
      }
}

const mapDispatchToProps = dispatch => {
    return {
      fetchEvents: () => dispatch(fetchEvents()),
      deleteEvents: (id,status) => dispatch(deleteEvents(id,status)),
      updateEvents: (event,id,status) => dispatch(updateEvents(event,id,status)),
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(EventComp)