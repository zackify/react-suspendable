export type Suspender<ReturnType> = {
  read: () => { data: ReturnType; args: any };
};

export function suspender<ReturnType>(
  promiseFn: (args: any) => Promise<any>,
  args: any
): Suspender<ReturnType> {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let data: ReturnType;
  let error: Error;
  let suspender = promiseFn(args).then(
    r => {
      status = 'success';
      data = r;
    },
    e => {
      status = 'error';
      error = e;
    }
  );
  return {
    //@ts-ignore
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw error;
      } else if (status === 'success') {
        return { data, args };
      }
    },
  };
}
