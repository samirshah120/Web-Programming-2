import { ObjectId } from "mongodb";
import { MongoHelper } from "../mongo.helper";
const movies = () => {
    return MongoHelper.client.db('Shah-Samir-CS554-Lab1').collection('movies');
}
const addMovies = async (title : string,cast : Array<Object>,info : Object,plot : string,rating:number) : Promise<Object> => {
    const movieCollection : any = await movies();
    let newMovie : Object = {
        _id: new ObjectId(),
        title : title,
        cast : cast,
        info : info,
        plot : plot,
        rating : rating,
        comments: [],  
    };

    const newInsertInformation : any = await movieCollection.insertOne(newMovie);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    return await getMovieById(newInsertInformation.insertedId);
}
const getMovieById = async (id: ObjectId) : Promise<Object> => {
    id = new ObjectId(id)
    const movieCollection :any  = await movies();
    const movie : Object = await movieCollection.findOne({_id: id});
    if (!movie) throw 'movie not found';
    return movie;
}
const getAllMovies = async (n:any,y:any):Promise<Object> => {
//const getAllMovies = async ():Promise<Object> => {
    const movieCollection: any = await movies();
    const allMoviesList = await movieCollection.find({}).toArray();
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
    const moviesList = await movieCollection.find().skip(skip).limit(lim).toArray();
    if (!moviesList) throw 'No movies in system!';
    return moviesList
}
const updateMovie = async (id: ObjectId, movieInfo): Promise<Object> => {
  id = new ObjectId(id);
    let movieUpdateInfo = { //title,cast,plot,rating
      title: movieInfo.title,
      cast: movieInfo.cast,
      plot : movieInfo.plot,
      rating : movieInfo.rating
    };
  
    const moviesCollection = await movies();
    const updateInfo = await moviesCollection.updateOne({_id: id}, {$set: movieUpdateInfo});
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
  
    return await getMovieById(id);
}

const updateMoviePatch = async (id: ObjectId, movieInfo):Promise<Object> =>  {
  id = new ObjectId(id)
    const moviesCollection = await movies();
    const updatedMovieData = {
    title: String,
		cast : Object,
		plot : String,
		info: Object,
		rating: Number

    };
  
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
    const updateInfo = await moviesCollection.updateOne({_id: id}, {$set: updatedMovieData});
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
    return await getMovieById(id);
}
const removeComment = async(movieId:ObjectId,commentId:ObjectId): Promise<Object>=>{
    movieId = new ObjectId(movieId)
    commentId = new ObjectId(commentId)
    const  moviesCollection = await movies();
    const updateInfo = await moviesCollection.updateOne({_id: movieId}, {$pull: {comments:{_id:commentId}}});
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Delete failed';
    return await getMovieById(movieId);
}
const addComment =  async(name:string, comment:string, movieId:ObjectId): Promise<Object> =>{
    const moviesCollection = await movies();

    const comment1 = {
      _id: new ObjectId(),
        name: name,
        comment: comment
    };

    movieId = new ObjectId(movieId);

    const updatedInfo = await moviesCollection.updateOne({ _id: movieId }, { $addToSet: { comments: comment1 } });
    if (updatedInfo.modifiedCount === 0) {
        throw 'Could not add comment.';
    }
    return await getMovieById(movieId);
}
const getCommentById =  async (movieId:ObjectId,commentId:ObjectId) : Promise<Object> =>{
    movieId = new ObjectId(movieId)
    commentId = new ObjectId(commentId)
    const  moviesCollection = await movies();
    const movie = await moviesCollection.findOne({_id: movieId});
    for (let index = 0; index < movie.comments.length; index++) {
        if(movie.comments[index]._id.equals(commentId)){
          return true
        }
    }
    return false;
  }

module.exports = {
   addMovies,
   getMovieById,
   getAllMovies,
   updateMovie,
   updateMoviePatch,
   removeComment,
   addComment,
   getCommentById
}