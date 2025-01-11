const express = require('express')
const router = express.Router()

const User = require('../models/user.js')

router.get('/', async (req, res) => {
    try{
        const currentUser = await User.findById(req.sessionStore.user._id)
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
