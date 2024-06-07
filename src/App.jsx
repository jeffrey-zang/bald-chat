import Chat from './pages/Chat';
import Login from './pages/Login';
import { Routes, Route } from 'react-router-dom';

const App = () => {  

  return (

    <Routes>
      <Route index element={<Login />} />
      <Route path='chat' element={<Chat />} />
      <Route path='*' element={<h1>nothing here boy <a className="border border-black" href="/">yeetu</a></h1>} />
    </Routes>
  );
};

export default App;
