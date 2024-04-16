const { exec, execSync } = require("node:child_process");

(async () => {
    function installDistutils() {
        return new Promise((resolve, reject) => {
            console.log("Executing python -m pip install packaging")

            const pro = exec("python -m pip install packaging")
    
            pro.stdout.on("data", (d) => {
                process.stdout.write(d)
            })
    
            pro.on("exit", (code) => {
                if(code !== 0) {
                    reject("Installed failed")
                }
    
                resolve()
            })
        })
    }

    let packageManager = "yarn"

    try {
        execSync("yarn --version")
    } catch {
        packageManager = "npm install"
    }

    try {
        const result = execSync("python --version").toString()

        const justVersion = result.replace("Python ", "")

        if(!justVersion.startsWith("3.10")) console.warn("[ WARNING ] This project was built was python 3.10. Higher or lower versions may not work")

        if(justVersion.split(".")[1] > 11) {
            console.warn("[ WARNING ] Setting up distutils ...")

            await installDistutils()
        }
    } catch {
        throw new Error("Python not detected!")
    }

    function installSite() {
        return new Promise((resolve, reject) => {
            console.log(`Started installing dependencies for the site ... [ CMD: ${packageManager} ]`)

            const installSite = exec(`cd "./retro-player-site" && ${packageManager}`)
    
            installSite.stdout.on("data", (d) => {
                process.stdout.write(`${d}`)
            })
    
            installSite.on("exit", (code) => {
                if(code !== 0) {
                    reject("Installed failed")
                }
    
                resolve()
            })
        })
    }

    function installExe() {
        return new Promise((resolve, reject) => {
            console.log(`Started installing dependencies for the app ... [ CMD: ${packageManager} ]`)

            const installExe = exec(`cd "./retro-player-exe" && ${packageManager}`)
    
            installExe.stdout.on("data", (d) => {
                process.stdout.write(`${d}`)
            })
    
            installExe.on("exit", (code) => {
                if(code !== 0) {
                    reject("Installed failed")
                }
    
                resolve()
            })
        })
    }

    await installSite()
    await installExe()

    execSync('start.bat')
})().catch(console.log)