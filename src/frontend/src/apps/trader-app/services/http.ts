import BaseHttp, {HttpGetConfigType, HttpPostConfigType, HttpPutConfigType,
    HttpDeleteConfigType, HttpErrorType, HttpClientType} from '@services/http'
import {RouteConst} from '@conf/const'

const {INFO_LOGIN_ROUTE} = RouteConst;
const LOGIN_ROUTE = `/${INFO_LOGIN_ROUTE}`;

const handleRequest = (httpMethod: Function, config: any): Promise<any> => {
    return httpMethod({
        ...config,
        errorFunc: (err: HttpErrorType) => {
            if(err.response.status === 401 || err.response.status === 403){
                if(Http.unauthorizedRedirectRoute !== undefined){
                    Http.navigate(Http.unauthorizedRedirectRoute);
                } else {
                    Http.navigate(LOGIN_ROUTE);
                }
            } else {
                return config.errorFunc(err);
            }
        },
    })
}

const get = (config: HttpGetConfigType) => {
    return handleRequest(BaseHttp.get, config);
}

const post = (config: HttpPostConfigType) => {
    return handleRequest(BaseHttp.post, config);
}

const put = (config: HttpPutConfigType) => {
    return handleRequest(BaseHttp.put, config);
}

const httpDelete = (config: HttpDeleteConfigType) => {
    return handleRequest(BaseHttp.delete, config);
}


const Http: TraderHttpClient = {
    ...BaseHttp,
    get,
    put,
    post,
    delete: httpDelete,
    navigate: (route: string) => {},
    unauthorizedRedirectRoute: undefined,
    initNavigate: function(navigate: NavigateFunc, unauthorizedRedirectRoute?: string){
        this.navigate = navigate;
        this.unauthorizedRedirectRoute = unauthorizedRedirectRoute;
    }
}

type TraderHttpClient = HttpClientType & {
    navigate: NavigateFunc,
    unauthorizedRedirectRoute?: string,
    initNavigate: {
        (navigate: NavigateFunc, unauthorizedRedirectRoute?: string): void
    }
}

type NavigateFunc = {
    (route: string): void
}

export default Http
export * from '@services/http'