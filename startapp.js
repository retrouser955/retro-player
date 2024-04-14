const { exec, execSync } = require("node:child_process");

(async () => {
    function installSite() {
        return new Promise((resolve, reject) => {
            console.log("Started installing dependencies for the site ... [ CMD: yarn ]")

            const installSite = exec(`cd "./retro-player-site" && yarn`)
    
            installSite.stdout.on("data", (d) => {
                console.log(`[ SITE INSTALLATION LOG ] ${d}`)
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
            console.log("Started installing dependencies for the app ... [ CMD: yarn ]")

            const installExe = exec(`cd "./retro-player-exe" && yarn`)
    
            installExe.stdout.on("data", (d) => {
                console.log(`[ APP INSTALLATION LOG ] ${d}`)
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