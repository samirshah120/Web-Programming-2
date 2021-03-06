import React, { useState, useEffect } from 'react';
import axios from 'axios';
const md5 = require('blueimp-md5');
const publickey = 'f7d903d72421b5f0742f431122324431';
const privatekey = '38b5ba36f287f6f1ca48634b568f0a7038856643';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics/';
const url ='?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
const ComicInfo = (props) => {
    const [comicInfo, setComicInfo] = useState(undefined);
    const [imagePath,setimagePath] = useState(undefined);
    useEffect(
        () => {
            async function fetchData() {
                try {
                    const results = await axios.get(baseUrl + props.match.params.id + url);
                    console.log(results)
                    setimagePath(results.data.data.results[0].thumbnail.path+'/portrait_fantastic.'+results.data.data.results[0].thumbnail.extension)
                    setComicInfo(results);
                } catch (e) {
                    console.log(e);
                }
    
            }
            fetchData();
        }, [props.match.params.id]
    )
    return (
        <div>
            <div className="intro">
            <img src={imagePath} alt="Not Found"></img>
            <p>{comicInfo && comicInfo.data.data.results[0].id}</p>
            <p>{comicInfo && comicInfo.data.data.results[0].title}</p>
            <p>{comicInfo && comicInfo.data.data.results[0].description}</p>
            <div>Series</div>
            <p>{comicInfo && comicInfo.data.data.results[0].series.name}</p>
            <div>Characters</div>
            {comicInfo && comicInfo.data.data.results[0].characters.items.map((item) => {
            return <div key={item.name}>{item.name}</div>;
          })}
            </div>
        </div>
    )
    };
    export default ComicInfo;