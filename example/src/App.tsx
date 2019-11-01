import * as React from 'react';
import { suspender, Suspender } from '../../src';
import { TestContent } from './TestContent';

// this can be any promise, doesnt matter
const getData = params =>
  new Promise(async (resolve, reject) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    resolve({ name: 'Test user' });
  });

type User = { name: string };
// initial request must be created outside the render, or else you will be in an infinite loop
const initialRequest = suspender<User>(getData, 'success');

const App = () => {
  let [user, setUser] = React.useState(initialRequest);
  return (
    <div>
      <React.Suspense fallback={<div>sidebar loader...</div>}>
        <Sidebar user={user} />
      </React.Suspense>
      <div>This is the main content area</div>
      <TestContent />
    </div>
  );
};

// Example using TS types with suspense
type SidebarProps = {
  user: Suspender<User>;
};

const Sidebar = ({ user }: SidebarProps) => {
  let { data } = user.read();

  return <div>Hello {data.name}</div>;
};

export default App;
