# mantine-icon-picker

A fast, virtualized **icon picker** for React, built on **Mantine** and **react-window**.

* By default, it uses **[`tabler-dynamic-icon`](https://www.npmjs.com/package/tabler-dynamic-icon)**.
* But you can **replace it entirely** with your own icons — emojis, custom SVG class names, or any text-based icons.

---

## Features

* ⚡ **Virtualized grid** with `react-window` → smooth scrolling even with thousands of icons
* 🎨 **Mantine UI** (`Popover`, `ActionIcon`, etc.)
* 🧭 **LTR / RTL** support
* 🔌 **Custom Icon Component**
* 🔤 **Type-safe Tabler integration** out of the box
* 🎛️ Works with **any icon source**

---

## Installation

```bash
# with pnpm
pnpm add mantine-icon-picker @mantine/core @mantine/hooks react-window clsx
# install these as well, if you want to use built-in Tabler icons
# Check tabler-dynamic-icon package for installation guide
pnpm add tabler-dynamic-icon @tabler/icons-webfont
```

> `tabler-dynamic-icon` is **default**, but optional.

### Required styles

```ts
import 'mantine-icon-picker/style.css';
```

---

## Quick Start (default with Tabler)

```tsx
import { useState } from 'react';
import { IconPicker } from 'mantine-icon-picker';

export default function Demo() {
  const [icon, setIcon] = useState<string | undefined>('alarm');

  return (
    <div>
      <IconPicker
        value={icon}
        onSelect={setIcon}
        iconSize={20}
        itemPerColumn={10}
        height={300}
      />

      <div style={{ marginTop: 12 }}>
        Selected Icon Name: {icon || '—'}
      </div>
    </div>
  );
}
```

---

## Props

| Prop                 | Type             | Default          | Description                                       |
| -------------------- | ---------------- | ---------------- | ------------------------------------------------- |
| `color`              | `string`         | —                | Passed to Mantine `ActionIcon`.                   |
| `defaultIcon`        | `string`         | —                | Icon shown when `value` is empty.                 |
| `direction`          | `'ltr' \| 'rtl'` | `'ltr'`          | Grid direction.                                   |
| `height`             | `number`         | `300`            | Grid viewport height.                             |
| `iconComponent`      | `(props) => JSX` | —                | Custom renderer for icons.                        |
| `iconSize`           | `number`         | —                | Size in px for default icon renderer.             |
| `iconsList`          | `string[]`       | `IconsClassName` | Array of icon names. Default: all Tabler classes. |
| `itemPerColumn`      | `number`         | `9`              | Grid column count.                                |
| `itemSize`           | `number`         | `30`             | Grid cell size in px.                             |
| `onSelect`           | `(icon) => void` | —                | Called with selected icon string.                 |
| `overscanRowCount`   | `number`         | `4`              | Extra rows rendered above/below.                  |
| `value`              | `string`         | —                | Controlled icon value.                            |

---

## Usage Patterns

### 1) Controlled

```tsx
<IconPicker value={icon} onSelect={setIcon} />
```

### 2) Uncontrolled

```tsx
<IconPicker onSelect={(v) => console.log('picked', v)} />
```

---

## 🔄 Replacing Tabler with your own `iconsList`

### Emoji picker 🎉

```tsx
const EMOJIS = ['😀', '🎉', '🔥', '🚀', '❤️', '📦', '💡'];

<IconPicker
  iconsList={EMOJIS}
  iconComponent={({ iconName, iconSize = 20, isSelected }) => (
    <span
      style={{
        fontSize: iconSize,
        filter: isSelected ? 'drop-shadow(0 0 2px red)' : undefined,
      }}
    >
      {iconName}
    </span>
  )}
  onSelect={(emoji) => console.log('picked emoji:', emoji)}
/>
```

---

## Styling

CSS hooks for customization:

* `.icon-picker__grid`
* `.icon-picker__item`
* `.icon-picker__item--selected`
* `.icon-picker__icon`
* `.icon-picker__icon--selected`

---

### Performance notes

* `react-window` only renders visible rows + `overscanRowCount`.
* Keep `itemSize` realistic to avoid layout thrashing.
* If you pass a heavy `iconComponent`, memoize it for smoother scrolling.

---

## Accessibility

* Mantine `Popover` handles focus + escape
* For keyboard navigation, supply your own `iconComponent` as `<button aria-pressed={isSelected}>…</button>`

---

## License

MIT
