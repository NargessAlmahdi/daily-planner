const express = require('express')
const router = express.Router()

const User = require('../models/user.js')

router.get('/', async (req, res) => {
    try{
        const currentUser = await User.findById(req.session.user._id)
        res.render('tasks/index.ejs', {
            tasks: currentUser.tasks,
        })

    }catch (error){
        console.log(error)
        res.redirect('/')
    }
})

router.get('/new', async (req, res) => {
    res.render('tasks/new.ejs')
})
 
router.post('/', async (req, res) => {
    try{
        const currentUser = await User.findById(req.session.user._id)
        currentUser.tasks.push(req.body)
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/tasks`)
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

router.get('/:taskId', async (req, res) => {
    try{
        const currentUser = await User.findById(req.session.user._id)
        const task = currentUser.tasks.id(req.params.taskId)
        res.render('tasks/show.ejs', {
            task: task,
        })
    } catch (error){
        console.log(error)
        res.redirect('/')
    }
})

router.delete('/:taskId', async (req, res) => {
    try{
        const currentUser = await User.findById(req.session.user._id)
        currentUser.tasks.id(req.params.taskId).deleteOne()
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/tasks`)
    }catch (error){
        console.log(error)
        res.redirect('/')
    }
})

router.get('/:taskId/edit', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      const task = currentUser.tasks.id(req.params.taskId);
      res.render('tasks/edit.ejs', {
        task,
      });
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

  router.put('/:taskId', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      const task = currentUser.tasks.id(req.params.taskId);
      task.set(req.body);
      await currentUser.save();
      res.redirect(
        `/users/${currentUser._id}/tasks/${req.params.taskId}`
      );
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

  module.exports = router;
