export function HandlerBuilder(path: string, functionName = "handler") {
    return (name: string) => {
        // todo: use some path class to make this prod-worthy lmao
        return path + "/" + name + "." + functionName;
    }
}

