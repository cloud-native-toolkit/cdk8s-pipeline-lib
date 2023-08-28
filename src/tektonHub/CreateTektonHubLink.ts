import { TektonHubLink } from './TektonHubLink';
const tektonHub = new TektonHubLink();
tektonHub.build().then((success => {
  if (!success) {
    throw Error('Unable to build Tekton Hub Link');
  }
  console.log('Tekton hub task completed!');
})).catch(reason => {
  console.error(reason);
});