import { PluginCreator } from "postcss";
import { PluginNameOptions } from "./types";

const plugin: PluginCreator<PluginNameOptions> = () => {
    return {
        postcssPlugin: 'cleanerPlugin',
        Once(root) {
            console.log("Starting cleanerPlugin")

            root.walkAtRules(atRule => {
                atRule.replaceWith(`/* ${atRule} */`)
            })

            root.walkRules(rule => {
                rule.walkRules(rule => {
                    rule.replaceWith(`\n\n    /* ${rule} */`)
                })
            })
        },
        OnceExit() {
            console.log("Exiting cleanerPlugin")
        }
    }
}

plugin.postcss = true

export default plugin