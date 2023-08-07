import Questions from "../models/Questions.js"
import mongoose from "mongoose"
import User from '../models/auth.js'

export const AskQuestion=async(req,res)=>{
    const postQuestionData=req.body;
    const postQuestion=new Questions(postQuestionData);
    const b=req.body.userId
    try {
        await postQuestion.save();
        res.status(200).json("Posted a Question sucessfully..")
        await User.findByIdAndUpdate({_id:b},{$push:{noofquestion:"noofquestion"}})
    } catch (error) {
        console.log(error);
        res.status(409).json("Couldn't post a question..")
    }
}

export const getAllQuestions=async(req,res)=>{
    try {
        const questionList=await Questions.find();
        res.status(200).json(questionList);
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}

export const deleteQuestion=async(req,res)=>{
    const {id:_id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('Question is unavailable...');
    }

    try {
        await Questions.findByIdAndRemove(_id);
        res.status(200).json({message:"Sucessfully deleted..."})
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}

export const voteQuestion=async(req,res)=>{
    const{id:_id}=req.params;
    const {value,userId}=req.body;
    
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('Question is unavailable...');
    }
    try {
        const question=await Questions.findById(_id)
        const upIndex=question.upVote.findIndex((id)=>id === String(userId))
        const downIndex=question.downVote.findIndex((id)=>id === String(userId))

        if(value==='upVote'){
            if(downIndex!== -1){
                question.downVote=question.downVote.filter((id)=>id !== String(userId))
            }
            if(upIndex=== -1){
                question.upVote.push(userId)
            }
            else{
                question.upVote=question.upVote.filter((id)=>id !== String(userId))
            }
        }
        else if(value ==='downVote'){
            if(upIndex!== -1){
                question.upVote=question.upVote.filter((id)=>id !== String(userId))
            }
            if(downIndex === -1){
                question.downVote.push(userId)
            }
            else{
                question.dpwnVote=question.downVote.filter((id)=>id !== String(userId))
            }
        }
        await Questions.findByIdAndUpdate(_id,question)
        res.status(200).json({message:"votes sucessfully..."})
    } catch (error) {
        res.status(404).json({message:"id not found"})
    }
    
}