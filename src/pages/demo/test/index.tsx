import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
  ref,
  useRef,
} from "react";
const msTranfromTime=(times:number)=>{
 const TIME_UNITS=[{
    unit:'天',
    value:86400000
  },{
    unit:'时',
    value:3600000
  },
  {
    unit:'分',
    value:60000
  }
,{
  unit:'秒',
  value:1000
},{
  unit:'豪秒',
  value:1
}]
let time=times;
let result= TIME_UNITS.map(({unit,value})=>{
    const count=Math.floor(time/value);
    time%=value;
    return {
      unit,
      count
    }
  })
  return result.map(({unit,count},index)=>{
    if(count===0&&index!==TIME_UNITS.length-1){
      return '-' + unit;
    }else{
      return count+unit
    }
  }).join('');
}
const useCountDown = (props) => {
  const { targetDate } = props;
  let t = useRef<any>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const startTimer = useCallback(() => {
    if (t.current) {
      clearInterval(t.current);
    }
    t.current = setInterval(() => {
      const diff = new Date(targetDate).getTime() - new Date().getTime();
      if (diff <= 0) {
        setRemainingTime(0);
        clearInterval(t.current);
      } else {
        setRemainingTime(diff);
      }
    }, 1000);
  }, [targetDate]);
  useEffect(() => {
    startTimer();
  }, []);
  //console.log(remainingTime)
  return {remainingTime:msTranfromTime(remainingTime)};
};

const UserContext = createContext<any>(null);
const ChildComponent = () => {
  const user = useContext(UserContext);
  return (
    <div>
      name:{user?.name},年龄：{user?.age}
    </div>
  );
};
const Test = () => {
  const{remainingTime}=useCountDown({targetDate:'2024-11-16T19:30:30'});
  
  return (<div>剩余：{remainingTime}</div>
    // <UserContext.Provider value={{ name: "罗方国", age: "37" }}>
    //   <ChildComponent />
    // </UserContext.Provider>
  );
};
export default Test;
