import { Router } from 'express'; // import Router from express
import Todo from '../models/Todo.js'; // import Todo model
import  isLoggedIn  from './middleware.js'; // import isLoggedIn custom middleware

const router = Router();

//custom middleware could also be set at the router level like so
// router.use(isLoggedIn) then all routes in this router would be protected

// Index Route with isLoggedIn middleware
router.get("/", isLoggedIn, async (req, res) => {
  const { username } = req.user; // get username from req.user property created by isLoggedIn middleware
  //send all todos with that user
  res.json(
    await Todo.find({ username }).catch((error) =>
      res.status(400).json({ error })
    )
  );
});

// Show Route with isLoggedIn middleware
router.get("/:id", isLoggedIn, async (req, res) => {
  const { username } = req.user; // get username from req.user property created by isLoggedIn middleware
  const _id = req.params.id; // get id from params
  //send target todo
  res.json(
    await Todo.findOne({ username, _id }).catch((error) =>
      res.status(400).json({ error })
    )
  );
});

// create Route with isLoggedIn middleware
router.post("/", isLoggedIn, async (req, res) => {
  const { username } = req.user; // get username from req.user property created by isLoggedIn middleware
  req.body.username = username; // add username property to req.body
  //create new todo and send it in response
  res.json(
    await Todo.create(req.body).catch((error) =>
      res.status(400).json({ error })
    )
  );
});

// update Route with isLoggedIn middleware
router.put("/:id", isLoggedIn, async (req, res) => {
  const { username } = req.user; // get username from req.user property created by isLoggedIn middleware
  req.body.username = username; // add username property to req.body
  const _id = req.params.id;
  //update todo with same id if belongs to logged in User
  res.json(
    await Todo.updateOne({ username, _id }, req.body, { new: true }).catch(
      (error) => res.status(400).json({ error })
    )
  );
});

// update Route with isLoggedIn middleware
router.delete("/:id", isLoggedIn, async (req, res) => {
  const { username } = req.user; // get username from req.user property created by isLoggedIn middleware
  const _id = req.params.id;
  //remove todo with same id if belongs to logged in User
  res.json(
    await Todo.remove({ username, _id }).catch((error) =>
      res.status(400).json({ error })
    )
  );
});

const TodoRouter = router;
export default TodoRouter;