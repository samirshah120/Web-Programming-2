import React, { useState, useEffect } from 'react';
import axios from 'axios';
const md5 = require('blueimp-md5');
const publickey = 'f7d903d72421b5f0742f431122324431';
const privatekey = '38b5ba36f287f6f1ca48634b568f0a7038856643';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/series/';
const url ='?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
const SeriesInfo = (props) => {
    const [seriesInfo, setSeriesInfo] = useState(undefined);
    const [imagePath,setimagePath] = useState(undefined);
    useEffect(
        () => {
            async function fetchData() {
                try {
                    const results = await axios.get(baseUrl + props.match.params.id + url);
                    setimagePath(results.data.data.results[0].thumbnail.path+'/portrait_fantastic.'+results.data.data.results[0].thumbnail.extension)
                    console.log(results)
                    setSeriesInfo(results);
                } catch (e) {
                    console.log(e);
                }
    
            }
            fetchData();
        }, [props.match.params.id]
    )
    return (
        <div>
            <div>
            <img src={imagePath} alt="Not Found"></img>
            <p>{seriesInfo && seriesInfo.data.data.results[0].id}</p>
            <p>{seriesInfo && seriesInfo.data.data.results[0].title}</p>
            <p>{seriesInfo && seriesInfo.data.data.results[0].description}</p>
            <div>Comics</div>
            {seriesInfo && seriesInfo.data.data.results[0].comics.items.map((item) => {
            return <div key={item.resourceURI}>{item.name}</div>;
            })}
            <div>Characters</div>
            {seriesInfo && seriesInfo.data.data.results[0].characters.items.map((item) => {
            return <div key={item.name}>{item.name}</div>;
          })}
        <br/>
            </div>
        </div>
    )
    };
    export default SeriesInfo;