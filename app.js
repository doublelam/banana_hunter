const express = require('express');
const bodyParser = require('body-parser');
const mongoosePaginate = require('mongoose-paginate-v2');
const app = express();
const port = 3000;
const isDev = process.env.NODE_ENV === "development";
const mongoose = require('mongoose');
const monoUrl = isDev ? 'mongodb://localhost/xxSite' : 'mongodb+srv://urutorahentai:1422015@xxsite.pc96p.mongodb.net/xxsite?retryWrites=true&w=majority';
mongoose.connect('mongodb://localhost/xxSite', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (e) => console.error('connection error:', e));
db.once('open', function () {
  // we're connected!
  console.log('mongodb connected')
});
const ArticlesSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: Array,
});
ArticlesSchema.plugin(mongoosePaginate);
const Articles = mongoose.model('Articles', ArticlesSchema);


const CommentsSchema = new mongoose.Schema({
  author: String,
  content: String,
  forId: String,
});
const Comments = mongoose.model('Comments', CommentsSchema);

app.set('view engine', 'pug');
app.use(express.static('static'));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.redirect('/overview');
})
app.get('/manage_articles', (req, res) => {
  res.render('manage.pug');
})
app.get('/overview', async (req, res) => {
  const page = req.query.page || 1;
  const articles = await Articles.paginate({}, {
    page: page,
    limit: 20,
  });
  console.log('articles', articles)
  res.render('overview.pug', { articles });
})
app.get('/detail', async (req, res) => {
  const id = req.query.id;
  const doc = await Articles.findById(id);
  res.render('detail.pug', { detail: doc });
})

app.post('/post-article', (req, res) => {
  console.log('Got body:', req.body);
  const articleDoc = new Articles(req.body);
  articleDoc.save();
  res.sendStatus(200);
});

app.post('/post-comment', (req, res) => {
  const { content, forId, author } = req.body;
  console.log('____body', req.body)
  const commentDoc = new Comments({
    content, forId, author,
  });
  commentDoc.save();
  res.sendStatus(200);
  res.send({ content, forId, author });
});

app.get('/get-comments', async (req, res) => {
  const { forId } = req.query;
  const comments = await Comments.find({ forId })
  res.send({
    comments,
  })
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
