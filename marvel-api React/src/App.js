import React from 'react';
import './App.css';
import CharacterPage from './components/CharacterPage';
import CharacterInfo from './components/CharacterInfo';
import ComicPage from './components/ComicPage';
import ComicInfo from './components/ComicInfo';
import SeriesPage from './components/SeriesPage';
import SeriesInfo from './components/SeriesInfo';
import Error from './components/Error';
import IndexPage from './components/IndexPage';
import { Link ,Route, Switch,  BrowserRouter as Router } from 'react-router-dom'
function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
      <Link className="showlink" to="/characters/page/0">Characters</Link>
      <Link className="showlink" to="/comics/page/0">Comics</Link>
      <Link className="showlink" to="/series/page/0">Series</Link>
      </header>
      <Switch>
        <Route path="/"  exact component={IndexPage}  />
        <Route path='/characters/page/:page' exact component={CharacterPage} />
        <Route path='/characters/:id' exact component={CharacterInfo} />
        <Route path='/comics/page/:page' exact component={ComicPage} />
        <Route path='/comics/:id' exact component={ComicInfo} />
        <Route path='/series/page/:page' exact component={SeriesPage} />
        <Route path='/series/:id' exact component={SeriesInfo} />
        <Route path='*' exact component={Error} status={404} />
      </Switch>
      
    </div>
    </Router>
  );
}

export default App;
