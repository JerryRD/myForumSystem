import React,{ Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Comment, Icon, Tooltip, Avatar, List, Tag } from 'antd';

import moment from 'moment';
import 'antd/dist/antd.css';

import { cookie }  from '../cookie/cookie';
import Header from '../header/Header';
import HeaderForLogin from '../header/HeaderForLogin';
import HomeDetail from './HomeDetail';
import './style/home.css';

const GetArticleURL = "http://127.0.0.1:8080";

class Home extends Component {
  constructor(props){
    super(props);
  }

  state = {
    postCard: [],
  }

  componentWillMount(){
    this.getArticle( GetArticleURL );
  }

  getArticle( url ){
     return axios.post( url, {
               sortType: 0,
               themeType: 0,
               userId: cookie.get('userId'),
            })
            .then( res => {
             if(res.status == 200 )
               this.setState( { postCard: res.data.postCard,}
                );
             } )
            .catch( function(error){
              alert('获取数据失败');
              console.log(error);
           });
  }

  whichHeader(){
    if(cookie.get('loginState') == "1" )
      return ( <HeaderForLogin menu={["1"]} /> );
    else return ( <Header menu={["1"]}/> )
  }

render(){
  console.log("HomeCookie:", document.cookie);
  // console.log("cookie.get('userId')" );
    return(
      <div className="home">
        { this.whichHeader() }
        <div className="home-content">
          <HomeDetail
              history={ this.props.history }
              getArticle={ this.getArticle.bind(this, GetArticleURL) }
              articles={ this.state.postCard }
           />
        </div>
        <div className="home-footer">
        </div>
      </div>
      );
  }
}

function mapStateToProps( state ){
   return { loginState: state.login };
}

export default connect( mapStateToProps, null)(Home);
