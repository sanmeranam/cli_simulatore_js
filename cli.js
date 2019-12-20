process.stdin.resume();
process.stdin.setEncoding("ascii");
var input = "";
var dir = { root: {} };
var currentDir = dir.root;
var arrPathStack = ["root"];

process.stdin.on("data", function (chunk) {
    input += chunk;
});
process.stdin.on("end", function () {
    var commands = input.split(/\n+/);
    var bQuit = false;
    var baseCommand, argumts;
    for (var i = 0; i < commands.length; i++) {
        let [command, ...args] = commands[i].split(/\s+/);
        switch (command) {
            case "pwd":
                pwd();
                break;
            case "cd":
                cd(args, currentDir);
                break;
            case "ls":
                ls(args, currentDir);
                break;
            case "mkdir":
                mkdir(args, currentDir);
                break;
            case "touch":
                touch(args, currentDir);
                break;
            case "quit":
                bQuit = true;
                break;
            default:
                console.log("Unrecognized Command");
        }
        if (bQuit) {
            break;
        }
    }
});

function pwd() {
    console.log("/" + arrPathStack.join("/"));
}

function ls(args, base,basePath) {
    if(basePath && basePath.length>0){
        console.log("/"+basePath.join("/")+"",Object.keys(base).join("\n"));
    }else{
        console.log(Object.keys(base).join("\n"));
    }
    

    if (args.length === 1 && (args[0] === "-r" || args[0] === "-Recursive")) {
        let items = Object.keys(base);
        basePath = basePath||[];
        for (let i = 0; i < items.length; i++) {
            let key = items[i];
            if (typeof (base[key]) === "object" && key !== "..") {
                ls(["-r"], base[key],[...arrPathStack,...basePath,key]);
            }
        }
    }
}

function cd(args, base) {
    if (typeof (base) === "object" && args.length === 1) {
        let path = args[0];

        if (path.indexOf("/") > -1) {
            let arrPath = path.split("/");
            let inPath = arrPath.shift();
            let inSuccesCount=0
            while (currentDir[inPath] && typeof (currentDir[inPath]) === "object") {
                currentDir = currentDir[inPath];
                arrPathStack.push(inPath);
                inPath = arrPath.shift();
                inSuccesCount++;
            }
            if(arrPath.length !== inSuccesCount){
                console.log("Directory not found",1);
            }
        } else if (base[path]) {            
            if (path == "..") {
                if(arrPathStack.length>1){
                    arrPathStack.pop();
                    currentDir = base[path];
                }
            } else {
                arrPathStack.push(path);
            }
        } else {
            console.log("Directory not found",2);
        }
    }else{
        console.log("Invalid Command");
    }
}


function touch(args, base) {
    if (typeof (base) === "object" && args.length === 1) {
       if(args[0].length<=100){
            base[args[0]] = "";
       }else{
           console.log("Invalid File or Folder Name");
       }
    }
}

function mkdir(path, base) {
    if (typeof (base) === "object" && path.length === 1) {
        if (path[0].length <= 100) {
            if (!base[path[0]]) {
                base[path[0]] = {
                    "..": base
                }
            }else{
                console.log("Directory already exists");    
            }
        } else {
            console.log("Invalid File or Folder Name");
        }

    }else{
        console.log("Invalid Command");
    }
}
