const initState = {
    uitraces: [],
    drawtraces: [],
    penstate: {
        color: '#000000',
        alpha: .5,
        point: .5
    }
    
}

const rootReducer = (state = initState, action) => {
    switch (action.type) {


        case 'ADD_UITRACE':
            let newuitraces = [...state.uitraces, action.trace];
            return {
                ...state,
                uitraces: newuitraces
            }

        case 'ADD_DRAWTRACE':
            let newdrawtraces = [...state.drawtraces, {trace: action.trace, penstate: state.penstate}];
            return {
                ...state,
                drawtraces: newdrawtraces
            }
        case 'SET_COLOR':
            console.log("setcolor");
        case 'SET_ALPHA':
            return {

                ...state,
                penstate:{
                    ...state.penstate,
                    alpha: action.alpha
                }
            }
        case 'SET_POINT':
            console.log(state)
            return {
                ...state,
                penstate:{
                    ...state.penstate,
                    point: action.point
                }
            }


    }
    
    return state;
}

export default rootReducer