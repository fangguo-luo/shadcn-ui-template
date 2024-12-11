import {useRef, useState} from "react";
import {flushSync} from 'react-dom';
import {Button} from "@/components/ui/button.tsx";

export default function AutomaticBatching() {
    const [count, setCount] = useState(0);
    const [flag, setFlag] = useState(false);
    const renderTimesRef = useRef(0)
    //我们只在 React 事件处理函数内部实现批量更新，而 promise、setTimeout、本地事件处理函数或者其他事件中更新状态，在 React 中默认是不进行批量处理的
    function handleClick() {
        // 使用flushSync停用批量更新
        flushSync(()=>{
            setCount(c => c + 1); // 使用flushSync后会立即渲染
        })
        setFlag(f => !f); // 不会渲染
        // react 17 和 react 18 都只会在只会在结束的时候重新渲染一次（这就是批量处理！）
    }
    function handleAsyncClick(){
        //react 18 中 promise、setTimeout等的更新会进行批量处理
        setTimeout(()=>{
            setCount(c => c + 1); //react 17 渲染
            setFlag(f => !f); // react 17 渲染
            // 异步更新（react 17 非批量处理 react 18 批量处理）
        });
    }

    renderTimesRef.current++;
    return (
        <div className="w-1/4 p-2 bg-amber-100">
            <Button onClick={handleClick}>同步事件</Button>
            <h1 style={{color: flag ? "blue" : "black"}}>{count}</h1>
            <Button onClick={handleAsyncClick}>异步事件</Button>
            <div>组件渲染次数:{renderTimesRef.current}</div>
        </div>
    );
}