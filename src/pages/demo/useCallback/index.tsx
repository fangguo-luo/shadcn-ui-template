import React, {memo, useRef, useCallback, useState} from "react";
import {Button} from "@/components/ui/button.tsx";

const ChildComponent: React.FC<any> = memo(({onBtn}) => {
    const renderTimesRef = useRef(1);
    const [count, setCount] = useState(0)
    renderTimesRef.current += 1;
    const handleRenderChild = () => {
        setCount(v => v + 1);
    }
    return <div className="bg-amber-200 p-2 m-2">
        <p>我是子组件</p>
        <Button onClick={onBtn}>点击按钮从新渲染父组件</Button>
        <Button className="ml-2" onClick={handleRenderChild}>点击按钮渲染子组件{count}</Button>
        <div className="text-xs">子组件渲染次数：{renderTimesRef.current}</div>
    </div>;
});
const UseCallbackDemo = () => {
    const [renderTimes, setRenderTimes] = useState(0);
    //如果不使用useCallback每次 UseCallbackDemo 组件从新渲染的时候，会导致handleBtn函数从新创建，从而导致子组件（即使子组件使用了 memo 也不会生效，从新创建的函数和之前的函数是不相等的)产生不必要的从新渲染，因为函数并没有变
    const handleBtn = useCallback(() => {
        setRenderTimes(v => v + 1);
    }, [])
    const handleRedoRender = () => {
        setRenderTimes(value => value + 1);
    }
    return <div className="w-1/4 p-2 bg-amber-100">
        <div className="flex">
            <Button onClick={handleRedoRender}>重新渲染父组件</Button>
        </div>
        <div>父组件渲染次数:{renderTimes}</div>
        <ChildComponent onBtn={handleBtn}/>
    </div>
}
export default UseCallbackDemo;