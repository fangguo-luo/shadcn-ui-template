import {useTransition, useState} from 'react';
import {Input} from "@/components/ui/input"

const data = Array.from({length: 100000}, (_, i) => `Item ${i}`); // 大数据列表
export default function StartTransition() {
    const [filterKey, setFilter] = useState('')
    const [isPending, startTransition] = useTransition();
    const [filterList, setFilterList] = useState<any>(data);
    const handleInput = (e) => {
        const inputValue = e.target.value;
        setFilter(inputValue);
        startTransition(() => {
            const filtered = data.filter(item => item.includes(inputValue));
            setFilterList(filtered)
        })
    }
    return <div className="w-1/4 bg-amber-100 h-dvh overflow-y-auto">
        <div className="w-full p-2 bg-white sticky top-0">
            <Input type="text" onChange={handleInput} value={filterKey}/>
        </div>
        {isPending && <div className="animate-spin rounded-full h-6 w-6 border-1 border-gray-900"></div>}
        <div className="p-2">
            <ul>
                {filterList.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </div>
    </div>
}