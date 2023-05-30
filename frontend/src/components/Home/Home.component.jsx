import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Logo from './Logo.png'
import Stack from '@mui/material/Stack';
import axios, { Axios } from 'axios'
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import { Modal } from 'antd';
import Chip from '@mui/material/Chip';
import './Home.css'
import Card from '../Card/Card.component';
import { connect } from 'react-redux'
import { updateTagsAndCategory } from '../../redux/actions';
import FavoriteIcon from '@mui/icons-material/Favorite';
 
import Joi from "joi";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import ArticleIcon from '@mui/icons-material/Article';
import { fetchMyEvents } from '../../redux/actions';
import { fetchFavorites } from '../../redux/actions';
import { fetchEvents } from '../../redux/actions';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FaceIcon from '@mui/icons-material/Face';
import { fetchFilter } from '../../redux/actions';
import { fetchUserStatus } from '../../redux/actions';
 
function Home({tnc,updateTagsAndCategory,fetchMyEvents,fetchFavorites,fetchEvents,fetchFilter,fetchUserStatus}) {


    const navigate=useNavigate();
    const [state, setState] = useState(0);
    const [userInfo, setUserInfo] = useState({});
    const [canCreateEvent, setCanCreateEvent] = useState(false);
    const [visible, setVisible] = useState(false);
    
      const [arr, setArr] = useState([])
      const [loggedIn, setLoggedIn] = useState(false)


     
      const [eventDetails, setEventDetails] = useState({
        name:"",
        description:"",
        address:"",
        creator:"",
        category:"",
        tags:"",
        eventType:"",
        date:'',
        favourite:""
      });

      const [filterDetails, setFilterDetails] = useState({
        name:"",
        address:"",
        category:"",
        tags:"",
        eventType:"",
        eventBefore:'',
        eventAfter:'',
      })


    useEffect(() => {
              fetchUserStatus('allEvents')
                console.log(localStorage.getItem('information'))
                if(localStorage.getItem('information')===null || localStorage.getItem('information')===undefined)
                {
                  setCanCreateEvent(false);
                  setLoggedIn(false)
                }else{

                if(localStorage.getItem('information')!==null && localStorage.getItem('information')!==undefined && JSON.parse(localStorage.getItem('information')).role==='manager')
                {
                    setCanCreateEvent(true);
                  setLoggedIn(true)
                  setUserInfo(JSON.parse(localStorage.getItem('information')))
              
                    setEventDetails({...eventDetails,creator:JSON.parse(localStorage.getItem('information')).email})
                }
                else if(localStorage.getItem('information')!==null && localStorage.getItem('information')!==undefined && JSON.parse(localStorage.getItem('information')).role==='regular')
                {
                  setUserInfo(JSON.parse(localStorage.getItem('information')))
              
                    setCanCreateEvent(false);
                  setLoggedIn(true)
                }}
                

        
    }, [state])   

   

    useEffect(() => {
      const temp1=eventDetails.tags.substring(1)
      const temp2=temp1.split(' ');
      setArr(temp2);
    }, [eventDetails.tags])
    
 
    const [tagsString, setTagsString] = useState('');
    
    const [searchTags, setSearchTags] = useState('')

   const logOut=async()=>{
        setLoggedIn(false)
        localStorage.removeItem('information')

        navigate('/login')
  }

  const handleChange = (newValue) => {
    setEventDetails({...eventDetails,date:newValue});
  };


  const handleInputChange=(event)=>{
    const { name, value } = event.target;
    let eventData = { ...eventDetails };
    eventData[name] = value;
    setEventDetails(eventData); 
  }

  const handleFilterChange=(event)=>{
    const { name, value } = event.target;
    let filterData = { ...filterDetails };
    filterData[name] = value;
    setFilterDetails(filterData); 
  } 

  const handleBeforeDate=(value)=>{
    setFilterDetails({...filterDetails,eventBefore:value});
  }
  
  const handleAfterDate=(value)=>{
    setFilterDetails({...filterDetails,eventAfter:value});
  }
  const submit=()=>{    
    setVisible(false);
    
    let str=eventDetails.tags
    if(str[str.length-1]===' ')
    {
      str=str.substring(0,str.length-1)
    }
    if(str[0]===' ')
    {
      str=str.substring(1)
    }
    setEventDetails({...eventDetails,tags:str})

    axios.post('https://ev-mn-ss.herokuapp.com/event/create',eventDetails)
    .then((ref)=>{
      toast.success('Event added')
    })
    .catch((err)=>{
      console.log(err)
    })

   updateTagsAndCategory({'category':[...tnc.tagsAndCategory[0].category.split(','),eventDetails.category].toString(),'tags':[...tnc.tagsAndCategory[0].tags.split(','),eventDetails.tags.split(' ').toString()].toString()},1)


    setEventDetails({
      name:"",
        description:"",
        address:"",
        creator:"",
        category:"",
        tags:"",
        eventType:"",
        date:'',
        favourite:""
  });
  }
  let [page, setPage] = useState(1);
     
  const handlePageChange = (e, p) => {
    setPage(p);
  };

 

const [filterDataLoading, setFilterDataLoading] = useState(false)

  const filterFunction=() => {    
    setPage(1)
    fetchFilter(filterDetails,tnc.userStatus)
  }
  const clearFilterFunction=()=>{
    setPage(1)
    fetchFilter({
      name:"",
      address:"",
      category:"",
      tags:"",
      eventType:"",
      eventBefore:'',
      eventAfter:'',
    },tnc.userStatus)
  }
  


  const addTags=(event)=>{
    let str = tagsString.replace(/\s\s+/g, ' ');
    if(str[str.length-1]===' ')
    {
      str=str.substring(0,str.length-1)
    }
    if(str[0]===' ')
    {
      str=str.substring(1)
    }
    if (event.keyCode == 13 && str!=='' && str!==' ') {
      let inc=eventDetails.tags;
      inc+=' '+str;
      setTagsString('');
      setEventDetails({...eventDetails,tags:inc})
      return true;
   } else { 
      return false; 
   }
  }

  const [errors, setErrors] = useState({});
  const schema = Joi.object({ 
        name: Joi.string().min(3).max(20).required(),
        description: Joi.string().min(7).max(100).required(),
        address: Joi.string().min(5).required(),
        category: Joi.string().min(5).max(20).required(),
        tags:Joi.string().min(3).required(),
        eventType:Joi.string().required(),
        date: Joi.date().min(new Date()).required(),
  });

  const validateJoiForm = () => {
    const result = schema.validate({
      name:eventDetails.name,
      description:eventDetails.description,
      address:eventDetails.address,
      category:eventDetails.category,
      tags:eventDetails.tags,
      eventType:eventDetails.eventType,
      date:eventDetails.date
  });
    console.log(result);
    const { error } = result;
    if (!error) {
       submit();
    } else {
      const errorData = {};
      for (let item of error.details) {
        const name = item.path[0];
        const message = item.message;
        errorData[name] = message;
        toast.error(errorData[name])
      }
      console.log(errors);
      setErrors(errorData);
      toast.error(errors)
      return errorData;
    }
  };

  const addSearchTags=(event)=>{
    let str = searchTags.replace(/\s\s+/g, ' ');
    if(str[str.length-1]===' ')
    {
      str=str.substring(0,str.length-1)
    }
    if(str[0]===' ')
    {
      str=str.substring(1)
    }
    if (event.keyCode == 13 && str!=='' && str!==' ') {
      let arr=[...filterDetails.tags.split(','),...str.split(' ')]
      setSearchTags('');
      setFilterDetails({...filterDetails,tags:arr.toString()})
      return true;
   } else { 
      return false; 
   }
  }
  const [showProfile, setShowProfile] = useState('profileHide')
const [favoriteIsSet, setFavoriteIsSet] = useState(false)


  const [bgcolorName, setBgcolorName] = useState('white')
  const [bgcolorLogOut, setBgcolorLogout] = useState('white')




 return(
    <> 
    <div className='header'>
       <img src={Logo} alt="Logo" width={'210px'} height={'120px'} className='image'/>
        <h3 className='title'> Eventify </h3>


       <div className='logout'>
        {loggedIn?<button className='btn btn-outline-danger' onClick={()=>{logOut()}}>Logout</button>:<button className='btn btn-outline-danger' onClick={()=>{navigate('/login')}}>Login</button>} 
        </div>
        
    </div>
    
    {loggedIn===true?<>
      <div className='sidebar'>
<div className='allEvents' style={{'color':`${tnc.userStatus==='allEvents'?'rgb(45, 155, 251)':'black'}`}} onClick={()=>{fetchUserStatus('allEvents'); fetchEvents(); setPage(1); setFilterDetails({
        name:"",
        address:"",
        category:"",
        tags:"",
        eventType:"",
        eventBefore:'',
        eventAfter:'',
      });}}>
  All Events
<StorefrontIcon/>
</div>
{(canCreateEvent===true)?
<><div className='myEvents' style={{'color':`${tnc.userStatus==='myEvents'?'rgb(45, 155, 251)':'black'}`}} onClick={()=>{fetchUserStatus('myEvents'); fetchMyEvents();setPage(1); setFilterDetails({ 
        name:"",
        address:"",
        category:"",
        tags:"",
        eventType:"",
        eventBefore:'',
        eventAfter:'',
      });}}>
My Events
<ArticleIcon/>
</div>
<div className='create' onClick={()=>{setVisible(true)}}>
  <AddBoxIcon/>
    create
</div></>:''} 
{loggedIn===true?<div className='myFav' style={{'color':`${tnc.userStatus==='favorites'?'rgb(45, 155, 251)':'black'}`}} onClick={()=>{fetchUserStatus('favorites');fetchFavorites();setPage(1);setFilterDetails({
        name:"",
        address:"",
        category:"",
        tags:"",
        eventType:"",
        eventBefore:'',
        eventAfter:'',
      });}}>
  <FavoriteIcon/>
Favorites
</div>:''}

<div className='profile' onMouseOver={()=>{setShowProfile('profileShow')}} onMouseOut={()=>{setShowProfile('profileHide')}}>
<PersonPinIcon/>
Profile
</div>
<div className={`profileMouseOver ${showProfile}`} onMouseOver={()=>{setShowProfile('profileShow')}} onMouseOut={()=>{setShowProfile('profileHide')}}>
  <div style={{'borderBottom':'1px solid grey','padding':'10px 20px','backgroundColor':`${bgcolorName}`,'cursor':'pointer'}} onMouseOver={()=>{setBgcolorName('grey')}} onMouseOut={()=>{setBgcolorName('white')}}>
  <span><FaceIcon/> </span> {userInfo.name}
  </div>
  <div style={{'borderTop':'1px solid grey','padding':'10px 40px','marginTop':'-3.9px','backgroundColor':`${bgcolorLogOut}`,'cursor':'pointer'}} onMouseOver={()=>{setBgcolorLogout('grey')}} onMouseOut={()=>{setBgcolorLogout('white')}} onClick={()=>{logOut()}}>
    Logout
  </div>

</div></div></>:'' }


    <div className='filter'>
    <TextField sx={{ m: 1, minWidth: 120 }} id="outlined-basic" label="Search by title" variant="outlined" name="name" value={filterDetails.name} onChange={handleFilterChange}/>
    <TextField sx={{ m: 1, minWidth: 120 }} id="outlined-basic" label="Search by address" variant="outlined" name="address" value={filterDetails.address} onChange={handleFilterChange}/>

    <FormControl sx={{ m: 1, minWidth: 120 }}>
        
  <InputLabel id="demo-simple-select-label">Category</InputLabel>
  <Select 
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    name="category"
    value={filterDetails.category}
    label="Category"
    onChange={handleFilterChange}  
    >
      {tnc.tagsAndCategory[0]?
        tnc.tagsAndCategory[0].category.split(',').map((valueItem,key)=>{ 
          return(
<MenuItem value={valueItem} key={key.toString()}>{valueItem}</MenuItem>
   
    ) 
        }):''
 
      }
  </Select>
  </FormControl>
  <FormControl sx={{ m: 1, minWidth: 120 }}>

  <InputLabel id="demo-simple-select-label">Mode</InputLabel>
  <Select 
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={filterDetails.eventType}
    name="eventType"
    label="Mode"
    onChange={handleFilterChange}
  >
    <MenuItem value={'Virtual'}>Virtual</MenuItem>
    <MenuItem value={'Non virtual'}>Non virtual</MenuItem>
  </Select>
</FormControl>
<LocalizationProvider dateAdapter={AdapterDateFns} >
<Stack direction="row"   justifyContent="center"
 spacing={1}> 
<MobileDatePicker
          label="Events before"
          inputFormat="MM/dd/yyyy"
          value={filterDetails.eventBefore}
          onChange={handleBeforeDate}
          renderInput={(params) => <TextField {...params} />}
        />   
        <MobileDatePicker
          label="Events after"
          inputFormat="MM/dd/yyyy"
          value={filterDetails.eventAfter}
          onChange={handleAfterDate}
          renderInput={(params) => <TextField {...params} />}
        />
</Stack>
</LocalizationProvider> 

    </div> 
    <div style={{'display':'flex','justifyContent':'center'}}>
      <Button onClick={()=>filterFunction()}> 
        Filter 
      </Button>
    <Button color='error' 
    onClick={()=>{setFilterDetails({
        name:"",
        address:"",
        category:"",
        tags:"",
        eventType:"",
        eventBefore:'',
        eventAfter:'',
      }); clearFilterFunction()}}>Clear filter</Button>
      </div>
{
  (canCreateEvent===true)?
  
  <Box
  sx={{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    p: 1,
    m: 1,
    borderRadius: 1,}}>
      <div>
   
      <Modal
        title="Create new event"
        centered
        visible={visible}
        onOk={() => {validateJoiForm()}}
        onCancel={() => setVisible(false)}
        width={500}
      >
        <Stack direction={'row'} justifyContent='center' sx={{m:1}}>

          <TextField id="outlined-basic" label="Name" variant="outlined" name='name' value={eventDetails.name}  onChange={handleInputChange}/>

        </Stack>

        <Stack direction={'row'} justifyContent='center' sx={{m:1}}>

          <TextField id="outlined-basic" label="Description" variant="outlined" name='description' value={eventDetails.description}  onChange={handleInputChange}/>
        
        </Stack>

        <Stack direction={'row'} justifyContent='center' sx={{m:1}}>
          <TextField id="outlined-basic" label="Address" variant="outlined" name='address' value={eventDetails.address} onChange={handleInputChange}/>
        </Stack>

        <Stack direction={'row'} justifyContent='center' sx={{m:1}}>
        <TextField id="outlined-basic" label="Category" variant="outlined" name='category' value={eventDetails.category}  onChange={handleInputChange}/>
        </Stack>

        
        <Stack directiom={'row'} justifyContent={'center'} sx={{m:1,ml:14.3,maxWidth:222}}>
        <FormControl>
  <InputLabel id="demo-simple-select-label">Event type</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    name='eventType'
    value={eventDetails.eventType}
    label="Event type"
    onChange={handleInputChange}
  > 
    <MenuItem value={'Virtual'}>Virtual</MenuItem>
    <MenuItem value={'Non virtual'}>Non virtual</MenuItem>
  </Select>
</FormControl>
</Stack>

<LocalizationProvider dateAdapter={AdapterDateFns} >
<Stack direction="row"   justifyContent="center"
 spacing={1}> 
 <MobileDatePicker
          label="Choose Date"
          inputFormat="MM/dd/yyyy"
          value={eventDetails.date}
          onChange={handleChange}
          disablePast
          name='date'
          renderInput={(params) => <TextField {...params} />}
        />
</Stack> 
</LocalizationProvider>
<Stack direction={'row'} justifyContent='center' sx={{m:1}}>
        <TextField id="outlined-basic" label="Tags" variant="outlined" name='tags' value={tagsString} onChange={(e)=>setTagsString(e.target.value)} onKeyDown={(e)=>{addTags(e)}}/>
        </Stack> 
        <div style={{'margin':'auto','width':'70%'}}> 
          {
            arr.map((value,key)=>{
              return(<>
                  {(value!=='' && value!==' ')?<Chip label={value} variant="outlined" sx={{m:1}} key={key.toString()}/>:''}
                  </>)
            })
          }
        </div> 
      </Modal>

</div>
    <ToastContainer />

</Box>
:''}
<div className='chips'>
  <h4>Tags</h4>
  <Stack direction={'row'} justifyContent='center' sx={{m:1}}>
        <TextField id="outlined-basic" label="Tags" variant="outlined" name='tags' value={searchTags} onChange={(e)=>setSearchTags(e.target.value)} onKeyDown={(e)=>{addSearchTags(e)}}/>
        </Stack> 
        <div> 
          {
            filterDetails.tags.split(',').map((value,key)=>{
              return(<>
                  {(value!=='' && value!==' ')?<Chip label={value} variant="outlined" sx={{m:1}} key={key.toString()}/>:''}
                  </>)
            })
          }
        </div> 
        <Button color='error' onClick={()=>{setFilterDetails({...filterDetails,tags:""})}}>Clear Tags</Button>
  

</div>
{loggedIn===true?<div className='favorite'>

  
</div>:''}
<div>
  <Card prop={{canCreateEvent,loggedIn,page,filterDataLoading}}/>
</div>
<Stack spacing={2} direction={'row'} sx={{m:3,mb:3}} justifyContent={'center'}>

      <Pagination count={Math.round(tnc.events.length/2)}  
        size="large"
        page={page}
        variant="outlined"
        shape="rounded"
        onChange={handlePageChange} />
    </Stack><br /><br />

    </> 
  )
}

const mapStateToProps = (state) => {
  return {
      tnc: state
    }
}

const mapDispatchToProps = dispatch => {
  return {
    updateTagsAndCategory: (tc,id) => dispatch(updateTagsAndCategory(tc,id)),
    fetchMyEvents: () => dispatch(fetchMyEvents()),
    fetchFavorites: () => dispatch(fetchFavorites()),
    fetchEvents: () => dispatch(fetchEvents()),
    fetchFilter: (filter,status) => dispatch(fetchFilter(filter,status)),
    fetchUserStatus: (status) => dispatch(fetchUserStatus(status))

  } 
}

export default connect(mapStateToProps,mapDispatchToProps)(Home)