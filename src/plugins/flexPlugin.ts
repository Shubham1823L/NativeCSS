import { Declaration, type PluginCreator } from "postcss";

type PluginNameOptions = Record<string, unknown>

const plugin: PluginCreator<PluginNameOptions> = () => {
    return {
        postcssPlugin: 'flexPlugin',
        Once() {
            console.log("Starting felxPlugin")
        },
        Rule(rule) {
            if (!rule.selector.startsWith('.')) return console.log("Not a class")

            // Get display and flexDirection values
            const flexbox = { display: '', 'flex-direction': '' }
            rule.walkDecls(decl => {
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
            console.log("Exiting felxPlugin")
        },
    }
}

plugin.postcss = true

export default plugin