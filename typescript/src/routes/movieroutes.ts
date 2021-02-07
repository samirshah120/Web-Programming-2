import {Request, Response} from 'express';
import { ObjectId } from 'mongodb';
const movieData = require('../data/movie');
export class Movies {
public routes(app) : void {      
app.route('/api/movies').post(async (req: Request, res: Response) => {
  let movieInfo = req.body;
	if (Object.keys(movieInfo).length === 0) {
		res.status(400).json({ error: 'You must provide data to create a movie' });
		return;
	}
	if (!movieInfo.title || typeof movieInfo.title != 'string') {
		res.status(400).json({ error: 'You must provide a movie title' });
		return;
	}
	if (!movieInfo.cast || typeof movieInfo.cast != 'object') {
		res.status(400).json({ error: 'You must provide a movie cast name' });
		return;
	}
	for(let i=0;i<movieInfo.cast.length;i++){
		if(!movieInfo.cast[i].firstName || typeof(movieInfo.cast[i].firstName) != 'string'){
			res.status(400).json({ error: 'You must provide a movie cast first name' });
			return;
		}
		if(!movieInfo.cast[i].lastName || typeof(movieInfo.cast[i].lastName) != 'string'){
			res.status(400).json({ error: 'You must provide a movie cast Last name' });
			return;
		}
	}
	if (!movieInfo.info || typeof movieInfo.info != 'object') {
		res.status(400).json({ error: 'You must provide movie info' });
		return;
	}
	if (!movieInfo.info.director || typeof movieInfo.info.director != 'string') {
		res.status(400).json({ error: 'You must provide movie info director' });
		return;
	}
	if (!movieInfo.info.yearReleased || typeof movieInfo.info.yearReleased != 'number') {
		res.status(400).json({ error: 'You must provide movie info year released' });
		return;
	}
	if (!movieInfo.plot || typeof movieInfo.plot != 'string') {
		res.status(400).json({ error: 'You must provide a movie plot' });
		return;
	}
	if (!movieInfo.rating || typeof movieInfo.rating != 'number') {
		res.status(400).json({ error: 'You must provide rating' });
		return;
	}
	try {
		const newMovie = await movieData.addMovies(movieInfo.title,movieInfo.cast,movieInfo.info,movieInfo.plot,movieInfo.rating);
		res.json(newMovie);
	} catch (e) {
		res.sendStatus(400);
	}
});
app.route('/api/movies/:id').get(async (req: Request, res: Response) => {
	try {
		let movie = await movieData.getMovieById(req.params.id);
		if(movie === null || movie === undefined)
			res.status(404).json({ error: 'movie not found' })
		else
			res.json(movie);
	} catch (e) {
		res.status(404).json({ error: 'movie not found' });
	}
        
});
app.route('/api/movies').get(async (req: Request, res: Response) => {
	let n = req.query.skip;
	let y = req.query.take;
	try {
		//let moviesList = await movieData.getAllMovies();
		let moviesList = await movieData.getAllMovies(n,y);
		if(moviesList === false)
			res.status(404).json({ error: 'Please enter proper parameters, Only numbers greater than 0 allowed' })
		else
			res.json(moviesList);
	} catch (e) {
		res.sendStatus(400).json({error : e});
	}
        
});

app.route('/api/movies/:id').put(async (req: Request, res: Response) => {
	let movieInfo = req.body;
	if (Object.keys(movieInfo).length === 0) {
		res.status(400).json({ error: 'You must provide data to edit a movie' });
		return;
	}
	if (!movieInfo.title || typeof movieInfo.title != 'string') {
		res.status(400).json({ error: 'You must provide a movie title' });
		return;
	}
	if (movieInfo.cast.length === 0 || typeof movieInfo.cast != 'object') {
		res.status(400).json({ error: 'You must provide a movie cast' });
		return;
	}
	for(let i = 0;i<movieInfo.cast.length;i++){
		if(!movieInfo.cast[i].firstName || typeof(movieInfo.cast[i].firstName) != 'string'){
			res.status(400).json({ error: 'You must provide a movie cast first name' });
			return;
		}
		if(!movieInfo.cast[i].lastName || typeof(movieInfo.cast[i].lastName) != 'string'){
			res.status(400).json({ error: 'You must provide a movie cast Last name' });
			return;
		}
	}
	if (!movieInfo.info || typeof movieInfo.info != 'object') {
		res.status(400).json({ error: 'You must provide movie info' });
		return;
	}
	if (!movieInfo.info.director || typeof movieInfo.info.director != 'string') {
		res.status(400).json({ error: 'You must provide movie info director' });
		return;
	}
	if (!movieInfo.info.yearReleased || typeof movieInfo.info.yearReleased != 'number') {
		res.status(400).json({ error: 'You must provide movie info year released' });
		return;
	}
	if (!movieInfo.plot || typeof movieInfo.plot != 'string') {
		res.status(400).json({ error: 'You must provide a movie plot' });
		return;
	}
	if (!movieInfo.rating || typeof movieInfo.rating != 'number') {
		res.status(400).json({ error: 'You must provide rating' });
		return;
	}
	try {
		await movieData.getMovieById(req.params.id);
	} catch (e) {
		res.status(404).json({ error: 'Movie not found' });
		return;
	}
	try {
		const updatedMovie = await movieData.updateMovie(req.params.id, movieInfo);
		res.json(updatedMovie);
	} catch (e) {
		res.status(404).json({ error: 'Movie not found' })
	}
});

app.route('/api/movies/:id').patch(async (req: Request, res: Response) => {
	const requestBody = req.body;

	let updatedObject : any = req.body
	try {
		if (Object.keys(requestBody).length === 0) {
			res.status(400).json({ error: 'You must provide data to edit a movie' });
			return;
		}
		const oldMovie = await movieData.getMovieById(req.params.id);
		if(requestBody.title && typeof requestBody.title != 'string'){
			res.status(400).json({ error: 'You must provide a movie title' });
			return;
		}
		if(requestBody.cast && typeof requestBody.cast != 'object'){
			for(let i=0;i<requestBody.cast.length;i++){
				if(requestBody.cast[i].firstName && typeof(requestBody.cast[i].firstName) != 'string'){
					res.status(400).json({ error: 'You must provide a movie cast first name' });
					return;
				}
				if(requestBody.cast[i].lastName && typeof(requestBody.cast[i].lastName) != 'string'){
					res.status(400).json({ error: 'You must provide a movie cast Last name' });
					return;
				}
			}
			res.status(400).json({ error: 'You must provide a movie cast name' });
			return;
		}
		if(requestBody.plot && typeof requestBody.plot != 'string'){
			res.status(400).json({ error: 'You must provide a movie plot' });
			return;
		}
		if(requestBody.info && typeof requestBody.info != 'object'){
			if(requestBody.info.director && typeof requestBody.info.director != 'string'){
				res.status(400).json({ error: 'You must provide movie info' });
				return;
			}
			if(requestBody.info.yearReleased && typeof requestBody.info.yearReleased != 'number'){
				res.status(400).json({ error: 'You must provide movie info' });
				return;
			}
			res.status(400).json({ error: 'You must provide movie info' });
			return;
		}
		if(requestBody.rating && typeof requestBody.rating != 'number'){
			res.status(400).json({ error: 'You must provide rating' });
		    return;
		}
		if (requestBody.title && requestBody.title !== oldMovie.title) updatedObject.title = requestBody.title;
		if (requestBody.cast && requestBody.cast !== oldMovie.cast) updatedObject.cast = requestBody.cast;
		if (requestBody.plot && requestBody.plot !== oldMovie.plot) updatedObject.plot = requestBody.plot;
		if (requestBody.info && requestBody.info !== oldMovie.info) updatedObject.info = requestBody.info;
		if (requestBody.rating && requestBody.rating !== oldMovie.rating) updatedObject.rating = requestBody.rating;
	} catch (e) {
		res.status(404).json({ error: 'Not found' });
		return;
	}
	try {
		const updatedMovie = await movieData.updateMoviePatch(req.params.id, updatedObject);
		res.json(updatedMovie);
	} catch (e) {
		res.status(400).json({ error: e });
	}
});



app.route('/api/movies/:movieId/:commentId').delete(async (req: Request, res: Response) => {
	if (!req.params.movieId) {
		res.status(400).json({ error: 'You must Supply a movie ID to delete' });
		return;
	}
	if (!req.params.commentId) {
		res.status(400).json({ error: 'You must Supply a comment ID to delete' });
		return;
	}
	try {
		await movieData.getMovieById(req.params.movieId);
	} catch (e) {
		res.status(404).json({ error: 'Movie not found' });
		return;
	}
	try {
		const result = await movieData.getCommentById(req.params.movieId,req.params.commentId);
		if(result === false){
			res.status(404).json({ error: 'Comment not found' });
		}
	} catch (e) {
		res.status(404).json({ error: 'Comment not found' });
		return;
	}
	try {
		const deletedComment = await movieData.removeComment(req.params.movieId,req.params.commentId);
		res.json(deletedComment);
	} catch (e) {
		res.status(400).json({ error: e });
	}
});

app.route('/api/movies/:id/comments').post(async (req: Request, res: Response) => {
	let commentInfo = req.body;
	if (Object.keys(commentInfo).length === 0) {
		res.status(400).json({ error: 'You must provide data to create a comment' });
		return;
	}
	if (!commentInfo.name || typeof commentInfo.name != 'string') {
		res.status(400).json({ error: 'You must provide a comment name' });
		return;
	}
	if (!commentInfo.comment || typeof commentInfo.comment != 'string') {
		res.status(400).json({ error: 'You must provide a movie comment' });
		return;
	}
	try {
		await movieData.getMovieById(req.params.id);
	} catch (e) {
		res.status(404).json({ error: 'Movie not found' });
		return;
	}
	try {
		const newComment = await movieData.addComment(commentInfo.name,commentInfo.comment,req.params.id);
		res.json(newComment);
	} catch (e) {
		res.sendStatus(400);
	}

});
}
}