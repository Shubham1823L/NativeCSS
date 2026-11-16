import { Declaration, type PluginCreator } from "postcss";
import { PluginNameOptions } from "./types";
import { debugLogger } from "@/utils/debugLogger";


const plugin: PluginCreator<PluginNameOptions> = () => {
    return {
        postcssPlugin: 'flexPlugin',
        Once() {
            debugLogger("Starting felxPlugin")
        },
        Rule(rule) {
            if (!rule.selector.startsWith('.')) {
                rule.replaceWith(`
                    /* ${rule} */  
                   `)
                return debugLogger("Not a class, commenting: " + rule.selector)
            }

            // Get display and flexDirection values
            const flexbox = { display: '', 'flex-direction': '' }
            rule.walkDecls(decl => {
                if (decl.prop == 'flex-shrink' && decl.value == '0') {
                    decl.remove()
                    return
                }
                const property = decl.prop as keyof typeof flexbox
                if (flexbox[property] !== undefined) flexbox[property] = decl.value
            })

            if (flexbox.display != 'flex') return

            rule.walkDecls(decl => {
                // Remove flexDirection Column
                const property = decl.prop as keyof typeof flexbox
                if (flexbox[property] !== undefined) {

                    if (flexbox['flex-direction'] == 'column') {
                        decl.remove()
                        return
                    }
                    // Dont remove flexDirection
                    if (property != 'display') return

                    // display: flex - only case
                    if (!flexbox['flex-direction']) {
                        decl.replaceWith(new Declaration({ prop: 'flex-direction', value: 'row' }))
                        return
                    }

                    decl.remove()
                    return
                }

            })
        },
        OnceExit() {
            debugLogger("Exiting felxPlugin")
        },
    }
}

plugin.postcss = true

export default plugin