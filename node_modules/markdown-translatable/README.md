# A Collection of Components for Translating Markdown Files.

Install using npm or yarn:
`npm install markdown-translatable`
`yarn add markdown-translatable`

Import the relevant components to the top of your React file:
```js
import {
  DocumentTranslatable,
  BlockEditable,
} from "markdown-translatable";
```

Use in your component for editing Markdown:
```jsx
const markdown = "**Hello** __world__";
const _translation = "**नमस्ते** __दुनिया__";

initialState = {
  translation: _translation,
};

<SectionTranslatable
  original={markdown}
  translation={state.translation}
  onTranslation={(translation) =>
    setState({translation})
  }
/>
```

Use in your component for translating a Markdown file:
```jsx
const markdown = "**Hello** __world__";
const _translation = "**नमस्ते** __दुनिया__";

initialState = {
  translation: _translation,
};

<DocumentTranslatable
  original={markdown}
  translation={state.translation}
  onTranslation={(translation) =>
    setState({ translation })
  }
/>
```

See the Style Guide for more examples:
https://unfoldingword-box3.github.io/markdown-translatable/
