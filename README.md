![build](https://github.com/arusanov/tag-input/workflows/Node.js%20CI/badge.svg)

# Tag Input

[Demo](https://arusanov.github.io/tag-input/)

## How to use

This library provides UMD build, so you can use it in webpack or just as is in HTML

```html
<script src="tag-input.umd.js" charset="UTF-8"></script>
<script>
  var tagInput = taginput(document.querySelector('#some-input'), options)
</script>
```

Following `options` can be provided:

1. `placeholder` - placeholder text for input

2. `validate` - validation function (Empty by default)

3. `tags` - initial tags (Defaults to [])

4. `type` - input type. `text` or `email` (Defaults to `text`)

5. `style` - custom CSS classes for styling

### API

#### Add Item

```js
tagInput.addItem('tag1')
```

#### Get current tags both valid and invalid

```js
tagInput.tags
```

#### Replace current items with new

```js
tagInput.replaceItems(['tag1','tag2'])
```

Clear all items

```js
tagInput.replaceItems()
```

### Events

Events are triggered on the element that was used to create `TagInput`

```js
var node = document.querySelector('#some-input')
var tagInput = taginput(node)

// Added tag event
node.addEventListener('tagadded', function (e) {
  console.log('tag added:', e.detail.tag)
})

// Deleted tag event
node.addEventListener('tagdeleted', function (e) {
  console.log('tag deleted:', e.detail.tag)
})
```

## What's missing

### Mobile adaption

It should work fine on any mobile browser but some additional adaptations can be made

### a11y

It does not exist yet, but definitely should be added.


