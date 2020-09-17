const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//Connect to the database
mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// Create the database models of the list items and the list
const todoItemSchema = new mongoose.Schema({ name: String })
const TodoItem = mongoose.model('TodoItem', todoItemSchema);

const listSchema = new mongoose.Schema({ name: String, items: [todoItemSchema] })
const List = mongoose.model('List', listSchema);

// The default list items and list
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

// The home route redirects to the default list.
app.get('/', (req, res) => {
  res.redirect(`/${defaultList}`);
});

/*
 * This route has the following methods:
 * get -  searches the database for the list 'listName'. If it is not
 *        found, it is created with the default items, saved to the database and
 *        rendered. If the list already exists, it is rendered.
 * post - creates a new list item to the list 'listName'. Then, it renders
 *        the new list.
 */
app.route('/:listName')
  .get((req, res) => {
    // In the database the names of the lists are all lowercase
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


/*
 * This route deletes an item with the specified ID from the list 'listName'.
 * Then it rerenders the list if no error occured.
 */
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
