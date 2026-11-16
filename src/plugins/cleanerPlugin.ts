import { PluginCreator } from "postcss";
import { PluginNameOptions } from "./types";
import { debugLogger } from "@/utils/debugLogger";

const plugin: PluginCreator<PluginNameOptions> = () => {
    return {
        postcssPlugin: 'cleanerPlugin',
        Once(root) {
            debugLogger("Starting cleanerPlugin")

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
            debugLogger("Exiting cleanerPlugin")
        }
    }
}

plugin.postcss = true

export default plugin