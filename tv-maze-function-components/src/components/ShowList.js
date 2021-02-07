import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchShows from './SearchShows';
import noImage from '../img/download.jpeg';

import '../App.css';

const ShowList = (props) => {
  const [searchData, setSearchData] = useState(undefined);
  const [showsData, setShowsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  // const [pageNum, setPageNum] = useState(undefined);
  const pageNum = props.match.params.id
  let li = null;
  let img = null;

  useEffect(() => {
    console.log('render');
    
    //console.log(pageNum)
    //setPageNum(props.match.params.id);
    //console.log(pageNum)
    async function fetchData() {
      if (searchTerm) {
        const { data } = await axios.get(
          'http://api.tvmaze.com/search/shows?q=' + searchTerm
        );
        setSearchData(data);
      } else {
        try {
          const { data } = await axios.get('http://api.tvmaze.com/shows?page='+pageNum);
          setShowsData(data);
        } catch (e) {
          console.log(e);
        }
      }
    }
    fetchData();
  }, [searchTerm,props.match.params.id,pageNum]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  const buildListItem = (show) => {
    if (show.image && show.image.medium) {
      img = <img alt="Show" src={show.image.medium} />;
    } else {
      img = <img alt="Show" src={noImage} />;
    }

    return (
      <li key={show.id}>
        <Link to={`/shows/${show.id}`}>
          {img} <br />
          {show.name}
        </Link>
      </li>
    );
  };

  if (searchTerm) {
    li =
      searchData &&
      searchData.map((shows) => {
        let { show } = shows;
        return buildListItem(show);
      });
  } else {
    li =
      showsData &&
      showsData.map((show) => {
        return buildListItem(show);
      });
  }
  return (
    <div className="App-body">
      <div className="pagination">
      {pageNum <= 0 ? (<p></p>) : (<a href={`/shows/page/${parseInt(pageNum - 1)}`}><button className="btn">Previous</button></a>)}
      {parseInt(pageNum) + 1 > 205 ? (<p></p>) : (<a href={`/shows/page/${parseInt(pageNum) + 1}`}><button className="btn">{parseInt(pageNum)+ 1}</button></a>)}
      {parseInt(pageNum) + 2 > 205 ? (<p></p>) : (<a href={`/shows/page/${parseInt(pageNum) + 2}`}><button className="btn">{parseInt(pageNum)+ 2}</button></a>)}
      {parseInt(pageNum) + 3 > 205 ? (<p></p>) : (<a href={`/shows/page/${parseInt(pageNum) + 3}`}><button className="btn">{parseInt(pageNum)+ 3}</button></a>)}
      {parseInt(pageNum) + 4 > 205 ? (<p></p>) : (<a href={`/shows/page/${parseInt(pageNum) + 4}`}><button className="btn">{parseInt(pageNum)+ 4}</button></a>)}
      {parseInt(pageNum) + 5 > 205 ? (<p></p>) : (<a href={`/shows/page/${parseInt(pageNum) + 4}`}><button className="btn">{parseInt(pageNum)+ 5}</button></a>)}
      {parseInt(pageNum) >= 205 ? (<p></p>) : (<a href={`/shows/page/${parseInt(pageNum) + 1}`}><button className="btn">Next</button></a>)}
      </div>
      <SearchShows searchValue={searchValue} />
      <ul className="list-unstyled">{li}</ul>
    </div>
  );
};

export default ShowList;
