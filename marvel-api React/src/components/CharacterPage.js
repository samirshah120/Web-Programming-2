import React, { useState, useEffect } from 'react';
import axios from 'axios';
const md5 = require('blueimp-md5');
const publickey = 'f7d903d72421b5f0742f431122324431';
const privatekey = '38b5ba36f287f6f1ca48634b568f0a7038856643';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
const url = '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
const CharacterPage = (props) => {
    const [characters, setCharacters] = useState(undefined);
    const [pageNumber, setPageNumber] = useState(undefined);
    const [paramValue, setParamValue] = useState(undefined);
    const maxCharacters = 1493;
    useEffect(
        () => {
            setParamValue(parseInt(props.match.params.page));
            setPageNumber(parseInt(props.match.params.page));
            const offset = pageNumber * 20;
            async function fetchData() {
                try {
                    const { data } = await axios.get(baseUrl+'?limit=20&offset=' + offset +url);
                    if(pageNumber >= 0 && pageNumber * 20 < maxCharacters){
                        setCharacters(data);
                    }
                    //console.log("page is " + pageNumber);
                    console.log(data);

                } catch (e) {
                    console.log('exception')
                    console.log(e);
                }
            }

            fetchData();
        }, [pageNumber, paramValue, props.match.params.page]
    );
        return (
            <div>
                {(pageNumber < 0 || pageNumber > maxCharacters/20) ? (<p>error</p>) : (
                    <div>
                        <div className="col text-center">
                            {characters && pageNumber > 0  ? (<a href={`/characters/page/${paramValue - 1}`}><button className="btn-primary">Previous</button></a>) :(<p></p>) }
                            {characters && (characters.data.offset + characters.data.count < maxCharacters)? (<a href={`/characters/page/${paramValue + 1}`}><button className="btn-primary">Next</button></a>) : (<p></p>)}
                        </div>
                        <br></br>
                        <div className="row">
                        {characters && characters.data.results.map((character) => {
                             const imagePath = character.thumbnail.path+'/standard_fantastic';
                             const imageExtension = character.thumbnail.extension;
                            return (
                                <div key = {character.id} className="pagecontainer col-sm-12 col-md-4 col-lg-3">
                                    <a className="pagecontent" href={`/characters/${character.id}`}><img src={imagePath+"."+imageExtension} alt={character.name}/></a>
                                    <div>
                                    <a className="pagecontent" href={`/characters/${character.id}`}>{character.name}</a>
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
export default CharacterPage;