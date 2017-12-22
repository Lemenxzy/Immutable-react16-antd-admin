/**
 * Created by 70469 on 2017/12/22.
 */

import fectMock from 'fetch-mock'

export default {
    start(){
      fectMock.get('/login', {hello: 'world'})
  }
};

