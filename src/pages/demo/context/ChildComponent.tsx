import {useContext} from "react";
import {UserContext} from './index.tsx';
//使用 useContext hooks的方式消费 context
const ChildComponent = () => {
    const user = useContext(UserContext);
    return <div style={{width: '200px', height: '200px', background: '#fff'}}>
        ChildComponent
        <div>name:{user.name}</div>
    </div>
}
export default ChildComponent;