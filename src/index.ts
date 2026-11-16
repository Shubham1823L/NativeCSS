import 'dotenv/config'
import postcss from "postcss";
import plugins from './plugins'
import fs from 'fs'
import * as childProcess from "child_process";


const run = async (input: string) => {
    const result = await postcss(plugins).process(input, { from: undefined })
    const cssFile = result.css
    await fs.promises.mkdir('output', { recursive: true })
    await fs.promises.writeFile('output/styles.css', cssFile)
    
    if (process.env.DEBUG_MODE === 'true') return
    const proc = childProcess.spawn('pbcopy')
    proc.stdin.write(cssFile.toString())
    proc.stdin.end()
    console.log("Copied output CSS to clipboard")
}

try {
    console.log("Starting pipeline")
    const cssFile = await fs.promises.readFile('input/styles.css')
    await run(cssFile.toString())
    console.log("Finished")
} catch (error) {
    console.log("Error trying to run the program")
    console.error(error)
    if (process.env.NODE_ENV !== 'developement') process.exit(1)
}
