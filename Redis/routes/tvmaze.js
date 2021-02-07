const express = require('express');
const router = express.Router();
const data = require('../data');
const tvmazeData = data.tvmaze;
const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');
const axios = require('axios')
let topSearch = new Map();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
router.get('/', async (req, res) => {
	try { 
        let showList = [];
        const tvShowList = await tvmazeData.getAllTVShows();
        for(let i=0;i<tvShowList.data.length;i++){
            let showNamesList = tvShowList.data[i];
            showList.push(showNamesList);
        }
        const cacheData = await client.getAsync("allpages");
        if(!cacheData){ 
                return res.status(200).render("home", {title:"All TV Shows List",showList},async(err,html)=>{
                    await client.setAsync("allpages",html);
                    res.send(html)
                });
        }
        else{
            // console.log(1)
            res.send(cacheData)
        }
    } catch (e) {
        res.status(404).json({error: e.message});
    }
});
router.get('/show/:id', async (req, res) => {
	try {
        const id = req.params.id;
        const tvshow = await tvmazeData.getTVShowById(req.params.id);
        if(tvshow === null || tvshow === undefined)
			res.status(404).json({ error: 'TV show not found' });
        const tvshowCache = await client.getAsync(id);
        if(!tvshowCache){
            return res.status(200).render("show", {title:"TV Show",tvshow},async(err,html)=>{
                await client.setAsync(id,html);
                res.send(html)
            });
        }
        else{
            //console.log(2);
            res.send(tvshowCache)
        }       
	} catch (e) {
		res.status(404).json({ error: 'TV show not found' });
	}
});
router.post('/search', async (req, res) => { 
    try{
    let searchTerm = req.body.search;
    let searchRes =  await tvmazeData.searchTVShow(searchTerm);
    if(searchRes.length === 0 || searchRes === null || searchRes === undefined){
        return res.status(404).json({error:"No search Results found"});
    }
    else{
        if(!topSearch.has(searchTerm))
            topSearch.set(searchTerm, 1);
        else
            topSearch.set(searchTerm,topSearch.get(searchTerm) + 1); 
    } 
    let searchResultList = [];
    for(let i=0;i<searchRes.length;i++){
        searchResultList.push(searchRes[i].show);
    }
    const searchCache = await client.getAsync(searchTerm);
    if(!searchCache){
        return res.status(200).render("searchResult", {title:"Search Result",searchResultList},async(err,html)=>{
            await client.setAsync(searchTerm,html);
            res.send(html)
        });
    }
    else{
        //console.log(3);
        res.send(searchCache);
    }
    
    }catch(e){
        res.status(404).json({error: e.message});
    }
});
router.get('/popularsearches', async (req, res) => {
	try {
        const mapSort1 = new Map([...topSearch.entries()].sort((a, b) => b[1] - a[1]));
        
        if(mapSort1.size === 0 || mapSort1 === null || mapSort1 === undefined)
            res.status(404).json({ error: 'Please search for tv shows' })
        else{
            let keys = Array.from(mapSort1.keys());
            let test = [];
            // console.log(keys.length);
            const len = keys.length < 10 ? keys.length : 10;
            for(let i=0;i<len;i++){
                test.push(keys[i]);
            }
            return res.status(200).render("popular", {title:"Popular Searches",test});
        }
	} catch (e) {
		res.status(404).json({ error: 'Not found' });
	}
});
module.exports = router