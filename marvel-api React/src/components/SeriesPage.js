import React, { useState, useEffect } from 'react';
import axios from 'axios';
const md5 = require('blueimp-md5');
const publickey = 'f7d903d72421b5f0742f431122324431';
const privatekey = '38b5ba36f287f6f1ca48634b568f0a7038856643';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/series';
const url = '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

const SeriesPage = (props) => {
    const [series, setSeries] = useState(undefined);
    const [pageNumber, setPageNumber] = useState(undefined);
    const [paramValue, setParamValue] = useState(undefined);
    const [maxSeries, setMaxSeries] = useState(undefined);
    useEffect(
        () => {
            console.log("enter useeffect");
            setParamValue(parseInt(props.match.params.page));
            setPageNumber(parseInt(props.match.params.page));
            const offset = props.match.params.page * 20
            async function fetchData() {
                try {
                    const { data } = await axios.get(baseUrl+'?limit=20&offset=' + offset +url);
                    console.log(data)
                    //console.log(pageNumber)
                    setMaxSeries(parseInt(11995));
                    if(pageNumber >= 0 && pageNumber * 20 < maxSeries){
                        setSeries(data);
                    }

                } catch (e) {
                    console.log('exception')
                    console.log(e);
                }
            }
            fetchData();
        }, [pageNumber, paramValue, props.match.params.page,maxSeries]
    );
        return (
            <div>
                {(pageNumber < 0 || pageNumber > maxSeries/20) ? (<p>error</p>) : (
                    <div>
                         <div className="col text-center">
                            {series && pageNumber > 0  ? (<a href={`/series/page/${paramValue - 1}`}><button className="btn-primary">Previous</button></a>) :(<p></p>) }
                            {series && (series.data.offset+series.data.count < maxSeries)? (<a href={`/series/page/${paramValue + 1}`}><button className="btn-primary">Next</button></a>) : (<p></p>)}
                        </div>
                        <div className="row">
                        {series && series.data.results.map((series) => {
                            const imagePath = series.thumbnail.path+'/standard_fantastic';
                            const imageExtension = series.thumbnail.extension;
                            return (
                                <div key = {series.id} className="pagecontainer col-sm-12 col-md-4 col-lg-3">
                                <a className="pagecontent" href={`/series/${series.id}`}><img src={imagePath+"."+imageExtension} alt="Not Found"/></a>
                                <div>
                                <a className="pagecontent" href={`/series/${series.id}`} aria-label="Series">{series.title}</a>
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

export default SeriesPage;