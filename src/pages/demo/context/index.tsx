import {createContext} from 'react';
import MiddleComponent from './MiddleComponent';
export const UserContext = createContext<any>(null);

const ContextDemo = () => {
    return <div style={{width: '500px', height: '500px', background: '#ccc'}}>
        <UserContext.Provider value={{name:'罗方国',age:34}}>
            <MiddleComponent/>
        </UserContext.Provider>
        ContextDemo
    </div>
}
export default ContextDemo;