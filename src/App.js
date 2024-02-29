import { useEffect, useState } from 'react';
import '../src/lib/styles/animations.css'

import NotFound from '../src/routes/NotFound';
import Login from './auth/Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './lib/components/Navbar';
import Footer from './lib/components/Footer';

/*ROUTES*/
import HattiFnattMagic from '../src/lib/components/HattiFnattMagic/HattiFnattMagic';
import Settings from '../src/lib/components/Settings/Settings';
import Home from '../src/lib/components/Home/Home';
import SignUp from './auth/SignUp';
import Reset from './auth/Reset';


function App() {

  let [mode, setMode] = useState("Light");

  useEffect(() => {
    setMode(localStorage.getItem("mode"));
    if (mode === null || mode === undefined) setMode("Light");
}, []);

  return (
        <Router>
          <div className="App" id={`${mode}Mode`}>
            <header className="App-header">
            <Navbar></Navbar>
            </header>
            <main>
              <Switch>
                <Route exact path="/" >
                  <Home></Home>
                </Route>
                <Route exact path="/home" >
                  <Home></Home>
                </Route>
                <Route exact path="/login">
                  <Login></Login>
                </Route>
                <Route exact path="/hattifnattmagic">
                  <HattiFnattMagic></HattiFnattMagic>
                </Route>
                <Route exact path="/register">
                  <SignUp></SignUp>
                </Route>
                <Route exact path="/settings">
                  <Settings></Settings>
                </Route>
                <Route exact path="/reset">
                  <Reset></Reset>
                </Route>
                <Route path="*">
                  <NotFound></NotFound>
                </Route>
              </Switch>
            </main>
            <Footer></Footer>
          </div>
        </Router> 
  );
}

export default App;
