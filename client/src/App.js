import React from 'react';
import {Route, Switch} from 'react-router-dom';
import LandingPage from './Components/LandingPage/LandingPage'
import Header from './Components/Header/Header'
import './App.css';
import API from './api';
import UserContext from './Context/UserContext';
import GamePage from './Components/GamePage/GamePage';

class App extends React.Component {
  static contextType = UserContext

  async componentDidMount() {
    this.context.clearError()
    try {
      const res = await API.appLoad
      this.context.setGames(res.data.gameData)
      this.context.setGenres(res.data.genreData)
    }
    catch(e) {
      console.log("WOAH! Api fetch call error bro!")
      this.context.setError(e.message)
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route
          exact
          path='/'
          component={LandingPage}
          />
          <Route
          path='/game/:gameId'
          component={GamePage} />
        </Switch>
      </div>
    )
  };
}

export default App;
