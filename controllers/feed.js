const {validationResult} = require('express-validator')

const Post = require('../models/post')

exports.getPosts = async(req, res, next)=>{
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        error.message = 'unable to fetch posts';
        return next(error);
    }
}

exports.createPost = async(req, res, next)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        return next(error);
    }
    //Destructuring
    const { title, content, username } = req.body;
    const post = new Post({
        title,
        content,
        username
    })
    try {
        const savedPost = await post.save();
        res.status(201).json({message: 'post saved', post: savedPost});
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        error.message = 'post not created';
        return next(error);
    }
}