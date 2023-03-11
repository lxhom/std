let enquirer = require('enquirer');
let fs = require('fs');

let main = async () => {
    let name = await new enquirer.Input({
        message: "Package name",
        initial: "my-package"
    }).run()

    let desc = await new enquirer.Input({
        message: "Package description",
        initial: name
    }).run()

    // if directory exists, exit
    if (fs.existsSync(name)) {
        console.log("Directory already exists")
        return
    }

    // copy all files from /template
    fs.cpSync("template", name, { recursive: true })

    // replace package.json
    let pkg = fs.readFileSync(`${name}/package.json`, "utf8")
    pkg = pkg.replace('[name]', name)
    pkg = pkg.replace('[desc]', desc)
    fs.writeFileSync(`${name}/package.json`, pkg)
}

main().then()
