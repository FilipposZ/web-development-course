const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();

let day = getDateAndFormat();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://admin-filipposz:jBO5pyf69650SZva@cluster0-igwul.mongodb.net/todolistDB', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const todoItemSchema = new mongoose.Schema({ name: String })
const TodoItem = mongoose.model('TodoItem', todoItemSchema);

const listSchema = new mongoose.Schema({ name: String, items: [todoItemSchema] })
const List = mongoose.model('List', listSchema);

const defaultItems = [
  {
    name: 'Welcome to your new list!'
  },
  {
    name: 'Hit the + to add a new item.'
  },
  {
    name: '<--- Hit this to remove an item.'
  }
];

const defaultList = 'today';

app.get('/', (req, res) => {
  res.redirect(`/${defaultList}`);
});

app.route('/:listName')
  .get((req, res) => {
    const listName = _.lowerCase(req.params.listName);
    List.findOne({ name: listName }, (err, listFound) => {
      if (!err) {
        if (!listFound) {
          let listFound = new List({ name: listName, items: defaultItems });
          listFound.save();
          res.redirect(`/${listName}`);
        } else {
          res.render('list', { listName: _.capitalize(listName), listItems: listFound.items })
        }
      }
    });
  })
  .post((req, res) => {
    const listName = _.lowerCase(req.params.listName);
    const newItem = req.body.newItem;
    const todoItem = new TodoItem({ name: newItem });

    List.findOne({ name: listName }, (err, listFound) => {
      if (!err) {
        listFound.items.push(todoItem);
        listFound.save();
        res.redirect(`/${listName}`);
      }
    });
  });



app.post('/:listName/delete', (req, res) => {
  const listName = _.lowerCase(req.params.listName);
  const itemID = req.body.itemID
  List.findOneAndUpdate(
    { name: listName },
    { $pull: {items: { _id: itemID }}},
    (err, results) => {
      if (!err) res.redirect(`/${listName}`);
    }
  );
});




app.listen(3000, () => {
  console.log('Server is listening on port 3000..')
});


function getDateAndFormat() {
  let today = new Date();
  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };

  return today.toLocaleDateString('en-US', options);
}
