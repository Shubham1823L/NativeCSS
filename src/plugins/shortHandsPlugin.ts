import { Declaration, PluginCreator } from "postcss";
import { PluginNameOptions } from "./types";
import { debugLogger } from "@/utils/debugLogger";

const SHORTHAND_PROPERTIES = [
    'margin',
    'padding'
] as const


const plugin: PluginCreator<PluginNameOptions> = () => {
    return {
        postcssPlugin: 'shortHandsPlugin',
        Once() {
            debugLogger("Starting ShorthandsPlugin")
        },
        Rule(rule) {
            // Assuming shorthands are declared before specifics
            rule.walkDecls(decl => {
                // Handle border shorthand (ignore semantics and wrong naming)
                if (decl.prop == 'border') {
                    const [width, style, ...colors] = decl.value.split(' ')

                    if (!style) {
                        decl.after(new Declaration({ prop: 'border-width', value: width }))
                        decl.remove()
                        return
                    }
                    if (!colors.length) {
                        decl.after(new Declaration({ prop: 'border-style', value: style }))
                        decl.after(new Declaration({ prop: 'border-width', value: width }))
                        decl.remove()
                        return
                    }

                    const color = colors.join(' ')
                    decl.after(new Declaration({ prop: 'border-color', value: color }))
                    decl.after(new Declaration({ prop: 'border-style', value: style }))
                    decl.after(new Declaration({ prop: 'border-width', value: width }))
                    decl.remove()
                    return
                }

                const property = decl.prop as typeof SHORTHAND_PROPERTIES[number]
                if (!SHORTHAND_PROPERTIES.includes(property)) return

                const [top, right, bottom, left] = decl.value.split(' ')

                if (right === undefined) return // margin: 2rem;

                // For other cases, shorthand must be removed

                if (bottom === undefined) {
                    // margin: 2rem 1rem;
                    decl.after(new Declaration({ prop: property + '-inline', value: right }))
                    decl.after(new Declaration({ prop: property + '-block', value: top }))
                    decl.remove()
                    return
                }
                if (left === undefined) {
                    // margin: 2rem 1rem .5rem;
                    decl.after(new Declaration({ prop: property + '-inline', value: right }))
                    decl.after(new Declaration({ prop: property + '-bottom', value: bottom }))
                    decl.after(new Declaration({ prop: property + '-top', value: top }))
                    decl.remove()
                    return
                }
                // margin: 2rem 1rem .5rem .75rem;
                decl.after(new Declaration({ prop: property + '-left', value: left }))
                decl.after(new Declaration({ prop: property + '-right', value: right }))
                decl.after(new Declaration({ prop: property + '-bottom', value: bottom }))
                decl.after(new Declaration({ prop: property + '-top', value: top }))
                decl.remove()
                return
            })
        },
        OnceExit() {
            debugLogger("Exiting ShorthandsPlugin")
        }
    }

}

plugin.postcss = true

export default plugin