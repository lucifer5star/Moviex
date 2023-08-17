import { useEffect } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import {fetchApiData} from "./utils/api"
import { useSelector,useDispatch } from 'react-redux'
import { getApiConfiguration,getGenres } from './store/homeSlice'
import Home from './pages/home/Home'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import Details from './pages/details/Details'
import Explore from './pages/explore/Explore'
import SearchResult from './pages/searchResult/SearchResult'
import PageNotFound from './pages/404/404'

function App() {
  const dispatch = useDispatch();
  const {url} = useSelector((state)=>state.home)
  useEffect(()=>{
    fetchApiConfig();
    genresCall();
  },[])

  const fetchApiConfig=()=>{
    fetchApiData("/configuration").then((res)=>{
      console.log(res);
      
      const url={
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      }

      dispatch(getApiConfiguration(url))
    })
  }
// genres call
  const genresCall= async()=>{
    let promises=[];
    let endPoints= ["tv","movie"];
    let allGenres={};
    endPoints.forEach((url)=>{
      promises.push(fetchApiData(`/genre/${url}/list`))
    })
    const data= await Promise.all(promises);
    // console.log(data);
    data.map(({genres})=>{
      return genres.map((item)=>(allGenres[item.id]=item))
    })
    // console.log(allGenres);
    dispatch(getGenres(allGenres));
  }

  return (
    <BrowserRouter>
    <Header/>
      <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/:mediaType/:id' element={<Details/>}/>
         <Route path='/search/:query' element={<SearchResult/>}/>
         <Route path='/explore/:mediaType' element={<Explore/>}/>
         <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
