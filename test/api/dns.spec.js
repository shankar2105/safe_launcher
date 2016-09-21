import should from 'should';
import axios from 'axios';
import * as utils from './utils';
import UserData from './user_data';

const userDataObj = new UserData();

const getHeaders = _ => ({
  headers: {
    'content-type': 'application/json',
    Authorization: userDataObj.authToken
  }
});


