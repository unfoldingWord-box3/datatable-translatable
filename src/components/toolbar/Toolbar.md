```js
const [preview, setPreview] = React.useState(true);
const [changed, setChanged] = React.useState(true);

const props = {
  preview,
  onPreview: (value) => setPreview(!preview),
  changed,
  onSave: (value) => setChanged(!changed),
};

<Toolbar {...props} />
```