import path from 'node:path'

import { IconStyle, icons as PhosphorIcons, type IconEntry } from '@phosphor-icons/core'

/**
 * ***********************************************
 * Types and Constants
 * ***********************************************
 */

const WEIGHTS = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'] as IconStyle[]

type WeightMap = {
   [key in IconStyle]: string
}

/**
 * ***********************************************
 * Utilities - index.d.ts output
 * ***********************************************
 */

const ts = String.raw

// Based on https://github.com/phosphor-icons/react/blob/master/src/lib/SSRBase.tsx
const AstroPhosphorIconPropsType = ts`Partial<{
   weight: ${WEIGHTS.map((w) => `"${w}"`).join(' | ')};
   size: number | string;
   color: string;
   mirrored: boolean;
   alt: string;
} & HTMLAttributes<"svg">>`

// Note: __AstroPhosphorIconProps is only used internally in each Astro component...
const indexDtsStart = ts`import type { HTMLAttributes } from "astro/types";

export type __AstroPhosphorIconProps = ${AstroPhosphorIconPropsType};

`

// ...then hardcoded each time in the component declaration for better Intellisense
function getComponentDeclaration(fileName: string, iconEntry: IconEntry) {
   return ts`/**
 *
 * @name ${iconEntry.name}  
 * @categories ${iconEntry.categories.join(', ')}  
 * @since ${iconEntry.published_in}
 * @see [See "${iconEntry.name}" on phosphoricons.com](https://phosphoricons.com/?q="${iconEntry.name}")
 */
export declare function ${fileName}(__props: ${AstroPhosphorIconPropsType}): any;

`
}

/**
 * ***********************************************
 * Utilities - .astro output
 * ***********************************************
 */

const astro = String.raw

async function getSvgHtml(weight: IconStyle, identifier: IconEntry['name']) {
   const fileName =
      weight === IconStyle.REGULAR ? `${identifier}.svg` : `${identifier}-${weight}.svg`

   const filePath = path.join(
      process.cwd(),
      'node_modules/@phosphor-icons/core/assets',
      weight,
      fileName
   )

   return Bun.file(filePath).text()
}

function getAstroComponentContents(map: WeightMap) {
   return astro`---
import type { __AstroPhosphorIconProps } from "../index.d.ts";

const weights = new Map<__AstroPhosphorIconProps["weight"], string>([
   ["thin", '${map.thin}'],
   ["light", '${map.light}'],
   ["regular", '${map.regular}'],
   ["bold", '${map.bold}'],
   ["fill", '${map.fill}'],
   ["duotone", '${map.duotone}'],
]);

const { color = "currentColor", weight = "regular", size = "1em", mirrored, alt, ...svgProps } = Astro.props as __AstroPhosphorIconProps;
---

<svg
   xmlns="http://www.w3.org/2000/svg"
   viewBox="0 0 256 256"
   width={size}
   height={size}
   fill={color}
   transform={mirrored ? "scale(-1, 1)" : ""}
   {...svgProps}
>
   {alt && <title>{alt}</title>}
   <slot />
   <Fragment set:html={weights.get(weight)} />
</svg>`
}

/**
 * ***********************************************
 * Build
 * ***********************************************
 */

export async function build() {
   try {
      let indexJs = ``
      let indexDts = indexDtsStart

      for (const Icon of PhosphorIcons) {
         const weightMap = {} as WeightMap
         const outputFileName = `Ph${Icon.pascal_name}`

         for (const WEIGHT of WEIGHTS) {
            const svgHtml = await getSvgHtml(WEIGHT, Icon.name)
            const svgInnerHtml = svgHtml.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1]

            if (!svgInnerHtml) {
               throw new Error(`🚫 Unable to extract SVG inner nodes for ${Icon.name}-${WEIGHT}`)
            }

            weightMap[WEIGHT] = svgInnerHtml
         }

         await Bun.write(
            `dist/components/${outputFileName}.astro`,
            getAstroComponentContents(weightMap)
         )

         indexDts += getComponentDeclaration(outputFileName, Icon)

         indexJs += `export { default as ${outputFileName} } from "./components/${outputFileName}.astro";\n`

         console.log(`✨ ${outputFileName}`)
      }

      await Bun.write('dist/index.d.ts', indexDts)
      console.log(`📦 dist/index.d.ts built!`)

      await Bun.write('dist/index.js', indexJs)
      console.log(`📦 dist/index.js built!`)

      process.exit(0)
   } catch (error) {
      console.error(error)
      process.exit(1)
   }
}

build()
