const initState = {
    traces: [],
    penstate: {
        color: '#000000',
        alpha: .5,
        point: .5,
        linedash: false,
        saturation: 1,
        end: 0,
        fill: 0,
        shadow: 0,
    },
    initpenstate: {
        color: '#000000',
        alpha: .5,
        point: .5,
        linedash: false,
        saturation: 1,
        end: 0,
        fill: 0,
        shadow:0
    },
    t: 0,
    deltaT: 0,
    displaytraces: [],
    uicolor: "white"
}

function clearTraces(traces, t) {
    var i = 0;

    for(; i < traces.length; i++){
        if (traces[i].t <= t){

        }
        else{
            break
        }
    }
    return traces.slice(0,i)

}

const rootReducer = (state = initState, action) => {
    var newtraces
    var traces
    switch (action.type) {

        case 'ADD_UITRACE':
            var newT
            if(state.deltaT === 0){
                traces = state.traces;
                newT = state.t + 1
            } 
            else{
                traces = clearTraces(state.traces, state.t + state.deltaT)
                newT = Math.min(state.t, Math.max(state.t + state.deltaT, 0)) + 1;
            }
            newtraces = [...traces, {type: 'ui', changes: action.changes, trace: action.trace, t: newT}];
            return {
                ...state,
                traces: newtraces,
                t: newT,
                deltaT: 0
            }

        case 'ADD_DRAWTRACE':
            var newT
            if(state.deltaT === 0){
                traces = state.traces;
                newT = state.t + 1
            } 
            else{
                traces = clearTraces(state.traces, state.t + state.deltaT)
                newT = Math.min(state.t, Math.max(state.t + state.deltaT, 0)) + 1;
            }
            newtraces = [...traces, {type: 'draw', changes:null, trace: action.trace, t: newT}];
            return {
                ...state,
                traces: newtraces,
                t: newT,
                deltaT: 0
            }

        case 'ADD_IMAGE':
            var newT
            if(state.deltaT === 0){
                traces = state.traces;
                newT = state.t + 1
            } 
            else{
                traces = clearTraces(state.traces, state.t + state.deltaT)
                newT = Math.min(state.t, Math.max(state.t + state.deltaT, 0)) + 1;
            }
            newtraces = [...traces, {type: 'image', imgData: action.imgData, t: newT, height: action.height, width: action.width}];
            return {
                ...state,
                traces: newtraces,
                t: newT,
                deltaT: 0
            }
        case 'ADD_IMAGETRACE':
            var newT
            if(state.deltaT === 0){
                traces = state.traces;
                newT = state.t + 1
            } 
            else{
                traces = clearTraces(state.traces, state.t + state.deltaT)
                newT = Math.min(state.t, Math.max(state.t + state.deltaT, 0)) + 1;
            }
            newtraces = [...traces, {type: 'imgtrace', transform: action.transform, trace: action.trace, t: newT}]
            return {
                ...state,
                traces: newtraces,
                t: newT,
                deltaT: 0
            }
        case 'DEL_UITRACE':
            newtraces = [...state.traces.filter(el => el.t !== action.t)]
            return {
                ...state,
                traces: newtraces,
                t: (state.t+1),
                tMax: (state.t+1)
            }

        case 'SET_PENSTATE':
            return{
                ...state,
                penstate: {
                    ...state.penstate, 
                    ...action.update,
                }
            }
        case 'CHECK':
            return{
                ...state,
                penstate:{
                    ...state.penstate,
                    [action.id]: !state.penstate[action.id]
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

        case 'DELTA_T':
            return{
                ...state,
                deltaT : action.deltaT
            }
        default:
            break;

    }
    
    return state;
}

export default rootReducer