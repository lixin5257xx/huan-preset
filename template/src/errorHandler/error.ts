interface ErrorMap {
    code:string,
    msg:string,
}

export const ERROR_NETWORK_EXCEPTION = 'Failed to fetch dynamically imported module';

export const ERROR_MAP_LIST:Array<ErrorMap> = [
    {code:ERROR_NETWORK_EXCEPTION,msg:'网络不畅，请刷新重试！'},
]

export default {
    ERROR_NETWORK_EXCEPTION
}