import app from './app';
const port = process.env.PORT||3000;
import { MongoHelper } from './mongo.helper';

app.listen(port, async () => {
  console.log('Express server listening on port ' + port);
  try 
  {
    await MongoHelper.connect(`mongodb://localhost:27017/Shah-Samir-CS554-Lab1`);
    console.log('connected to db')
  } catch (err) {
    console.error(`Unable to connect to Mongo!`, err);
  }
});
