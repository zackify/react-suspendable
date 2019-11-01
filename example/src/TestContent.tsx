import * as React from 'react';
import { suspender } from '../../src';

const getContent = id =>
  new Promise(async (resolve, reject) => {
    //fake waiting for 200ms
    await new Promise(resolve => setTimeout(resolve, id === 2 ? 2000 : 200));

    if (id == 1 || id === 2) resolve({ date: id === 1 ? '2014' : '2015' });
    else reject({ message: 'error loading id' });
  });

const initialContent = suspender(getContent, 1);

export const TestContent = () => {
  const [content, setContent] = React.useState(initialContent);

  // this content will render the divs while waiting on the content to come back. extend the getContent timeout to inspect futher
  return (
    <ErrorBoundary fallback={'failed to load'}>
      <div>
        <div style={{ display: 'flex' }}>
          Created in <Date content={content} />
        </div>
        <Next content={content} setContent={setContent} />
      </div>
    </ErrorBoundary>
  );
};

// example component underneath that reads the date
const Date = ({ content }) => {
  let { data } = content.read();

  return <div style={{ marginLeft: 4 }}>{data.date}</div>;
};

// this handles trying to load another content section. it also fakes an error on the 3rd id
const Next = ({ content, setContent }) => {
  let [startTransition, isPending] = React.useTransition({ timeoutMs: 1200 });
  let { data, args } = content.read();

  return (
    <div
      style={{ opacity: isPending ? 0.5 : 1 }}
      onClick={() => {
        startTransition(() => {
          setContent(suspender(getContent, args + 1));
        });
      }}
    >
      Next content
    </div>
  );
};

// this would be used all over your app
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
