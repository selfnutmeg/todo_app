const {Router} = require('express');
const router = Router();
const Todo = require('./../models/Todo');

router.get('/', async (req, res) => {
    try {
        const {userId} = req.query;
        const todos = await Todo.find({owner: userId});
        
        res.json(todos);

    } catch (err) {
        console.log('Find Todos error:', err)
    }
});

router.post('/add', async (req, res) => {
    try {
        const {text, userId} = req.body;
        const todo = await new Todo({
            text,
            owner: userId,
            completed: false,
            important: false
        });

        await todo.save();

        res.json(todo);

    } catch (err) {
        console.log('Add error:', err);
    }
});

router.put('/complete/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        todo.completed = !todo.completed;
        await todo.save();
        
        res.json(todo);

    } catch (err) {
        console.log('Completed Todo error:', err)
    }
});

router.put('/important/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        todo.important = !todo.important;
        await todo.save();
        
        res.json(todo);

    } catch (err) {
        console.log('Important Todo error:', err)
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        
        res.json(todo);

    } catch (err) {
        console.log('Delete Todo error:', err)
    }
});

module.exports = router;
