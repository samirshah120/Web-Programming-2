const mongoCollections = require('../config/mongoCollections');
const { json } = require('express');
const movies = mongoCollections.movies;
const { ObjectId } = require("mongodb").ObjectID;
let exportedMethods = {
  async getAllMovies(n,y) {
    const moviesCollection = await movies();
    const allMoviesList = await moviesCollection.find({}).toArray();
    if(typeof n != 'undefined'){
      if(isNaN(parseInt(n))){
        return false;
      }
    }
    if(typeof y != 'undefined'){
      if(isNaN(parseInt(y))){
        return false;
      }
    }
    if(n < 0){
      return false
    }
    if(y < 0){
      return false
    } 
    n = parseInt(n);
    y = parseInt(y);
    let skip = 0;
    if(n > 0){
      skip = n;
    }
    let lim = 20;
    if(y > 100){
      lim = 100;
    }
    if(y >=1 && y <= 100){
      lim = y;
    }
    if(y === 0){
      const list = [];
      return list;
    }
    const moviesList = await moviesCollection.find().skip(skip).limit(lim).toArray();
    if (!moviesList) throw 'No movies in system!';
    return moviesList
  },
  async getMovieById(id) {
    id = ObjectId(id)
    const  moviesCollection = await movies();
    const movie = await moviesCollection.findOne({_id: id});
    return movie
  },
  // This is a fun new syntax that was brought forth in ES6, where we can define
  // methods on an object with this shorthand!
  async addMovies(title,cast,info,plot,rating) {
    const moviesCollection = await movies();

    let newMovie = {
      title : title,
      cast : cast,
      info : info,
      plot : plot,
      rating : rating,
      comments: [],  
      //_id: uuid(),
     
    };

    const newInsertInformation = await moviesCollection.insertOne(newMovie);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    return await this.getMovieById(newInsertInformation.insertedId);
  },
  async addComment(name, comment, movieId) {
    const moviesCollection = await movies();

    const comment1 = {
        _id: ObjectId(),
        name: name,
        comment: comment
    };

    movieId = ObjectId(movieId);

    const updatedInfo = await moviesCollection.updateOne({ _id: movieId }, { $addToSet: { comments: comment1 } });
    if (updatedInfo.modifiedCount === 0) {
        throw 'Could not add comment.';
    }
    return await this.getMovieById(movieId);
},

async updateMovie(id, movieInfo) {
  id = ObjectId(id)
  let movieUpdateInfo = { //title,cast,plot,rating
    title: movieInfo.title,
    cast: movieInfo.cast,
    plot : movieInfo.plot,
    rating : movieInfo.rating
  };

  const moviesCollection = await movies();
  const updateInfo = await moviesCollection.updateOne({_id: id}, {$set: movieUpdateInfo});
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

  return await this.getMovieById(id);
},
async updateMoviePatch(id, movieInfo) {
  const moviesCollection = await movies();
  const updatedMovieData = {};

  if (movieInfo.title) {
    updatedMovieData.title = movieInfo.title;
  }
  if (movieInfo.cast) {
    updatedMovieData.cast = movieInfo.cast;
  }
  if (movieInfo.info) {
    updatedMovieData.info = movieInfo.info;
  }
  if (movieInfo.plot) {
    updatedMovieData.plot = movieInfo.plot;
  }
  if (movieInfo.rating) {
    updatedMovieData.rating = movieInfo.rating;
  }
  id = ObjectId(id)
  const updateInfo = await moviesCollection.updateOne({_id: id}, {$set: updatedMovieData});
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
  return await this.getMovieById(id);
},

async getCommentById(movieId,commentId) {
  movieId = ObjectId(movieId)
  commentId = ObjectId(commentId)
  const  moviesCollection = await movies();
  const movie = await moviesCollection.findOne({_id: movieId});
  for (let index = 0; index < movie.comments.length; index++) {
      if(movie.comments[index]._id.equals(commentId)){
        return true
      }
  }
  return false;
},
async removeComment(movieId,commentId) {
  movieId = ObjectId(movieId)
  commentId = ObjectId(commentId)
  const  moviesCollection = await movies();
  const updateInfo = await moviesCollection.updateOne({_id: movieId}, {$pull: {comments:{_id:commentId}}},false,true);
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Delete failed';
  return await this.getMovieById(movieId);
}
};
module.exports = exportedMethods;