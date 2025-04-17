# Phosphor Icons Astro

[Phosphor Icons](https://phosphoricons.com/) for Astro with great DX and the same official `@phosphor-icons/*` API.

> [!Note]
> This is a community maintained project and not officially released by the Phosphor Icons team.

## Features

- Same official API such as [@phosphor-icons/react](https://github.com/phosphor-icons/react) and [@phosphor-icons/vue](https://github.com/phosphor-icons/vue).
- No dependencies, compiled using the latest version of [@phosphor-icons/core](https://github.com/phosphor-icons/core).
- Easy-to-import and fully typed properties

## Installation

```sh
npm i phosphor-icons-astro
```

## Usage

```astro
---
import { PhHorse, PhHeart, PhCube } from 'phosphor-icons-astro'
---

<PhHorse />
<PhHeart size={32} color="hotpink" weight="fill" alt="Heart Rate" />
<PhCube mirrored aria-hidden="true" />
```

### Props

See [@phosphor-icons/react - Props](https://github.com/phosphor-icons/react?tab=readme-ov-file#props)

### Composability

See [@phosphor-icons/react - Composability](https://github.com/phosphor-icons/react?tab=readme-ov-file#composability)

## License

MIT
