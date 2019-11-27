export default function invokeAction (actions: any, actionName: string, ...args) {
  return actions[actionName].apply(actions, args)
}
