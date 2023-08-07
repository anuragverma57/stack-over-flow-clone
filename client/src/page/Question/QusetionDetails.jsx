import React, { useState } from "react";
import copy from 'copy-to-clipboard'
import { useParams,Link ,useNavigate,useLocation} from "react-router-dom";
import moment from 'moment'
import { useDispatch, useSelector } from "react-redux";
import './Questions.css'
import upVote from "../../assets/sort-up.svg";
import downVote from "../../assets/sort-down.svg";
import Avatar from "../../component/Avatar/Avatar";
import DisplayAnswer from "./DisplayAnswer";
import { postAnswer ,deleteQuestion ,voteQuestion} from "../../action/question";

const QuestionDeatils = () => {
  // var questionsList = [
  //   {
  //     _id: '1',
  //     upVotes: 2,
  //     downVotes: 2,
  //     noOfAnswers: 2,
  //     questionTitle: "What is a function?",
  //     questionBody: "It meant to be",
  //     questionTags: ["java", "node js", "react js", "mongo db", "express js"],
  //     userPosted: "mano",
  //     userId: 1,
  //     askedOn: "jan 1",
  //     answer: [
  //       {
  //         answerBody: "Answer",
  //         userAnswered: "kumar",
  //         answeredOn: "jan 2",
  //         userId: 2,
  //       },
  //     ],
  //   },
  //   {
  //     _id: '2',
  //     upVotes: 7,
  //     downVotes: 2,
  //     noOfAnswers: 0,
  //     questionTitle: "What is a function?",
  //     questionBody: "It meant to be",
  //     questionTags: ["javascript", "R", "python"],
  //     userPosted: "mano",
  //     askedOn: "jan 1",
  //     userId: 1,
  //     answer: [
  //       {
  //         answerBody: "Answer",
  //         userAnswered: "kumar",
  //         answeredOn: "jan 2",
  //         userId: 2,
  //       },
  //     ],
  //   },
  //   {
  //     _id: '3',
  //     upVotes: 3,
  //     downVotes: 2,
  //     noOfAnswers: 0,
  //     questionTitle: "What is a function?",
  //     questionBody: "It meant to be",
  //     questionTags: ["javascript", "R", "python"],
  //     userPosted: "mano",
  //     askedOn: "jan 1",
  //     userId: 1,
  //     answer: [
  //       {
  //         answerBody: "Answer",
  //         userAnswered: "kumar",
  //         answeredOn: "jan 2",
  //         userId: 2,
  //       },
  //     ],
  //   },
  // ];
  const  id  = useParams();
  const questionsList=useSelector(state=>state.questionsReducer)
  const [Answer,setAnswer]=useState('')
  const User=useSelector((state)=>(state.currentUserReducer))
  const Navigate=useNavigate()
  const dispatch=useDispatch()
  const location=useLocation()
  const url='https://server666.onrender.com'

  const handlePostAns = (e, answerLength) => {
    e.preventDefault();
    if (User === null) {
      alert("Login or Signup to answer a question");
      Navigate("/Auth");
    } else {
      if (Answer === "") {
        alert("Enter an answer before submitting");
      } else {
        dispatch(
          postAnswer({
            id:id._id,
            noOfAnswers: answerLength + 1,
            answerBody: Answer,
            userAnswered: User.result.name,
            userId:User.result._id
          })
        );
      }
    }
  };

  const handleShare=()=>{
    copy(url+location.pathname)
    alert("Copied url : " + url + location.pathname);
  }

  const handleDelete=()=>{
    dispatch(deleteQuestion(id._id,Navigate))
  }

  const handleUpVote=()=>{
    dispatch(voteQuestion(id._id,'upVote',User.result._id))
  }

  const handleDownVote=()=>{
    dispatch(voteQuestion(id._id,'downVote',User.result._id))
  }

  return (
    <div className="question-details-page" style={{paddingTop:"50px"}}>
      {questionsList.data === null ? (
        <h1>Loading...</h1>
      ) : (<>
          {questionsList.data?.filter((question) => question._id === id._id).map((question) => (
            <div key={question._id}>
                    <section className="question-details-container">
                  <h1>{question.questionTitle}</h1>
                  <div className="question-details-container-2">
                    <div className="question-votes">
                      <img
                        src={upVote}
                        alt=""
                        width="18"
                        className="votes-icon" onClick={handleUpVote}
                      />
                      <p>{question.upVote.length - question.downVote.length}</p>
                      <img
                        src={downVote}
                        alt=""
                        width="18"
                        className="votes-icon" onClick={handleDownVote}
                      />
                    </div> 
                    <div style={{width:"100%"}}>
                      <p className="question-body">{question.questionBody}</p>
                      <div className="question-details-tags">
                        {
                          question.questionTags.map((tag)=>(
                            <p key={tag}>{tag}</p>
                          ))
                        }
                      </div>
                      <div className="question-actions-user">
                        <div>
                          <button type='button' onClick={handleShare}>Share</button>
                          {
                            User?.result?._id === question?.userId &&(
                            
                              <button type='button' onClick={handleDelete}>Delete</button>
                            )
                          }
                        </div>
                        <div>
                          <p>Asked a {moment(question.askedOn).fromNow()}</p>
                          <Link to={`/Users/${question.userId}`} className='user-link' style={{color:'#086d8'}}>
                            <Avatar backgroundColor='orange' px="8px" py="5px" borderRadius="4px">{question.userPosted.charAt(0).toUpperCase()}</Avatar>
                            <div>
                              {question.userPosted}
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section> 
                {question.noOfAnswers !==0 &&(
                  <section>
                    <h3>{question.noOfAnswers} Answer</h3>
                    <DisplayAnswer key={question._id} question={question} handleShare={handleShare}/>
                  </section>
                )}
                <section className="post-ans-container">
                  <h3>Your Answer</h3>
                  <form onSubmit={(e)=>{handlePostAns(e,question.answer.length)}}>
                  <textarea name="" id=""  cols="30" rows="10" onChange={(e)=>setAnswer(e.target.value)}></textarea>
                  <input type="submit" className="post-ans-btn" value='Post Your Answer'/>
                  </form>
                  <p>
                  Browse other Question tagged 
                  {question.questionTags.map((tag)=>(
                    <Link to="/tags" key={tag} className='ans-tags'>
                      {" "}{tag}{" "}
                    </Link>
                  ))}{" "} or <Link to="/askquestion" style={{ textDecoration: "none", color: "#009dff" }}>{" "} ask your own question.</Link>
                  </p>
                </section>
                  </div> 
            ))}
      </> )
    } 
    </div>
  );
};

export default QuestionDeatils;