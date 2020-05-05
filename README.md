# Tag Input

[Demo](https://arusanov.github.io/tag-input/)

## How to use

This library provides UMD build, so you can use it in webpack or just as is in HTML

```html
<script src="tag-input.umd.js" charset="UTF-8"></script>
<script>
  var emailsInput = EmailsInput(document.querySelector('#some-input'), options)
</script>
```

Following `options` can be provided:

1. `placeholder` - placeholder text for input (Default `add more people…`)

2. `validate` - validation function (Defaults to simple email validation regexp)

3. `tags` - initial tags (emails) (Defaults to [])

4. `type` - input type. `text` or `email` (Defaults to `email`)

5. `style` - custom CSS classes for styling

### API

#### Add Item

```js
emailsInput.addItem('email@mail.com')
```

#### Get current tags (emails) both valid and invalid

```js
emailsInput.tags
```

#### Replace current items with new

```js
emailsInput.replaceItems(['email@mail.com'])
```

Clear all items

```js
emailsInput.replaceItems()
```

### Events

Events are triggered on the element that was used to create `TagInput`

```js
var node = document.querySelector('#emails-input')
var emailsInput = EmailsInput(node)

// Added tag event
node.addEventListener('tagadded', function (e) {
  console.log('email added:', e.detail.tag)
})

// Deleted tag event
node.addEventListener('tagdeleted', function (e) {
  console.log('email deleted:', e.detail.tag)
})
```

## Design choices

This component is done as tags+single line input element,
but there's another way of doing a similar component:

`conenteditable` div + a lot of `document.execCommand` goodness,
given that this component needs to support IE11 implementation of
all these quirks and weirdness of `execCommand` can take from week to indefinite amount of time,
so this is why it's done this way.

## What's missing

### Mobile adaption

It should work fine on any mobile browser but some additional adaptations can be made

### a11y

It does not exist yet, but definitely should be added.


