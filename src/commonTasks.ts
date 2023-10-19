/**
 * Creates a Namespace document with the given namespace.
 *
 * This creates a document suitable for using with the `TaskBuilder`
 * `fromScriptObject()` function, as shown here:
 *
 * ```typescript
 * new TaskStepBuilder().fromScriptObject(CreateNamespace('my-namespace');
 * ```
 *
 * @param name The name of the namespace
 *
 * @see
 */
export function CreateNamespace(name: string): any {
  return {
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: {
      name: name,
    },
  };
}
