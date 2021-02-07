import React, { useState, useEffect } from 'react';
import axios from 'axios';
const md5 = require('blueimp-md5');
const publickey = 'f7d903d72421b5f0742f431122324431';
const privatekey = '38b5ba36f287f6f1ca48634b568f0a7038856643';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
const url = '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

const ComicPage = (props) => {
    const [comic, setComic] = useState(undefined);
    const [pageNumber, setPageNumber] = useState(undefined);
    const [paramValue, setParamValue] = useState(undefined);
    const [maxComic, setMaxComic] = useState(undefined);
    useEffect(
        () => {
            console.log("enter useeffect");
            setParamValue(parseInt(props.match.params.page));
            setPageNumber(parseInt(props.match.params.page));
            const offset = pageNumber * 20;
            async function fetchData() {
                try {
                    const { data } = await axios.get(baseUrl+'?limit=20&offset=' + offset +url);
                    console.log(data)
                    setMaxComic(47780);
                    if(pageNumber >= 0 && pageNumber * 20 <maxComic){
                        setComic(data);
                    }

                } catch (e) {
                    console.log('exception')
                    console.log(e);
                }
            }
            fetchData();
        }, [pageNumber, paramValue, props.match.params.page,maxComic]
    );
        return (
            <div>
                {(pageNumber < 0 || pageNumber > maxComic/20) ? (<p>error</p>) : (
                    <div>
                        <div className="col text-center">
                            {comic && pageNumber > 0  ? (<a href={`/comics/page/${paramValue - 1}`}><button className="btn-primary">Previous</button></a>) :(<p></p>) }
                            {comic && (comic.data.offset + comic.data.count <maxComic)? (<a href={`/comics/page/${paramValue + 1}`}><button className="btn-primary">Next</button></a>) : (<p></p>)}
                        </div>
                        <br></br>
                        <br></br>
                        <div className="row">
                        {comic && comic.data.results.map((comic) => {
                            const imagePath = comic.thumbnail.path+'/standard_fantastic';
                            const imageExtension = comic.thumbnail.extension;
                            return (
                                <div key = {comic.id} className="pagecontainer col-sm-12 col-md-4 col-lg-3">
                                    <a className="pagecontent" href={`/comics/${comic.id}`}><img src={imagePath+"."+imageExtension} alt={comic.title}/></a>
                                    <div>
                                    <a className="pagecontent" href={`/comics/${comic.id}`}>{comic.title}</a>
                                    </div>
                                </div>
                            )
                        }
                        )
                        }
                    </div>
                    </div>

                )}
            </div>
        )
    
}

export default ComicPage;