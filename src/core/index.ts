import {DefaultOptons, Options, reportTrackerData, TrackerConfig} from "../types/index"
import {createHistoryEvent} from "../utils/pv";

const MouseEventList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover']

export default class Tracker{
    public data:Options
    constructor(options:Options) {
        this.data = Object.assign(this.initDef(),options)
        this.installTracker()
    }
    private initDef():DefaultOptons{
        window.history['pushState'] = createHistoryEvent('pushState')
        window.history['replaceState'] = createHistoryEvent('replaceState')
        return <DefaultOptons>{
            sdkVersion:TrackerConfig.version,
            hashTracker:false,
            historyTracker:false,
            domTracker:false,
            jsError:false
        }
    }

    private setUserId <T extends DefaultOptons['uuid']>(uuid:T){
        this.data.uuid = uuid
    }
    private setExtra <T extends DefaultOptons['extra']>(extra:T){
        this.data.extra = extra
    }

    private captureEvents <T>(mouseEventList:string[],targetKey:string,data?:T){
        mouseEventList.forEach(event=>{
            window.addEventListener(event,()=>{
                console.log('监听到了')
                this.reportTracker({event, targetKey, data})
            })
        })
    }


    private installTracker (){
        if (this.data.historyTracker){
            this.captureEvents(['pushState','replaceState','popstate'],'history-pv')
        }
        if (this.data.hashTracker){
            this.captureEvents(['hashchange'],'hash-pv')
        }
        if (this.data.domTracker) {
            this.targetKeyReport()
        }
        if (this.data.jsError) {
            this.jsError()
        }

    }

    public sendTracker<T>(data:reportTrackerData){
        this.reportTracker(data)
    }

    private reportTracker <T>(data:T){
        const params = Object.assign(this.data,data, { time: new Date().getTime()})
        let headers = {
            type:'application/x-www-form-urlencoded'
        }
        const blob = new Blob([JSON.stringify(params)],headers)

        navigator.sendBeacon(this.data.requestUrl, blob)
    }
    //dom 点击上报
    private targetKeyReport() {
        MouseEventList.forEach(event => {
            window.addEventListener(event, (e) => {
                const target = e.target as HTMLElement
                const targetValue = target.getAttribute('target-key')
                if (targetValue) {
                    this.sendTracker({
                        targetKey: targetValue,
                        event
                    })
                }
            })
        })
    }

    private jsError() {
        this.errorEvent()
        this.promiseReject()
    }

    //捕获js报错
    private errorEvent() {
        window.addEventListener('error', (e) => {
            this.sendTracker({
                targetKey: 'message',
                event: 'error',
                message: e.message
            })
        })
    }

    //捕获promise 错误
    private promiseReject() {
        window.addEventListener('unhandledrejection', (event) => {
            event.promise.catch(error => {
                this.sendTracker({
                    targetKey: "reject",
                    event: "promise",
                    message: error
                })
            })
        })
    }


}