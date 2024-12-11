import {useDeferredValue, useState} from "react";

const list = ["apple", "banana", "cherry", "date"];
export default function UseDeferredValue() {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query); // 延迟更新

    const filteredList = list.filter((item) => item.includes(deferredQuery));
    return <div className="w-1/4 p-2 bg-amber-100">
        <input
            type="text"
            onChange={(e) => setQuery(e.target.value)} // 用户输入立即更新
            value={query}
        />
        <ul>
            {filteredList.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    </div>
}