import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { Comment, Tooltip, List, Icon, Avatar } from 'antd';
import moment from 'moment';

import { cookie }  from '../cookie/cookie';
import Header from '../header/Header';
import './style/originArticle.css';

class OriginArticle extends Component {
  constructor(props) {
    super(props);
  }
  state = {
      article:{
				userNickname: "",           // 文章作者的名字
				userProfilePhoto: "",       // 作者头像
				articleTitle: "",		       //  文章标题
				articleContent: "",		     //  文章内容
				articleReplyCount: 0,        //   文章评论数目
				articleViewCount: 0,       //    文章浏览数
				articleLikeCount: 0,         //   点赞数
        latestUpdateTime: "",      //    最近更新时间
			}
  }
  componentWillReceiveProps(nextProps){
    this.setState({ article: nextProps.article });
  }

  changeActionsRequest( url, commentId ){
     if ( cookie.get('loginState')  == "1" ){
        axios.post( url,
        {
       		commentId: parseInt(commentId),
       		userId: cookie.get('userId'),
   	    })
         .then( res => {
            if( res.status === 200){
              console.log( " likeComment:", res.data);
                if( res.data.code == 0){
                  this.props.getArticleDetail();
                }
                else{
                  alert("操作失败，请重试");
                }
            }
         })
         .catch( err =>{
             alert("操作失败，请检查网络，稍后再试");
             console.log("changeActionsErr:", err);
         });
       }
    else alert("您尚未登录，请登录后再操作！");
  }

  onClickAction( type ){
    const LikeURL = "http://127.0.0.1:8080/likeArticle";
    const UnLikeURL = "http://127.0.0.1:8080/dislikeArticle";
     if(type == "heart") {
        if( this.props.likeThis == 0 ){
          this.changeActionsRequest(LikeURL, this.props.articleId); }
        else{
          this.changeActionsRequest(UnLikeURL,this.props.articleId); }
      }

  }

  itemRender( current, type, originalElement ){
      if (type === 'prev') {
        return <a>Previous</a>;
      } if (type === 'next') {
        return <a>Next</a>;
      }
      return originalElement;
  }

  HTMLDecode(text) {
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
  }

  render(){
    const IconText = ({ type, text, theme="outlined" }) =>(
        <span>
          <Icon type={type} style={{ marginRight: 8 }}  theme={ theme }
                onClick={ this.onClickAction.bind(this, type) } />
          {text}
        </span>
        )
    var finishedData = [ this.state.article ] ;
    return(
      <div className="commentDetail">
      <List
             itemLayout="vertical"
             size="large"
             loading={  this.props.loadingState  }
             dataSource={ finishedData }
             renderItem={item => (
               <List.Item
                 key={item.articleTitle}
                 actions={[
                           <IconText type="like" text={ item.articleLikeCount }
                              theme={ this.props.likeThis? 'filled' : 'outlined'} />,
                           <IconText type="message" text={ item.articleReplyCount }
                              theme={ this.props.replyThis? 'filled' : 'outlined'} />,
                           <IconText type="eye" text={ item.articleViewCount }
                              theme={ 'outlined'} />
                         ]}
                >
                    <List.Item.Meta
                      avatar={<Avatar src={item.userProfilePhoto} />}
                      title={<div className="title"><h3 className="userName">{ item.userNickname }</h3><h1 dangerouslySetInnerHTML={ {__html: (item.articleTitle)} }></h1></div>}
                    />
                     {<h2 dangerouslySetInnerHTML={ {__html: this.HTMLDecode(item.articleContent)} }></h2>}
                     <div className="home-content-itemTime">{item.latestUpdateTime}</div>
                 </List.Item>
              )}
         />
       </div>
    );
  }
}
function mapStateToProps( state ){
   return {
     loginState: state.login,
    };
}
export default connect( mapStateToProps, null)(OriginArticle);
