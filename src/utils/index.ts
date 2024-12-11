/**
* 节流，在一定的时间间隔内只执行最后一次
 * 适用于：滚动，窗口调整，提交按钮点击等
* */
export function throttle<T extends (...args: any[]) => void>(func: T, t: number): (...args: Parameters<T>) => void {
    let lastCall = 0;
    return function (...args: Parameters<T>) {
        const nowTime = new Date().getTime();
        if (nowTime - lastCall >= t) {
            func.apply(this, args);
            lastCall = nowTime
        }
    }
}
/**
 * 防抖，只有在事件停止一定时间后，才会执行回调
 * 适用于：搜索等
 */
export function debounce<T extends (...args: any[]) => void>(func: T, t: number): (...args: Parameters<T>) => void {
    let timeout: number | undefined;
    return function (...args) {
        const context = this;
        if(!timeout){
            clearTimeout(timeout);
        }
        timeout = window.setTimeout(() => {
            func.apply(context, args)
        }, t);
    }
}