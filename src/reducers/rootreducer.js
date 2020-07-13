const initState = {
    traces: [],
    penstate: {
        color: '#000000',
        alpha: .5,
        point: .5
    },
    initpenstate: {
        color: '#000000',
        alpha: .5,
        point: .5
    },
    t: 0
}

const rootReducer = (state = initState, action) => {
    switch (action.type) {


        case 'ADD_UITRACE':
            let newtraces = [...state.traces, {isUI: true, changes: action.changes, trace: action.trace, t: state.t}];
            return {
                ...state,
                traces: newtraces,
                t: (state.t+1)
            }

        case 'ADD_DRAWTRACE':
            let newtraces1 = [...state.traces, {isUI: false, changes:null, trace: action.trace, t: state.t}];
            return {
                ...state,
                traces: newtraces1,
                t: (state.t+1)
            }
        case 'DEL_UITRACE':
            let newtraces2 = [...state.traces.filter(el => el.t !== action.t)]
            return {
                ...state,
                traces: newtraces2,
                t: (state.t+1)
            }

        case 'SET_COLOR':
            console.log("setcolor");
            break;

        case 'SET_ALPHA':
            return {

                ...state,
                penstate:{
                    ...state.penstate,
                    alpha: action.alpha
                }
            }
        case 'SET_POINT':
            return {
                ...state,
                penstate:{
                    ...state.penstate,
                    point: action.point
                }
            }
        default:
            break;


    }
    
    return state;
}

export default rootReducer