const axios = require('axios');
let exportedMethods = {
    async getAllTVShows(){
        const url = "http://api.tvmaze.com/shows";
        const result = await axios.get(url);
        return result;
    },
    async getTVShowById(id){
        const url = "http://api.tvmaze.com/shows/"+id;
        const result = await axios.get(url);
        return result;
    },
    async searchTVShow(qstr){
        const url = "http://api.tvmaze.com/search/shows?q="+qstr;
        const result = await axios.get(url);
        return result.data;
    },
    async addSearchTermToSortedList(){
        
    }

};
module.exports = exportedMethods;