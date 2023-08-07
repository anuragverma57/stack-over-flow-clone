import {instance} from './../index.js'
import crypto from 'crypto'
import User from '../models/auth.js'

export const checkOut = async(req,res)=>{
    const options ={
        amount:Number(req.body.amount*100),
        currency:"INR",
    };
    const amount=req.body.amount
    const email=req.body.email 
    if(amount === 100){
        await User.findOneAndUpdate({email:email},{$push:{silver:"silver"}})
    }
    if(amount === 1000){
        await User.findOneAndUpdate({email:email},{$push:{gold:"gold"}})
    }
    console.log(amount)
    const order = await instance.orders.create(options)
    res.status(200).json({sucess:true,order})
};

export const paymentVerify = async(req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature} =req.body

    const body=razorpay_order_id +"|"+ razorpay_payment_id

    const signature=crypto.createHmac('sha256',process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

    const isAuthpay= signature === razorpay_signature;
    if(isAuthpay){
        res.redirect("https://stackoverflow-clone-by-httprising.netlify.app")
    }
    else{
        res.status(200).json({sucess:false})
    }
};