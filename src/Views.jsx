import {Routes, Route} from 'react-router' ;

import Chat from './pages/Chat';
import Search from './pages/Search';
import Map from './pages/Map';
import Help from './pages/Help';
import Settings from './pages/Settings';
import Trends from './pages/Trends';


const Views = () => {

    return (
        <Routes>
          <Route path="*" element={<Chat/>} />
          <Route path="/Chat" element={<Chat/>} />
          <Route path="/Search" element={<Search/>}/>
          <Route path="/Map" element={<Map/>} />
          <Route path="/Help" element={<Help/>} />
          <Route path="/Settings" element={<Settings/>}/>
          <Route path="/Trends" element={<Trends/>}/>
        </Routes>
    )
};

export default Views;