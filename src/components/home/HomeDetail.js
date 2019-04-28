import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { Comment, Icon, Tooltip, Avatar, List, Tag } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';

import { cookie }  from '../cookie/cookie';
import Header from '../header/Header';
import './style/home.css';
const GetCommentURL = "http://127.0.0.1:8080";
class HomeDetail extends Component {
  constructor(props){
    super(props);
  }

  state = { finishedData: this.props.articles };

  componentWillReceiveProps(nextProps){
      this.setState({ finishedData: nextProps.articles });
  }

  renderData( commentData, listData, loginState ){
    console.log("commentData:", commentData);

    if( commentData.length> 0 )
      {
        commentData.map( comment => listData.push({
          Id: comment.public.id,
          href: `comment/${comment.public.id}`,
          commentId: comment.public.id,
          author: comment.public.author,
          title: comment.public.title,
          avatar: comment.public.avatar,
          content: comment.public.content,
          datetime: comment.public.datetime,
          likeNum: comment.public.likeNum,
          replyNum: comment.public.replyNum,
          readNum: comment.public.readNum,

          likeThis: loginState?comment.myActions.likeThis:0,
          storeThis: loginState?comment.myActions.storeThis:0,
          repliedThis: loginState?comment.myActions.repliedThis:0,
        }) );
    }

     return listData;
  }

  changeActionsRequest( url, articleId ){
     if ( cookie.get('loginState') ){
        axios.post( url,{
              articleId: articleId,
              userId: cookie.get('userId'),
            })
         .then( res => {
            if( res.status === 200){
                if( res.data.code == 0){
                  this.props.getArticle();
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

  onClickAction( id, type ){
     const LikeURL = "http://127.0.0.1:8080/likeArticle";
     const UnLikeURL = "http://127.0.0.1:8080/dislikeArticle";
     var tips  = [];
     tips = this.renderData( this.state.finishedData, [], cookie.get('loginState'));
     if( tips.length > 0 )
     {
       tips.map( item =>{
         if( item.Id == id ){
             if(type == "like") {
                if( item.likeThis == 0 ){
                  this.changeActionsRequest(LikeURL,id); }
                else{
                  this.changeActionsRequest(UnLikeURL,id); }
             }
           }
         })
     }
  }

  HTMLDecode(text){
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
  }

  converToComponent(content) {
     return  (
        <div dangerouslySetInnerHTML={ {__html: this.HTMLDecode(content)} }></div>
        );
  }

  itemRender( current, type, originalElement ){
      if (type === 'prev') {
        return <a>Previous</a>;
      } if (type === 'next') {
        return <a>Next</a>;
      }
      return originalElement;
  }

  render(){
    var finishedData  = [];
    finishedData = this.renderData( this.state.finishedData, [], cookie.get('loginState'));
    const IconText = ({ id, type, text, theme="outlined" }) =>(
        <span>
          <Icon type={type} style={{ marginRight: 8 }}  theme={ theme }
                onClick={ this.onClickAction.bind(this, id, type) } />
          {text}
        </span>
        )
    return(
        <div>
          <List
                 itemLayout="vertical"
                 size="large"
                 loading={  this.props.loadingState  }
                 pagination={{
                   pageSize: 10,
                   showQuickJumper: true,
                   showSizeChanger: false,
                   defaultCurrent: 6,
                   itemRender: this.itemRender(),
                 }}
                 dataSource={ finishedData }
                 renderItem={item => (
                 <List.Item
                   Id={ item.Id }
                   key={item.title}
                   actions={[
                             // <IconText id={ item.Id } type="star" text={ item.storedNum }
                             //    theme={ item.storeThis? 'filled' : 'outlined'} />,
                             <IconText id={ item.Id } type="like" text={ item.likeNum }
                                theme={ item.likeThis? 'filled' : 'outlined'} />,
                             <IconText id={ item.Id } type="message" text={ item.replyNum }
                                theme={ item.repliedThis? 'filled' : 'outlined'} />,
                             <IconText id={ item.Id } type="eye" text={ item.readNum }
                                theme={ 'outlined'} />
                           ]}
                  >
                      <List.Item.Meta
                        Id={ item.Id }
                        // description={item.author}
                        avatar={<Avatar src={item.avatar} />}
                        title={<Link to={ item.href } >  <h3> <h5 className="userName"> {item.author}：</h5>{item.title}</h3></Link>}
                      />
                       { this.converToComponent( item.content) }
                       <div className="home-content-itemTime">{item.datetime}</div>
                   </List.Item>
                  )}
             />
        </div>
      );
  }
}

function mapStateToProps( state ){
   return { loginState: state.login };
}

export default connect( mapStateToProps, null)(HomeDetail);
