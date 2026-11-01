export async function launchWorkflow(context) {
  return {
    type: 'launch-request',
    state: 'prepared',
    message: 'Allowlisted workflow prepared for an approved downstream adapter.',
    params: context.params
  };
}
