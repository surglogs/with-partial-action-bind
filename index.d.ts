declare const withPartialActionBind: ({
  action,
  name,
  args,
  builder,
}: {
  action: () => any
  name: string
  args?: (string | number | ((state: any, props: any) => any))[]
  builder?: ({
    action,
    params,
  }: {
    action: (args: any[]) => any
    params: any[]
  }) => (...args: any[]) => any
}) => (component: any) => any

export = withPartialActionBind
