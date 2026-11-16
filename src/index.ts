import postcss from "postcss";
import plugins from './plugins'
import fs from 'fs'
import path from "path";
import { fileURLToPath } from "url";


const run = async (input: string) => {
    const result = await postcss(plugins).process(input, { from: './styles.css' })
    const cssFile = result.css
    await fs.promises.mkdir('output', { recursive: true })
    await fs.promises.writeFile('output/styles.css', cssFile)
}

try {
    const cssFile = await fs.promises.readFile(path.resolve(path.dirname(fileURLToPath(import.meta.url)), './styles.css'))
    run(cssFile.toString())
} catch (error) {
    console.log("Error trying to run the program")
    console.error(error)
}
