import {UserContext} from './index.tsx';
import ChildComponent from './ChildComponent';
//使用 Consumer的方式消费 context
const MiddleComponent = () => {
    return <div style={{width: '300px', height: '300px', background: 'red'}}>
        <ChildComponent/>
        MiddleComponent
        <UserContext.Consumer>
            {
                (value) => {
                    return <>
                        <div>age:{value.age}</div>
                    </>
                }
            }
        </UserContext.Consumer>

    </div>
}
export default MiddleComponent;