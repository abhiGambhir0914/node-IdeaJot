const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Load helpers
const {ensureAuthenticated} = require('../helper/auth');

//LOAD Idea MODEL
require('../models/Idea');
const Idea = mongoose.model('ideas');

//IDEAS index page
router.get('/', ensureAuthenticated, (req,res)=>{
  Idea.find({user: req.user.id})
    .sort({date:'desc'})
    .then((allideas)=>{
      res.render('ideas/index',{
        allideas:allideas
      });
    });
});

//ADD Idea Form
router.get('/add', ensureAuthenticated, (req,res)=>{
  res.render('ideas/add');
});

//EDIT Idea Form
router.get('/edit/:id', ensureAuthenticated, (req,res)=>{
  Idea.findOne({
    _id:req.params.id
  })
  .then((par_idea)=>{
    if(par_idea.user != req.user.id){
      req.flash('error_msg','Not Authorized');
      res.redirect('/ideas');
    }else{
      res.render('ideas/edit',{
        par_idea:par_idea
      });
    }
  });
});

//PROCESS Form
router.post('/', ensureAuthenticated, (req,res)=>{
  let errors = [];

  if(!req.body.title){
    errors.push({text: 'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text: 'Please add some details'});
  }

  if(errors.length > 0){
    res.render('ideas/add',{
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  }else{
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Idea(newUser)
      .save()
      .then((idea)=>{
        req.flash('success_msg','Idea Added');
        res.redirect('/ideas');
      });
  }
});

//EDIT Form Process
router.put('/:id', ensureAuthenticated, (req,res)=>{
  Idea.findOne({
    _id: req.params.id
  })
  .then((idea)=>{
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then((idea)=>{
        req.flash('success_msg','Idea Updated');
        res.redirect('/ideas');
      });
  });
});

//DELETE Idea
router.delete('/:id', ensureAuthenticated, (req,res)=>{
  Idea.remove({
    _id: req.params.id
  })
  .then(()=>{
    req.flash('success_msg','Idea Removed');
    res.redirect('/ideas');
  });
});

module.exports = router;
