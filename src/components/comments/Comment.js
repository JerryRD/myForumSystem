import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { cookie }  from '../cookie/cookie';
import Header from '../header/Header';
import HeaderForLogin from '../header/HeaderForLogin';
import OriginArticle from './OriginArticle';
import CommentDetail  from './CommentDetail';
import TextEditor from '../TextEditor/Draft';
import './style/comment.css';

class Comment extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    article: {},
    comments: [],
  }

  GetArticleDetailURL = `http://127.0.0.1:8080/articleDetail/${this.props.match.params.id}`;
  componentWillMount(){
    this.getArticleDetail( this.GetArticleDetailURL, this.props.match.params.id, cookie.get('userId') );
  }
  getArticleDetail( url, articleId, userId ){
     return axios.post( url, {
               articleId: parseInt(articleId) ,
               userId: userId,
            })
            .then( res => {
             if(res.status == 200 )
               this.setState( {
                 article: res.data.article,
                 comments: res.data.comment,
                } );
             } )
            .catch( function(error){
              alert('获取详情数据失败');
              console.log(error);
           });
  }

  whichHeader(){
    if(cookie.get('loginState') == "1")
      return ( <HeaderForLogin menu={["100"]} /> );
    else return ( <Header menu={["100"]}/> )
  }

  render(){
    console.log("article", this.state.article);
    return(
      <div className="comment">
         { this.whichHeader() }
         <div className="comment-content">
             <OriginArticle
                 article={ this.state.article }
                 getArticleDetail={ this.getArticleDetail.bind(this, this.GetArticleDetailURL, this.props.match.params.id, cookie.get('userId')) }
                 articleId={ this.props.match.params.id }
                 likeThis={ this.props.match.params.likeOrNot }
                 replyThis={ this.props.match.params.replyOrNot }
             />
             <CommentDetail
                 comments={ this.state.comments }
                 getArticleDetail={ this.getArticleDetail.bind(this, this.GetArticleDetailURL, this.props.match.params.id, cookie.get('userId')) }
                 articleId={ this.props.match.params.id }
             />

         </div>
      </div>
    );
  }
}

function mapStateToProps( state ){
   return {
     loginState: state.login,
    };
}

export default connect( mapStateToProps, null)(Comment);
