import React, {useMemo, useRef, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input";

const ChildComponent:React.FC<any>=({data})=>{
    const childRenderTimers = useRef(0);
    childRenderTimers.current++;
    return <div className="bg-amber-200 p-2 m-2">
        <p>我是子组件</p>
        <div className="text-xs">父组件传入的值：{data}</div>
        <div className="text-xs">子组件渲染次数：{childRenderTimers.current}</div>
    </div>
}
const UseMemoDemo = () => {
    const callNumsRef = useRef(0)
    const [compute, setCompute] = useState(0);
    const [renderCount, setRenderCount] = useState(0);
    const [childState, setChildState] = useState(0);
    const [filter, setFilter] = useState("");
    const [list] = useState(["apple", "banana", "cherry", "date"]);
    const handleCompute = () => {
        setCompute(v => v + 1);
    }
    const handleRender = () => {
        setRenderCount(v => v + 1)
    }
    const handleChangeState = () => {
        setChildState(v => v + 1)
    }

    /**
     * 使用场景 1：避免不必要的重复计算，即缓存计算结果
     * 如果不使用 usMemo 每次组件渲染（handleRender方法)都会执行计算属性的方法(computedFunUseMemo)，通过usMemo可以避免不必要的重复计算
     */
    const computedFunUseMemo = useMemo(() => {
        callNumsRef.current++;
        let r;
        const start = performance.now();
        //做一些耗时的操作
        r = Array(100000).fill(0).reduce((acc, cur) => acc + cur + compute, 0);
        const end = performance.now();
        console.log(`Execution time: ${(end - start).toFixed(3)}ms`);
        return r;
    }, [compute]);

    /**
     * 使用场景 2：优化依赖的子组件渲染，即缓存组件
     * 只有当 childState 改变的时候 依赖的子组件ChildComponent才会从新渲染，父组件的其他 state 改变导致的渲染都不会导致依赖的子组件从新渲染
     */
    const childComponent = useMemo(() => {
        return <ChildComponent data={childState}/>
    }, [childState]);

    /**
     * 使用场景 3：缓存计算的派生状态
     * 只有当filter或者list改变的时候才会从新执行filteredList的逻辑，如果不使用useMemo，每次父组件的其他 state改变都会导致filteredList的逻辑执行
     * */
    const filteredList = useMemo(() => {
        console.log("过滤列表...");
        return list.filter(item => item.includes(filter))
    }, [list, filter]);

    return <div className="w-1/4"><div className="p-2 bg-amber-100">
        <div className="flex">
            <Button className="ml-2" onClick={handleCompute}>计算属性</Button>
            <Button className="ml-2" onClick={handleRender}>父组件渲染{renderCount}</Button>
            <Button className="ml-2" onClick={handleChangeState}>改变传给子组件值</Button>
        </div>
        <div>计算方法执行次数：{callNumsRef.current}</div>
        <div>计算结果:{computedFunUseMemo}</div>
        <div className="m-2">
            <p>缓存计算的派生状态</p>
            <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="输入过滤条件"
            />
            <ul>
                {filteredList.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
        {childComponent}
    </div></div>
}
export default UseMemoDemo;