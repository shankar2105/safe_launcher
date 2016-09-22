import should from 'should';
import axios from 'axios';
import * as utils from './utils';

export const checkHealth = async() => {
  const health = await axios(`${utils.CONSTANTS.API_SERVER}/health`);
  should(health.status).equal(200);
};

export const getpacFile = async() => {

};
