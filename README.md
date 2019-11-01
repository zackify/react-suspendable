# Suspender

Not really meant for anything serious yet, and may never be.

This is a package that wraps async functions to be used with Suspense. You can see in the example folder how that looks.

### Run the example

The example contains code that helped me get more familiar with suspense data loading. Take a look at the example/src directory.

```
yarn
yarn start

// in another tab
cd example
yarn
yarn start
```

## Basic fetch

```js
import { suspender } from 'react-suspender';

const getData = async type => {
  if (type === 'success') {
    let response = await fetch('https://test.com');
    let json = await response.json();
    return json;
  }
};

const initialRequest = suspender(getData, 'success');

const App = () => {
  let [user, setUser] = React.useState(initialRequest);
  return (
    <React.Suspense fallback={<div>sidebar loader...</div>}>
      <SomeComponent user={user} />
    </React.Suspense>
  );
};
```

## Error Handling

See `examples/src/TestContent.tsx`. You can wrap your component in an error boundary, and then you will be able to render something if an async request throws a promise rejection

## TypeScript example

```js
type User = { name: string };
// initial request must be created outside the render, or else you will be in an infinite loop
const initialRequest = suspender < User > (getData, 'success');

const App = () => {
  let [user, setUser] = React.useState(initialRequest);
  return (
    <React.Suspense fallback={<div>sidebar loader...</div>}>
      <Sidebar user={user} />
    </React.Suspense>
  );
};

// Example using TS types with suspense
type SidebarProps = {
  user: Suspender<User>,
};

const Sidebar = ({ user }: SidebarProps) => {
  const { data } = user.read();
  // data is correctly typed using the User type above
  return null;
};
```
