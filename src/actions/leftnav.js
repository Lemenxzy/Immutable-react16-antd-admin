
import Immutable from 'immutable'


const CHANGEDATA = "CHANGEDATA";


export const change = (data)=> {
    return {
            type: CHANGEDATA,
            data: data
        }
};


const initialState = Immutable.Map({
    data : '/home'
});

export const chageResult =  (state = initialState, action) => {
    switch (action.type) {
        case CHANGEDATA:
            return Immutable.Map({
                data: action.data
            });
        default:
            return state;
    }
};



