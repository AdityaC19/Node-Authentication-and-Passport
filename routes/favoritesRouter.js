const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorites = require('../models/favorites');

const favRouter = express.Router();

favRouter.use(bodyParser.json());

favRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user', 'dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((fav) => {
        if (fav) {
            for (var n=0; n<req.body.length; n++) {
                if (favorite.dishes.indexOf(req.body[n]._id) === -1) {
                    favorite.dishes.push(req.body[n]._id);
                }
            }
            fav.save()
            .then((fav) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err) => next(err)); 
        }
        else {
            Favorites.create({"user": req.user._id, "dishes": req.body})
            .then((fav) => {
                console.log('Favorite Added ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({"user": req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));   
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/'+ req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((fav) => {
        if (fav) {            
            if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                favorite.dishes.push(req.params.dishId)
                favorite.save()
                .then((fav) => {
                    console.log('Favorite Added ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                }, (err) => next(err))
            }
        }
        else {
            Favorites.create({"user": req.user._id, "dishes": [req.params.dishId]})
            .then((fav) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((fav) => {
        if (fav) {            
            index = favorite.dishes.indexOf(req.params.dishId);
            if (index >= 0) {
                favorite.dishes.splice(index, 1);
                favorite.save()
                .then((fav) => {
                    console.log('Favorite Deleted ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('Favorites not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = favoriteRouter;