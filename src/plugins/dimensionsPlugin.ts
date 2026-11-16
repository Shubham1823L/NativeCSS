import { PluginCreator } from "postcss";
import { PluginNameOptions } from "./types";
import { cssLengthUnits } from "@/lib/constants";
import { debugLogger } from "@/utils/debugLogger";



const hasNumberRegex = /\d/
const UNITS = [
    ...cssLengthUnits,
    "%"
] as const

const plugin: PluginCreator<PluginNameOptions> = () => {
    return {
        postcssPlugin: 'dimensionsPlugin',
        Once(root) {
            debugLogger("Starting dimensionsPlugin")
            root.walkDecls(decl => {
                // First we normalize all declarations having dimensional Values to numbers / percentages
                const values = decl.value.split(' ')
                const newValues: (string | number)[] = []

                // Traverse through values and check if value has number
                values.forEach(value => {
                    const result = parseNumber(value)
                    newValues.push(result ?? value)
                    newValues.push()
                })

                // Assign new value to declaration
                decl.value = newValues.join(' ')
            })
        },
        OnceExit() {
            debugLogger("Exiting dimensionsPlugin")
        }
    }
}

plugin.postcss = true

export default plugin


const parseNumber = (value: string) => {
    const isNumber = hasNumberRegex.test(value)
    if (!isNumber) return

    const unitRegexResult = value.match(/\D+$/)
    const unit = unitRegexResult && unitRegexResult[0] as typeof UNITS[number]

    if (!unit) {
        const number = parseFloat(value)
        if (!isNaN(number)) return number
        return
    }

    const isCSSUnit = UNITS.includes(unit)
    if (!isCSSUnit) return debugLogger("Non-css unit detected " + unit)
    if (unit === '%') return

    const number = parseFloat(value.split(unit)[0])
    if (unit === 'rem' || unit === 'em') return number * 16
    if (unit === 'vh' || unit == 'vw') return number + '%'
    return number
}