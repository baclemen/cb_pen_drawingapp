const initState = {
    traces: [],
    penstate: {
        color: '#000000',
        alpha: .5,
        point: .5,
        linedash: false,
    },
    initpenstate: {
        color: '#000000',
        alpha: .5,
        point: .5,
        linedash: false,
    },
    t: 0,
    displaytraces: [],
    uicolor: "white"
}

const rootReducer = (state = initState, action) => {
    switch (action.type) {


        case 'ADD_UITRACE':
            let newtraces = [...state.traces, {type: 'ui', changes: action.changes, trace: action.trace, t: state.t}];
            return {
                ...state,
                traces: newtraces,
                t: (state.t+1)
            }

        case 'ADD_DRAWTRACE':
            let newtraces1 = [...state.traces, {type: 'draw', changes:null, trace: action.trace, t: state.t}];
            return {
                ...state,
                traces: newtraces1,
                t: (state.t+1)
            }

        case 'ADD_IMAGE':
            let newtraces2 = [...state.traces, {type: 'image', imgData: action.imgData, t: state.t}];
            return {
                ...state,
                traces: newtraces2,
                t: (state.t+1)
            }
        case 'DEL_UITRACE':
            let newtraces3 = [...state.traces.filter(el => el.t !== action.t)]
            return {
                ...state,
                traces: newtraces3,
                t: (state.t+1)
            }

        case 'SET_PENSTATE':
            return{
                ...state,
                penstate: {
                    ...state.penstate, 
                    ...action.update,
                }
            }
        case 'CHECK_DOTTED':
            return{
                ...state,
                penstate:{
                    ...state.penstate,
                    linedash: !state.penstate.linedash
                }
            }
        case 'SET_INIT':
            return {
                ...state,
                penstate: state.initpenstate
            }

        case 'ADD_DISPLAYTRACE':
            if(state.displaytraces.find(el => el.t === action.t)){
                return {...state}
            }
            else {
                var newdisplaytraces = [...state.displaytraces, {t: action.t, alpha: action.alpha}]
                return {
                    ...state,
                    displaytraces: newdisplaytraces
                }
            }

        case 'CLR_DISPLAYTRACE':
            return {
                ...state,
                displaytraces: []
            }
        default:
            break;

    }
    
    return state;
}

export default rootReducer