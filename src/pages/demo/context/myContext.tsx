import {createContext,useContext} from 'react';


const myContext = createContext<any>(null);

const ChildChild=()=>{
    const childUseContext=useContext(myContext);
    return <div>我是子子组件，我的名字是{childUseContext.userName}</div>
}
const Child =()=>{
    const childUseContext=useContext(myContext);
    return <div>
        我是子组件，我的名字是{childUseContext.userName}
        <ChildChild/>
    </div>
}
 const Component=()=>{
    return <myContext.Provider value={{userName:'罗方国'}}><div>div我是父组件</div>
    <Child/></myContext.Provider>
}
export default Component;